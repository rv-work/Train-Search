import mongoose from 'mongoose';
import { TrainData } from "../Utils/Train/TRAIN_DATA.js";  
import { StationGraph } from '../Models/Train.js'; 

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ruvishushukla1:KN9NBvgregS6myD3@irctc.pntil.mongodb.net/Train-Data?retryWrites=true&w=majority&appName=IRCTC", {
      serverSelectionTimeoutMS: 30000, 
    });
    console.log("✅ Connected to database successfully.");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
};

async function buildStationGraph() {
  const graph = {}; 

  TrainData.forEach(train => {
    const startingStation = train.starting_station.code;
    const terminatingStation = train.terminating_station.code;
    
    const intermediateStations = train.intermediate_stations.map(station => station.code);

    const allStations = [startingStation, ...intermediateStations, terminatingStation];

    for (let i = 0; i < allStations.length - 1; i++) {
      const currentStation = allStations[i];
      const nextStation = allStations[i + 1];

      if (!graph[currentStation]) {
        graph[currentStation] = {
          station_code: currentStation,
          stations_connected: []
        };
      }

      let connection = graph[currentStation].stations_connected.find(conn => conn.station === nextStation);

      if (!connection) {
        connection = {
          station: nextStation,
          trains: [train.train_number],
          connection_count: 1
        };
        graph[currentStation].stations_connected.push(connection);
      } else {
        connection.trains.push(train.train_number);
        connection.connection_count += 1;
      }
    }
  });

  for (const stationCode in graph) {
    const stationData = graph[stationCode];

    let stationRecord = await StationGraph.findOne({ station_code: stationCode });

    if (!stationRecord) {
      stationRecord = new StationGraph(stationData);
    } else {
      stationRecord.stations_connected = stationData.stations_connected;
    }

    await stationRecord.save();
  }

  console.log('Station graph built and saved to MongoDB.');
}

connectDB().then(() => {
  buildStationGraph();
});