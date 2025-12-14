import mongoose from "mongoose";

let isConnected = false;
export const connectDB = async () => {
  if (isConnected) return;
  try {
    const response = await mongoose.connect(process.env.URI);
    isConnected = true;
    console.log("Database connected successfully", response.connection.host);
  } catch (error) {
    console.log(error);
  }
};
