import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/userRoute.js';
import postRoutes from './Routes/postRoute.js';
import messageRoutes from './Routes/messageRoute.js';
import poycotRoutes from './Routes/poycotRoute.js';
import {v2 as cloudinary} from 'cloudinary';
import { app , server } from "./socket/socket.js";

dotenv.config();
connectDB();

const Port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//middlewares
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true })); //To parse form data in the req.body
app.use(cookieParser());

//Routes
app.use("/api/users" , userRoutes);
app.use("/api/posts" , postRoutes);
app.use("/api/messages" , messageRoutes);
app.use("/api/poycot" , poycotRoutes);


server.listen(Port , () => {
  console.log(`Server Started`);
})
