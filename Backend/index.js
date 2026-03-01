import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './DB/dbConnect.js';
import TrainRoutes from './Routes/TrainRoutes.js';

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5100;

const allowedOrigins = [
  "http://localhost:5173",
  "https://train-ticket-rvn.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/trains", TrainRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});