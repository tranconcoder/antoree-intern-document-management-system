import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/sccess.core";
import AuthService from "@/services/auth.service";
import type {
  LoginUserInput,
  RegisterUserInput,
} from "@/validator/zod/user.zod";
import type { Handler } from "express";

export default class AuthController {
  public register: Handler = (req, res, next) => {
    const registerPayload = req.body as RegisterUserInput;

    new SuccessResponse({
      detail: "User registered successfully",
      successResponseItem: successResponses.AUTH_REGISTER_SUCCESS,
      metadata: AuthService.register(registerPayload),
    }).sendResponse(res);
  };

  public login: Handler = async (req, res, next) => {
    const loginPayload = req.body as LoginUserInput;

    new SuccessResponse({
      detail: "User logged in successfully",
      successResponseItem: successResponses.AUTH_LOGIN_SUCCESS,
      metadata: await AuthService.login(loginPayload),
    }).sendResponse(res);
  };
}
