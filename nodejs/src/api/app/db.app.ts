import mongoose from "mongoose";
import {
  MONGODB_URI,
  MONGODB_CONNECT_TIMEOUT_MS,
  MONGODB_MIN_POOLSIZE,
  MONGODB_MAX_POOLSIZE,
} from "@/configs/db.config";

export default class MongoDBConnectivity {
  private static instance: MongoDBConnectivity;

  private constructor() {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);

      throw new Error("MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  }

  public async connect(): Promise<void> {
    await mongoose.connect(MONGODB_URI, {
      minPoolSize: MONGODB_MIN_POOLSIZE,
      maxPoolSize: MONGODB_MAX_POOLSIZE,
      connectTimeoutMS: MONGODB_CONNECT_TIMEOUT_MS,
    });
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public static getInstance(): MongoDBConnectivity {
    if (!MongoDBConnectivity.instance) {
      MongoDBConnectivity.instance = new MongoDBConnectivity();
    }

    return MongoDBConnectivity.instance;
  }
}
