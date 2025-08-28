import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import type { RequestHandler } from "express";
import type { ZodSchema } from "zod/v3";
import { RequestSource } from "@/enums/requestSource.enum";
import type { ZodType } from "zod";
import { catchAsyncExpress } from "./async.middleware.";

export default function validateZodPayload(
  source: RequestSource,
  zodSchema: ZodType
): RequestHandler {
  return catchAsyncExpress((req, res, next) => {
    const payload = req[source];
    const result = zodSchema.safeParse(payload);

    if (!result.success) {
      throw new ErrorResponse({
        errorResponseItem: errorResponses.VALIDATE_PAYLOAD_ERROR,
        detail: result.error.issues.map((e) => e.message).join(", "),
      });
    }

    if (source !== RequestSource.Query) {
      req[source] = result.data;
    }
    next();
  });
}
