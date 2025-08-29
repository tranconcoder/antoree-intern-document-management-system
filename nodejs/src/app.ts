import express from "express";

// Middleware
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import CORS_OPTIONS from "./api/configs/cors.config";

import rootRouter from "@/routes";
import MongoDBConnectivity from "@/app/db.app";
import { APP_VERSION } from "@/configs/app.config";
import errorHandler from "@/middlewares/errorHandler.middleware";

const app = express();

// Third-party middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors(CORS_OPTIONS));

// Express middleware
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 50000,
  })
);

// Ensure UTF-8 encoding for all responses
app.use((req, res, next) => {
  res.charset = "utf-8";
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Connect to database
const mongoDB = MongoDBConnectivity.getInstance();
await mongoDB.connect();

// Handle router
app.use(`/v${APP_VERSION}`, rootRouter);

// Error handler
app.use(errorHandler);

export default app;
