import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/sccess.core";
import type { Handler } from "express";

export default class AuthController {
  public register: Handler = (req, res, next) => {
    new SuccessResponse({
      detail: "User registered successfully",
      successResponseItem: successResponses.AUTH_REGISTER_SUCCESS,
      metadata: ,
    }).sendResponse(res);
  };
}
