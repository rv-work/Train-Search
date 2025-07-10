import mongoose from 'mongoose'

const connectDB = async () => {
  try {
     await mongoose.connect(process.env.DB_STRING );
    console.log("DataBase Connected Successfully !!!!")
  } catch (error) {
    console.log(`Eror in connecting with DataBase.....${error}`);
  }
}

export default connectDB;