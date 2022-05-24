import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    app.listen(PORT, () => console.log(`server is running on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
