// Determine protocol based on environment and certificate availability
const getBaseURL = () => {
  const isDev = process.env.NODE_ENV !== "production";
  const useHTTPS = process.env.NEXT_PUBLIC_USE_HTTPS === "true" || false;

  return "https://localhost:4000/v1/api";
};

export const AXIOS_URL = getBaseURL();
