import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
  err: Error | ErrorResponse,
  req,
  res,
  next
) => {
  console.log("Error in errorHandler middleware:", {
    errorType: typeof err,
    isError: err instanceof Error,
    isErrorResponse: err instanceof ErrorResponse,
    errorMessage: err instanceof Error ? err.message : "No message",
    errorStack: err instanceof Error ? err.stack : "No stack",
  });

  let errorResponse: ErrorResponse;

  try {
    if (err instanceof Error) {
      errorResponse = new ErrorResponse({
        errorResponseItem: errorResponses.INTERNAL_SERVER_ERROR,
        detail: err.message,
      });
    } else if (err instanceof ErrorResponse) {
      errorResponse = err;
    } else {
      errorResponse = new ErrorResponse({
        errorResponseItem: errorResponses.INTERNAL_SERVER_ERROR,
        detail: "Unknown error occurred",
      });
    }

    console.log("Final error object:", {
      errorMessage: errorResponse.errorMessage,
      httpCode: errorResponse.getErrorHttpCode(),
      error: errorResponse.getError(),
    });

    const httpCode = errorResponse.getErrorHttpCode();
    if (
      typeof httpCode !== "number" ||
      isNaN(httpCode) ||
      httpCode < 100 ||
      httpCode > 599
    ) {
      throw new Error(`Invalid HTTP code: ${httpCode}`);
    }

    res.status(httpCode).json(errorResponse.getError());
  } catch (handlerError) {
    console.error("Error in error handler:", handlerError);

    // Fallback response
    res.status(500).json({
      errorHttpCode: 500,
      errorName: "Internal Server Error",
      errorHttpReasonPhrase: "Something went wrong",
      errorDetail: "Error handler failed",
    });
  }
};

export default errorHandler;
