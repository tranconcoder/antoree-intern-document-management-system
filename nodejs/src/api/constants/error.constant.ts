import type { ErrorResponseItem } from "@/types/error";
import HttpStatus from "http-status";

// [ErrorCode, Error Message, Error detail]
export const errorResponses = {
  //
  //   Internal error
  //
  INTERNAL_SERVER_ERROR: [
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Internal Server Error",
    "Something went wrong",
  ] as ErrorResponseItem,

  VALIDATE_PAYLOAD_ERROR: [
    HttpStatus.BAD_REQUEST,
    "Validate payload error",
    "Payload validation failed",
  ] as ErrorResponseItem,

  //
  //   Auth error
  //
  AUTH_INTERNAL_ERROR: [
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Auth internal error",
    "Something went wrong on authentication",
  ] as ErrorResponseItem,

  AUTH_USER_EXISTS_ERROR: [
    HttpStatus.CONFLICT,
    "User already exists",
    "User with this email already exists",
  ] as ErrorResponseItem,

  AUTH_KEY_TOKEN_NOT_FOUND: [
    HttpStatus.NOT_FOUND,
    "Key token not found",
    "Key token not found or expired",
  ] as ErrorResponseItem,

  AUTH_USER_NOT_FOUND: [
    HttpStatus.NOT_FOUND,
    "User not found",
    "User with this email does not exist",
  ] as ErrorResponseItem,

  AUTH_INVALID_CREDENTIALS: [
    HttpStatus.UNAUTHORIZED,
    "Invalid credentials",
    "Email or password is incorrect",
  ] as ErrorResponseItem,

  AUTH_TOKEN_NOT_FOUND: [
    HttpStatus.NOT_FOUND,
    "Token not found",
    "Authorization token not found",
  ] as ErrorResponseItem,
};
