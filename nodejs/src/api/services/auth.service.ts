import bcrypt from "bcrypt";
import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import userModel from "@/models/user.model";
import { SALT_ROUNDS } from "@/config/security.config";
import type {
  LoginUserInput,
  RegisterUserInput,
} from "@/validator/zod/user.zod";
import RSAService from "./rsa.service";
import { JwtService } from "./jwt.service";
import KeyTokenService from "./keyToken.service";
import type { LoginResponse, RegisterResponse } from "@/types/response";

export default class AuthService {
  public static async register(
    payload: RegisterUserInput
  ): Promise<RegisterResponse> {
    // Check if user already exists
    const isUserExists = await userModel.exists({
      user_email: payload.user_email,
    });

    if (isUserExists)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_USER_EXISTS_ERROR,
      });

    // Hash user password
    const hashedPassword = await bcrypt.hash(
      payload.user_password,
      SALT_ROUNDS
    );

    // Create user in database
    const newUser = await userModel.create({
      ...payload,
      user_password: hashedPassword,
    });

    // Generate RSA key pair and JWT tokens
    const { publicKey, privateKey } = RSAService.generateKeyPair();
    const { accessToken, refreshToken, jti } = JwtService.generateTokenPair(
      {
        userId: newUser._id.toString(),
        email: payload.user_email,
      },
      privateKey
    );

    // Store key token with public key and jti
    await KeyTokenService.createKeyToken(
      newUser._id.toString(),
      publicKey,
      jti
    );

    return {
      user: newUser,
      tokens: { accessToken, refreshToken },
    };
  }

  public static async login(payload: LoginUserInput): Promise<LoginResponse> {
    // Find user by email
    const user = await userModel.findOne({ user_email: payload.user_email });
    if (!user)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_USER_NOT_FOUND,
      });

    // Compare passwords
    const isMatch = await bcrypt.compare(
      payload.user_password,
      user.user_password
    );

    if (!isMatch)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
      });

    // Generate RSA key pair and JWT tokens
    const { publicKey, privateKey } = RSAService.generateKeyPair();
    const { accessToken, refreshToken, jti } = JwtService.generateTokenPair(
      { userId: user._id.toString(), email: user.user_email },
      privateKey
    );

    // Store key token with public key and jti
    await KeyTokenService.createKeyToken(user._id.toString(), publicKey, jti);

    return { user, tokens: { accessToken, refreshToken } };
  }

  public static async refreshToken(
    oldRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Decode and validate payload
    const decoded = JwtService.decode(oldRefreshToken);
    if (!decoded || !decoded.userId || !decoded.jti)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
      });

    // Retrieve and verify key record
    const keyRecord = await KeyTokenService.findKeyToken(
      decoded.userId,
      decoded.jti
    );

    const valid = JwtService.verify(oldRefreshToken, keyRecord.publicKey);
    if (!valid)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_INVALID_CREDENTIALS,
      });

    // Generate new RSA key pair and JWT tokens
    const { publicKey, privateKey } = RSAService.generateKeyPair();
    const { accessToken, refreshToken, jti } = JwtService.generateTokenPair(
      { userId: decoded.userId, email: (valid as any).email },
      privateKey
    );

    // Update key token with new jti
    await KeyTokenService.createKeyToken(decoded.userId, publicKey, jti);

    return { accessToken, refreshToken };
  }
}
