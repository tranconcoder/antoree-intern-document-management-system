export type ErrorResponseItem = [number, string, string];
export type SuccessResponseItem = [number, string, string];

export interface ErrorResponseConfig {
  errorResponseItem: ErrorResponseItem;
  detail?: string;
}

export interface SuccessResponseConfig {
  successResponseItem: SuccessResponseItem;
  detail?: string;
  metadata?: any;
}
