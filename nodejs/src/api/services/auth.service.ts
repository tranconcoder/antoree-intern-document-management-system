import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import userModel from "@/models/user.model";
import type { RegisterUserInput } from "@/validator/zod/user.zod";

export default class AuthService {
  public static async register(payload: RegisterUserInput) {
    // Check user is exist in database
    const isUserExists = await userModel.exists({
      user_email: payload.user_email,
    });

    if (isUserExists)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_USER_EXISTS_ERROR,
      });

    // Hash password
      const hashPassword = 

    // Store user to database
  }
}
