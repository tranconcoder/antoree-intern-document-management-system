import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/success";
import AuthService from "@/services/auth.service";
import type {
  LoginUserInput,
  RegisterUserInput,
} from "@/validator/zod/user.zod";
import type { Handler } from "express";

export default new (class AuthController {
  public register: Handler = async (req, res, next) => {
    const registerPayload = req.body as RegisterUserInput;

    new SuccessResponse({
      detail: "User registered successfully",
      successResponseItem: successResponses.AUTH_REGISTER_SUCCESS,
      metadata: await AuthService.register(registerPayload),
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

  public refreshToken: Handler = async (req, res, next) => {
    const { refreshToken } = req.body;

    new SuccessResponse({
      detail: "Token refreshed successfully",
      successResponseItem: successResponses.AUTH_SUCCESS,
      metadata: await AuthService.refreshToken(refreshToken),
    }).sendResponse(res);
  };

  public logout: Handler = async (req, res, next) => {
    const { userId, jti } = req.body;

    await AuthService.logout(userId, jti);

    new SuccessResponse({
      detail: "Logged out successfully",
      successResponseItem: successResponses.AUTH_SUCCESS,
      metadata: { message: "Logged out successfully" },
    }).sendResponse(res);
  };

  public debugKeyTokens: Handler = async (req, res, next) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const KeyTokenService = (await import("@/services/keyToken.service"))
      .default;
    const keyTokenModel = (await import("@/models/keyToken.model")).default;

    const allTokens = await keyTokenModel.find({ userId }).lean();

    res.json({
      success: true,
      data: {
        userId,
        totalTokens: allTokens.length,
        tokens: allTokens.map((t) => ({
          id: t._id,
          jti: t.jti,
          created_at: t.created_at,
          updated_at: t.updated_at,
          publicKeyLength: t.publicKey?.length,
        })),
      },
    });
  };
})();
