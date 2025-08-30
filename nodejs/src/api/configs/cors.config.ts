// Allow both HTTP and HTTPS origins for development
const getAllowedOrigins = () => {
  const baseOrigins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
  ];

  if (process.env.NODE_ENV === "development") {
    return baseOrigins;
  }

  // In production, you should specify exact origins
  return baseOrigins;
};

export const CORS_ORIGIN = getAllowedOrigins();

export const CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export const CORS_CREDENTIALS = true;

export const CORS_EXPOSED_HEADERS = ["Content-Disposition"];

export const CORS_OPTIONS = {
  origin: CORS_ORIGIN,
  methods: CORS_METHODS,
  credentials: CORS_CREDENTIALS,
  exposedHeaders: CORS_EXPOSED_HEADERS,
  // Additional options for HTTPS
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

export default CORS_OPTIONS;
