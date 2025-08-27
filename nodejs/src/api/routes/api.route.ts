import { Router } from "express";
import authRouter from "./auth.route";
import documentRouter from "./document.route";
import leadRouter from "./lead.route";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/documents", documentRouter);
apiRouter.use("/leads", leadRouter);

export default apiRouter;
