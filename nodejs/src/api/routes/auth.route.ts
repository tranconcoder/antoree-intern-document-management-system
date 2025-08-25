import AuthController from "@/controllers/auth.controller";
import { RequestSource } from "@/enums/requestSource.enum";
import validateZodPayload from "@/middlewares/zod.middleware";
import { registerUserSchema } from "@/validator/zod/user.zod";
import { Router } from "express";

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validateZodPayload(RequestSource.Body, registerUserSchema),
  authController.register
);

export default authRouter;
