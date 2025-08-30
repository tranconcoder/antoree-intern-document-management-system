// Determine protocol based on environment and certificate availability
const getBaseURL = () => {
  const isDev = process.env.NODE_ENV !== "production";
  const useHTTPS = process.env.NEXT_PUBLIC_USE_HTTPS === "true" || false;

  if (useHTTPS) {
    return "https://localhost:4000/v1/api";
  }

  return "http://localhost:4000/v1/api";
};

export const AXIOS_URL = getBaseURL();
