import type { SuccessResponseItem, SuccessResponseConfig } from "@/types/error";
import type { Request, Response } from "express";

export default class SuccessResponse {
  private successResponseItem: SuccessResponseItem;
  private detail?: string;
  private metadata?: any;

  public constructor(config: SuccessResponseConfig) {
    this.successResponseItem = config.successResponseItem;
    this.detail = config.detail;
    this.metadata = config.metadata;
  }

  //   Get success message handler
  public get successMessage(): string {
    const now = new Date();

    return `[${now.toISOString()}] [${this.successResponseItem[0]}] ${
      this.successResponseItem[1]
    } - ${this.successResponseItem[2]}: ${this.detail || "..."}`;
  }

  public getSuccess() {
    return {
      successHttpCode: this.successResponseItem[0],
      successName: this.successResponseItem[1],
      successHttpReasonPhrase: this.successResponseItem[2],
      successDetail: this.detail || "...",
      metadata: this.metadata,
    };
  }

  public getSuccessHttpCode() {
    return this.successResponseItem[0];
  }

  public getMetadata() {
    return this.metadata;
  }

  public sendResponse(response: Response) {
    response.status(this.getSuccessHttpCode()).json(this.getSuccess());
  }
}
