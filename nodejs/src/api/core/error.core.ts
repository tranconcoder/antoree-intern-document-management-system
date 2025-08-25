import type { ErrorResponseItem, ErrorResponseConfig } from "@/types/error";

export default class ErrorResponse {
  private errorResponseItem: ErrorResponseItem;
  private detail?: string;

  public constructor(config: ErrorResponseConfig) {
    this.errorResponseItem = config.errorResponseItem;
    this.detail = config.detail;
  }

  //   Get error message handler
  public get errorMessage(): string {
    const now = new Date();

    return `[${now.toISOString()}] [${this.errorResponseItem[0]}] ${
      this.errorResponseItem[1]
    } - ${this.errorResponseItem[2]}: ${this.detail || "..."}`;
  }

  public getError() {
    return {
      errorHttpCode: this.errorResponseItem[0],
      errorName: this.errorResponseItem[1],
      errorHttpReasonPhrase: this.errorResponseItem[2],
      errorDetail: this.detail || "...",
    };
  }

  public getErrorHttpCode() {
    return this.errorResponseItem[0];
  }
}
