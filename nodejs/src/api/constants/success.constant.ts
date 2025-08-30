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

  DOCUMENT_DELETE_SUCCESS: [
    HttpStatus.OK,
    "Document Delete Success",
    "Document deleted successfully",
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

  // Lead success
  LEAD_CREATE_SUCCESS: [
    HttpStatus.CREATED,
    "Lead Created",
    "Lead created successfully",
  ] as SuccessResponseItem,

  LEAD_GET_SUCCESS: [
    HttpStatus.OK,
    "Lead Retrieved",
    "Lead retrieved successfully",
  ] as SuccessResponseItem,

  LEAD_UPDATE_SUCCESS: [
    HttpStatus.OK,
    "Lead Updated",
    "Lead updated successfully",
  ] as SuccessResponseItem,

  LEAD_DELETE_SUCCESS: [
    HttpStatus.OK,
    "Lead Deleted",
    "Lead deleted successfully",
  ] as SuccessResponseItem,

  LEAD_STATS_SUCCESS: [
    HttpStatus.OK,
    "Lead Stats Retrieved",
    "Lead statistics retrieved successfully",
  ] as SuccessResponseItem,
};
