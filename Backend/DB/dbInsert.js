import mongoose from 'mongoose';
import {TrainData} from "../Utils/Train/TRAIN_DATA.js";
import TRAINS_NAME from '../Utils/Train/TRAIN_LIST.js';
import {Train , TrainName} from "../Models/Train.js";



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

const batchInsert = async (dataArray, batchSize = 100) => {
  console.log("Starting batch processing...");
  for (let i = 0; i < dataArray.length; i += batchSize) {
    const batch = dataArray.slice(i, i + batchSize);

    try {
      console.log(`🚀 Processing batch ${Math.floor(i / batchSize) + 1}`);
      await Train.insertMany(batch, { ordered: false }); 
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}`);
    } catch (error) {
      console.error(`❌ Failed to process batch starting at index ${i}`, error);
    }
  }
  console.log("✅ All data batches inserted.");
};

const insertData = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await connectDB();

    console.log("⏳ Starting data insertion...");
    await batchInsert(TrainData); 

    console.log("🎉 All train data inserted successfully.");

    console.log("🎉 All train name inserted successfully.");
  } catch (error) {
    console.error("❌ Error during data insertion: ", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
};

const insertTrainNames = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await connectDB();

    console.log("⏳ Starting name insertion...");
    await TrainName.insertMany(TRAINS_NAME); 

    console.log("🎉 All train name inserted successfully.");
  } catch (error) {
    console.error("❌ Error during data insertion: ", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
};

// insertData();
// insertTrainNames()
