
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://ruvishushukla1:KN9NBvgregS6myD3@irctc.pntil.mongodb.net/Train-Data?retryWrites=true&w=majority&appName=IRCTC"; 

const applyIndexes = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const trainCollection = mongoose.connection.collection("trains");
    const stationGraphCollection = mongoose.connection.collection("stationgraphs");

    console.log("📌 Applying indexes...");

    await trainCollection.createIndexes([
      { key: { train_number: 1 } },
      { key: { "starting_station.code": 1 } },
      { key: { "intermediate_stations.code": 1 } },
      { key: { "terminating_station.code": 1 } },
      { key: { "seat_availability.1AC.status": 1 } },
      { key: { "seat_availability.2AC.status": 1 } },
      { key: { "seat_availability.3AC.status": 1 } },
      { key: { "seat_availability.SL.status": 1 } },
      { key: { "seat_availability.GEN.status": 1 } }
    ]);

    await stationGraphCollection.createIndexes([
      { key: { station_code: 1 }, unique: true },
      { key: { "stations_connected.station": 1 } }
    ]);

    console.log("✅ All indexes applied successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error applying indexes:", error);
  }
};

applyIndexes();
