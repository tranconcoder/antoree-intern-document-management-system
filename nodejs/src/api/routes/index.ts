import { Router } from "express";
import apiRouter from "./api.route";

const rootRouter = Router();

rootRouter.use("/v1/api", apiRouter);

export default rootRouter;
