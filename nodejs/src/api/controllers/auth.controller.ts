import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/sccess.core";
import AuthService from "@/services/auth.service";
import type { RegisterUserInput } from "@/validator/zod/user.zod";
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
}
