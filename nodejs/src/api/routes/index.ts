import { Router } from "express";
import apiRouter from "./api.route";

const rootRouter = Router();

rootRouter.use("/api", apiRouter);

export default rootRouter;
