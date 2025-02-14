import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/loggers";


dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    const connection = await mongoose.connect(mongoUri);
    logger.info(`Database connected: ${connection.connection.host}`);

    // Seed genres only in development mode
    // if (process.env.NODE_ENV !== "production") {
    //   await seedGenres();
    // }
  } catch (error) {
    logger.error(` Database Connection Error: ${(error as Error).message}`);
    // Instead of process.exit(1), handle retry logic or exit gracefully
  }
};

export default connectDB;
