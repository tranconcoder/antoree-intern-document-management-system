import type { SuccessResponseItem } from "@/types/error";
import HttpStatus from "http-status";

// [SuccessCode, Success Message, Success detail]
export const successResponses = {
  // General success
  OK: [
    HttpStatus.OK,
    "Success",
    "Operation completed successfully",
  ] as SuccessResponseItem,

  CREATED: [
    HttpStatus.CREATED,
    "Created",
    "Resource created successfully",
  ] as SuccessResponseItem,

  // Auth success
  AUTH_SUCCESS: [
    HttpStatus.OK,
    "Authentication Success",
    "User authenticated successfully",
  ] as SuccessResponseItem,

  LOGIN_SUCCESS: [
    HttpStatus.OK,
    "Login Success",
    "User logged in successfully",
  ] as SuccessResponseItem,

  LOGOUT_SUCCESS: [
    HttpStatus.OK,
    "Logout Success",
    "User logged out successfully",
  ] as SuccessResponseItem,

  REGISTER_SUCCESS: [
    HttpStatus.CREATED,
    "Registration Success",
    "User registered successfully",
  ] as SuccessResponseItem,
};
