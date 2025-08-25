import express from "express";

// Middleware
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rootRouter from "./api/routes";

const app = express();

// Third-party middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database

// Handle router
app.use(rootRouter);

export default app;
