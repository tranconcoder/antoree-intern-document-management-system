export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/antoree";

export const MONGODB_MIN_POOLSIZE = 5;
export const MONGODB_MAX_POOLSIZE = 10;
export const MONGODB_CONNECT_TIMEOUT_MS = 10_000;
