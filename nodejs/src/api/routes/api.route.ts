import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

export default apiRouter;
