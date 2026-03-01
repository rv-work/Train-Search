import { StationGraph, Train } from "../Models/Train.js";

// ============================================================================
// 1. GLOBAL IN-MEMORY GRAPH & HELPERS
// ============================================================================
let inMemoryGraph = new Map();
let isGraphLoaded = false;

// Function to load Graph into RAM exactly once
const loadGraph = async () => {
  if (isGraphLoaded) return;
  console.log("⏳ Loading Station Graph into Memory for ultra-fast routing...");
  try {
    const allNodes = await StationGraph.find({}).lean();
    allNodes.forEach(node => {
      inMemoryGraph.set(node.station_code, node.stations_connected);
    });
    isGraphLoaded = true;
    console.log(`✅ Graph loaded successfully! Configured ${inMemoryGraph.size} stations in RAM.`);
  } catch (err) {
    console.error("❌ Failed to load graph into memory", err);
  }
};

// Helper to safely extract arrival time
const getArrivalTime = (train, stationCode) => {
  if (train.terminating_station.code === stationCode) return train.terminating_station.arrival_time;
  const stop = train.intermediate_stations.find(s => s.code === stationCode);
  return stop ? stop.arrival_time : null;
};

// Helper to safely extract departure time
const getDepartureTime = (train, stationCode) => {
  if (train.starting_station.code === stationCode) return train.starting_station.departure_time;
  const stop = train.intermediate_stations.find(s => s.code === stationCode);
  return stop ? stop.departure_time : null;
};

// ============================================================================
// 2. DIRECT TRAINS SEARCH LOGIC
// ============================================================================
async function findDirectConnections(fromStation, toStation) {
  try {
    const cursor = Train.find({
      "$and": [
        {
          "$or": [
            { "starting_station.code": fromStation },
            { "intermediate_stations.code": fromStation }
          ]
        },
        {
          "$or": [
            { "intermediate_stations.code": toStation },
            { "terminating_station.code": toStation }
          ]
        },
        {
          "$or": [
            { "seat_availability.1AC.status": "Available" },
            { "seat_availability.2AC.status": "Available" },
            { "seat_availability.3AC.status": "Available" },
            { "seat_availability.SL.status": "Available" },
            { "seat_availability.GEN.status": "Available" }
          ]
        }
      ]
    }).lean().cursor();

    let filteredTrains = [];

    for await (const train of cursor) {
      let fromIndex = train.intermediate_stations.findIndex(station => station.code === fromStation);
      let toIndex = train.intermediate_stations.findIndex(station => station.code === toStation);

      if (train.starting_station.code === fromStation && train.terminating_station.code === toStation) {
        filteredTrains.push(train);
      } else if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        filteredTrains.push(train);
      }
    }

    return filteredTrains;
  } catch (error) {
    console.error("Error in findDirectConnections:", error);
    throw error;
  }
}

// ============================================================================
// 3. MULTI-TRAIN (1-HOP TRANSFER) SEARCH LOGIC
// ============================================================================
async function findMultiTrainConnections(fromStation, toStation, res) {
  try {
    const queue = [{ path: [fromStation], level: 0 }];
    const visited = new Set();
    const allPaths = [];
    let filteredTrainPaths = [];
    
    // Max 1 station transfer allowed (A -> B -> C = Level 2)
    const MAX_LEVEL = 5; 

    // --- PHASE 1: Fast In-Memory BFS Traversal (0 DB Calls) ---
    while (queue.length > 0) {
      const { path, level } = queue.shift();
      const currentStation = path[path.length - 1];

      if (currentStation === toStation) {
        allPaths.push(path);
        continue;
      }

      if (level >= MAX_LEVEL) continue; 

      visited.add(currentStation);
      
      const connectedStations = inMemoryGraph.get(currentStation);
      if (!connectedStations) continue;

      connectedStations.forEach(({ station }) => {
        // Allow re-visiting destination to find alternative routes
        if (!visited.has(station) || station === toStation) {
          queue.push({ path: [...path, station], level: level + 1 });
        }
      });
    }

    // Filter out direct routes (handled by findDirectConnections)
    const validPaths = allPaths.filter(path => path.length > 2);

    // --- PHASE 2: Check Trains & Timings for valid routes ---
    for (const path of validPaths) {
      const journey = [];
      let valid = true;

      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];

        const connectedStations = inMemoryGraph.get(current);
        if (!connectedStations) { valid = false; break; }

        const connection = connectedStations.find(conn => conn.station === next);
        if (!connection) { valid = false; break; }

        // Fetch train details for this segment
        const trains = await Train.find({
          "train_number": { "$in": connection.trains },
          "$or": [
            { "seat_availability.1AC.status": "Available" },
            { "seat_availability.2AC.status": "Available" },
            { "seat_availability.3AC.status": "Available" },
            { "seat_availability.SL.status": "Available" },
            { "seat_availability.GEN.status": "Available" }
          ]
        }).lean();

        if (trains.length === 0) {
          valid = false;
          break;
        }

        journey.push({ from: current, to: next, trains});
      }

      if (valid) {
        // --- PHASE 3: Timing & Layover Validation ---
        for (let i = 0; i < journey.length - 1; i++) {
          const currentSegment = journey[i];
          const nextSegment = journey[i + 1];

          const validConnections = currentSegment.trains.filter((trainA) => {
            const arrTime = getArrivalTime(trainA, currentSegment.to);
            if (!arrTime) return false;

            return nextSegment.trains.some((trainB) => {
              // Rule 1: Cannot transfer to the same train
              if (trainA.train_number === trainB.train_number) return false;

              const depTime = getDepartureTime(trainB, nextSegment.from);
              if (!depTime) return false;

              // Rule 2: Time calculation
              const arrDate = new Date(`1970-01-01T${arrTime}:00Z`);
              const depDate = new Date(`1970-01-01T${depTime}:00Z`);
              
              let diff = depDate - arrDate;
              // Handle overnight layovers
              if (diff < 0) diff += 24 * 60 * 60 * 1000; 

              const layoverMinutes = diff / (1000 * 60);
              
              // Rule 3: Layover must be between 15 mins and 1 hours (60 mins)
              return layoverMinutes >= 15 && layoverMinutes <= 60;
            });
          });

          if (validConnections.length === 0) {
            valid = false;
            break;
          }

          // Update the first segment's train list to only include valid inbound trains
          journey[i].trains = validConnections;
        }

        if (valid) {
          res.write(`data: ${JSON.stringify({ type: "multi-train", trains: journey })}\n\n`);
          filteredTrainPaths.push(journey);
        }
      }
    }

    return filteredTrainPaths;
  } catch (error) {
    console.error("Error in findMultiTrainConnections:", error);
    throw error;
  }
}

// ============================================================================
// 4. MAIN SEARCH CONTROLLER
// ============================================================================
const searchTrains = async (req, res) => {
  // Ensure In-Memory graph is loaded before searching
  await loadGraph();

  const { fromStation, toStation } = req.query; 

  if (!fromStation || !toStation) {
    return res.status(400).json({ success: false, message: "Source and Destination are required" });
  }

  // Setup Server-Sent Events (SSE) headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // 1. Fetch and stream direct trains
    const directTrains = await findDirectConnections(fromStation, toStation);
    res.write(`data: ${JSON.stringify({ type: "directTrains", trains: directTrains })}\n\n`);

    // 2. Fetch and stream multi-train routes (Hops)
    await findMultiTrainConnections(fromStation, toStation, res);

    // 3. End stream
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Search Error:", error);
    res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
    res.end();
  }
};

export default searchTrains;