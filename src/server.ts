import express from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Allow requests from your frontend origin
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies if needed
}));


console.log("Server starting...")
app.use(bodyParser.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve React's built files
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));


//get secret file
const dbUri = process.env.MONGO_DB_CONNECTION!;

//connection to db
mongoose.connect(dbUri).then(()=>{
  console.log('connected to db')
})
.catch((err:any)=>{
  console.log(err)
});



app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

