import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database Connected Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.log("Initial DB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;