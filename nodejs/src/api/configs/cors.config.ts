export const CORS_ORIGIN = "*";

export const CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export const CORS_CREDENTIALS = true;

export const CORS_EXPOSED_HEADERS = ["Content-Disposition"];

export const CORS_OPTIONS = {
  origin: CORS_ORIGIN,
  methods: CORS_METHODS,
  credentials: CORS_CREDENTIALS,
  exposedHeaders: CORS_EXPOSED_HEADERS,
};

export default CORS_OPTIONS;
