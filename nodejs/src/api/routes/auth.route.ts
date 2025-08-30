import authController from "@/controllers/auth.controller";
import { RequestSource } from "@/enums/requestSource.enum";
import { catchAsyncExpress } from "@/middlewares/async.middleware.";
import validateZodPayload from "@/middlewares/zod.middleware";
import {
  loginUserSchema,
  registerUserSchema,
  refreshTokenSchema,
  logoutSchema,
} from "@/validator/zod/user.zod";
import { Router } from "express";

const authRouter = Router();

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

authRouter.post(
  "/refresh-token",
  validateZodPayload(RequestSource.Body, refreshTokenSchema),
  catchAsyncExpress(authController.refreshToken)
);

authRouter.post(
  "/logout",
  validateZodPayload(RequestSource.Body, logoutSchema),
  catchAsyncExpress(authController.logout)
);

authRouter.get(
  "/debug-tokens",
  catchAsyncExpress(authController.debugKeyTokens)
);

export default authRouter;
