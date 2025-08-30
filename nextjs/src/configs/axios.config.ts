// Determine protocol based on environment and certificate availability
const getBaseURL = () => {
  const isDev = process.env.NODE_ENV !== "production";
  const useHTTPS = process.env.NEXT_PUBLIC_USE_HTTPS === "true" || false;

  return "http://ec2-16-176-232-14.ap-southeast-2.compute.amazonaws.com:4000";
};

export const AXIOS_URL = getBaseURL();
