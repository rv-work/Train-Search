import { StationGraph, Train } from "../Models/Train.js";

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

async function findMultiTrainConnections(fromStation, toStation , res) {
  try {
    const queue = [[fromStation]];
    const visited = new Set();
    const allPaths = [];
    let filteredTrainPaths = [];
    
    while (queue.length > 0) {
      const path = queue.shift();
      const currentStation = path[path.length - 1];

      if (currentStation === toStation) {
        allPaths.push(path);
        continue;
      }

      visited.add(currentStation);
      const stationData = await StationGraph.findOne({ station_code: currentStation }).lean();
      if (!stationData) continue;

      stationData.stations_connected.forEach(({ station }) => {
        if (!visited.has(station)) {
          queue.push([...path, station]);
        }
      });
    }

    const validPaths = allPaths.filter(path => path.indexOf(fromStation) < path.indexOf(toStation));

    for (const path of validPaths) {
      const journey = [];
      let valid = true;

      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];

        const stationData = await StationGraph.findOne({ station_code: current }).lean();
        if (!stationData) return null;

        const connection = stationData.stations_connected.find(conn => conn.station === next);
        if (!connection) return null;

        const trains = await Train.find({
          "train_number": { "$in": connection.trains },
          "$or": [
            { "seat_availability.1AC.status": "Available" },
            { "seat_availability.2AC.status": "Available" },
            { "seat_availability.3AC.status": "Available" },
            { "seat_availability.SL.status": "Available" }
          ]
        }).lean();

        if (trains.length === 0) {
          valid = false;
          break;
        }

        journey.push({ from: current, to: next, trains});
      }

      if (valid) {
        for (let i = 0; i < journey.length - 1; i++) {
          const currentSegment = journey[i];
          const nextSegment = journey[i + 1];

          const validConnections = currentSegment.trains.filter((trainA) => {
            const arrivalTimeAtIntermediate = trainA.intermediate_stations.find(
              (station) => station.code === currentSegment.to
            )?.arrival_time;

            if (!arrivalTimeAtIntermediate) return false;

            return nextSegment.trains.some((trainB) => {
              const departureTimeFromIntermediate = trainB.intermediate_stations.find(
                (station) => station.code === nextSegment.from
              )?.departure_time;

              if (!departureTimeFromIntermediate) return false;

              return (
                new Date(`1970-01-01T${departureTimeFromIntermediate}`) >
                new Date(`1970-01-01T${arrivalTimeAtIntermediate}`) 
              );
            });
          });

          if (validConnections.length === 0) {
            valid = false;
            break;
          }

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


const searchTrains = async (req, res) => {
  const { fromStation, toStation } = req.query; 

  if (!fromStation || !toStation) {
    return res.status(400).json({ success: false, message: "Source and Destination are required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const directTrains = await findDirectConnections(fromStation, toStation);
    
    res.write(`data: ${JSON.stringify({ type: "directTrains", trains: directTrains })}\n\n`);

    await findMultiTrainConnections(fromStation, toStation, res);

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
    res.end();
  }
};

export default searchTrains;
