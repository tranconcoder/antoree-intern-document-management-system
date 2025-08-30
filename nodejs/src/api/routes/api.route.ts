import { Router } from "express";
import authRouter from "./auth.route";
import documentRouter from "./document.route";
import leadRouter from "./lead.route";
import premiumRouter from "./premium.route";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/documents", documentRouter);
apiRouter.use("/leads", leadRouter);
apiRouter.use("/premium", premiumRouter);

export default apiRouter;
