import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import { JwtService } from "@/services/jwt.service";
import type { RequestHandler } from "express";
import { catchAsyncExpress } from "./async.middleware.";
import type { ErrorResponseItem } from "@/types/error";
import KeyTokenService from "@/services/keyToken.service";

export const validateToken: RequestHandler = catchAsyncExpress(
  async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) throw errorResponses.AUTH_TOKEN_NOT_FOUND;

      const accessToken = token.split(" ")[1];
      if (!accessToken) throw errorResponses.AUTH_TOKEN_NOT_FOUND;

      const decoded = JwtService.decode(accessToken);
      if (!decoded) throw errorResponses.AUTH_TOKEN_NOT_FOUND;

      const { userId, jti } = decoded;
      const keyToken = await KeyTokenService.findKeyToken(userId, jti);
      if (!keyToken) throw errorResponses.AUTH_KEY_TOKEN_NOT_FOUND;

      const verifySuccess = !!JwtService.verify(
        accessToken,
        keyToken.publicKey
      );
      if (!verifySuccess) throw errorResponses.AUTH_TOKEN_NOT_FOUND;

      //   Add payload to request
      req.userId = userId;
      req.jti = jti;

      next();
    } catch (e: any) {
      throw new ErrorResponse({
        errorResponseItem: e,
      });
    }
  }
);
