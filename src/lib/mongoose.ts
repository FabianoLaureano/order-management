import mongoose from "mongoose";
import config from "../config/index.ts";
import type { ConnectOptions } from "mongoose";

const connectionOptions: ConnectOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: "order-management-challenge",
};

const connectDatabase = async (): Promise<void> => {
  if (!config.MONGO_CONNECTION_URI) {
    throw new Error("MONGO_CONNECTION_URI is not defined");
  }

  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI, connectionOptions);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from database successfully");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
};

export { connectDatabase, disconnectDatabase };