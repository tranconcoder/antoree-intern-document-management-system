import express from "express";

// Middleware
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";

import rootRouter from "./api/routes";
import MongoDBConnectivity from "./api/app/db.app";

const app = express();

// Third-party middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
const mongoDB = MongoDBConnectivity.getInstance();
await mongoDB.connect();

// Handle router
app.use(rootRouter);

export default app;
