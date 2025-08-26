import type { SuccessResponseItem } from "@/types/error";
import HttpStatus from "http-status";

// [SuccessCode, Success Message, Success detail]
export const successResponses = {
  // Auth success
  AUTH_SUCCESS: [
    HttpStatus.OK,
    "Authentication Success",
    "User authenticated successfully",
  ] as SuccessResponseItem,

  AUTH_LOGIN_SUCCESS: [
    HttpStatus.OK,
    "Login Success",
    "User logged in successfully",
  ] as SuccessResponseItem,

  AUTH_LOGOUT_SUCCESS: [
    HttpStatus.OK,
    "Logout Success",
    "User logged out successfully",
  ] as SuccessResponseItem,

  AUTH_REGISTER_SUCCESS: [
    HttpStatus.CREATED,
    "Registration Success",
    "User registered successfully",
  ] as SuccessResponseItem,

  // Document success
  DOCUMENT_UPLOAD_SUCCESS: [
    HttpStatus.CREATED,
    "Document Upload Success",
    "Document uploaded successfully",
  ] as SuccessResponseItem,

  DOCUMENT_FETCH_SUCCESS: [
    HttpStatus.OK,
    "Document Fetch Success",
    "Documents fetched successfully",
  ] as SuccessResponseItem,

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
};
