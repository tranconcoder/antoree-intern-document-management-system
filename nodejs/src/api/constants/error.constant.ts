import type { ErrorResponseItem } from "@/types/error";
import HttpStatus from "http-status";

// [ErrorCode, Error Message, Error detail]
export const errorResponses: Record<string, ErrorResponseItem> = {
  // Internal error
  INTERNAL_SERVER_ERROR: [
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Internal Server Error",
    "Something went wrong",
  ],

  // Auth error
  AUTH_INTERNAL_ERROR: [
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Auth internal error",
    "Something went wrong on authentication",
  ],
};
