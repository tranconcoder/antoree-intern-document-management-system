export const JWT_CONFIG = {
  accessToken: {
    algorithm: "RS256" as const,
    expiresIn: "15m" as const,
  },
  refreshToken: {
    algorithm: "RS256" as const,
    expiresIn: "7d" as const,
  },
  verify: {
    algorithms: ["RS256" as const],
  },
};
