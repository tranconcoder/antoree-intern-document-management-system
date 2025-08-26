import AuthController from "@/controllers/auth.controller";
import { RequestSource } from "@/enums/requestSource.enum";
import { catchAsyncExpress } from "@/middlewares/async.middleware.";
import validateZodPayload from "@/middlewares/zod.middleware";
import { loginUserSchema, registerUserSchema } from "@/validator/zod/user.zod";
import { Router } from "express";

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validateZodPayload(RequestSource.Body, registerUserSchema),
  catchAsyncExpress(authController.register)
);

authRouter.post(
  "/login",
  validateZodPayload(RequestSource.Body, loginUserSchema),
  catchAsyncExpress(authController.login)
);

export default authRouter;
