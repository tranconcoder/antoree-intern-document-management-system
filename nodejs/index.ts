import { morgan } from 'morgan';
import express from "express";
import helmet from 'helmet';
import compression

// Middleware

const app = express();

app.use(morgan("dev"));
app.use(helmet())
app.use(compression())
