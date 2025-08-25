import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
  err: Error | ErrorResponse,
  req,
  res,
  next
) => {
  if (err instanceof Error) {
    err = new ErrorResponse({
      errorResponseItem: errorResponses.INTERNAL_SERVER_ERROR,
      detail: err.message,
    });
  } else if (!(err instanceof ErrorResponse)) {
    err = new ErrorResponse({
      errorResponseItem: errorResponses.INTERNAL_SERVER_ERROR,
    });
  }

  console.log(err.errorMessage);

  res.status(err.getErrorHttpCode()).json(err.getError());
};

export default errorHandler;
