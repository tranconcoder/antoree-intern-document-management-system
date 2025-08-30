import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import { JwtService } from "@/services/jwt.service";
import type { RequestHandler } from "express";
import { catchAsyncExpress } from "./async.middleware.";
import KeyTokenService from "@/services/keyToken.service";

export const validateToken: RequestHandler = catchAsyncExpress(
  async (req, res, next) => {
    try {
      console.log("🔐 Auth middleware started");
      console.log("📝 Request headers:", req.headers);

      const token = req.headers["authorization"];
      if (!token) {
        console.log("❌ No authorization header found");
        throw new ErrorResponse({
          errorResponseItem: errorResponses.AUTH_TOKEN_NOT_FOUND,
        });
      }

      const accessToken = token.split(" ")[1];
      if (!accessToken) {
        console.log("❌ No Bearer token found");
        throw new ErrorResponse({
          errorResponseItem: errorResponses.AUTH_TOKEN_NOT_FOUND,
        });
      }

      console.log("🎫 Access Token:", accessToken.substring(0, 50) + "...");

      const decoded = JwtService.decode(accessToken);
      console.log("🔓 Decoded token:", decoded);
      if (!decoded) {
        console.log("❌ Failed to decode token");
        throw new ErrorResponse({
          errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
        });
      }

      const { userId, jti } = decoded;
      if (!userId || !jti) {
        console.log("❌ Missing userId or jti in token", { userId, jti });
        throw new ErrorResponse({
          errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
        });
      }

      console.log("🔍 Looking for key token:", { userId, jti });
      const keyToken = await KeyTokenService.findKeyToken(userId, jti);
      if (!keyToken) {
        console.log("❌ Key token not found");
        throw new ErrorResponse({
          errorResponseItem: errorResponses.AUTH_KEY_TOKEN_NOT_FOUND,
        });
      }

      console.log("🔑 Key token found, verifying...");
      const verifySuccess = JwtService.verify(accessToken, keyToken.publicKey);
      if (!verifySuccess) {
        console.log("❌ Token verification failed");
        throw new ErrorResponse({
          errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
        });
      }

      console.log("✅ Token verified successfully");
      //   Add payload to request
      req.userId = userId;
      req.jti = jti;

      next();
    } catch (e: any) {
      console.log("💥 Auth middleware error:", e);
      if (e instanceof ErrorResponse) {
        throw e;
      }

      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
      });
    }
  }
);
