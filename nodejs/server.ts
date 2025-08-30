import { loadEnv } from "./src/api/utils/env.util";
import app from "./src/app";
import http from "http";
import { SERVER_PORT } from "./src/api/configs/server.config";

loadEnv();

const server = http.createServer(app).listen(SERVER_PORT, () => {
  console.log(`HTTP Server is running on port ${SERVER_PORT}`);
  console.log(`Access at: http://localhost:${SERVER_PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
