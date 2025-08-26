import { Router } from "express";
import authRouter from "./auth.route";
import documentRouter from "./document.route";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/documents", documentRouter);

export default apiRouter;
