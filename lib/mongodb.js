import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        console.log("Connecting to MongoDB: ", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB connection failed!");
        console.log("error: ", error);
    }
}