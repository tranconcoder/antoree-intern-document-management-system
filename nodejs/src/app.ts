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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
const mongoDB = MongoDBConnectivity.getInstance();
await mongoDB.connect();

// Handle router
app.use(`/v${APP_VERSION}`, rootRouter);

// Error handler
app.use(errorHandler);

export default app;
