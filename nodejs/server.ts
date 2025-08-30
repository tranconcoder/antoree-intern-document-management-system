import { loadEnv } from "./src/api/utils/env.util";
import app from "./src/app";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { SERVER_PORT } from "./src/api/configs/server.config";

loadEnv();

// Check if SSL certificates exist
const sslKeyPath = path.join(__dirname, "../ssl/key.pem");
const sslCertPath = path.join(__dirname, "../ssl/cert.pem");

let server;

if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
  // HTTPS server with SSL certificates
  const options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };

  server = https.createServer(options, app).listen(SERVER_PORT, () => {
    console.log(`HTTPS Server is running on port ${SERVER_PORT}`);
    console.log(`Access at: https://localhost:${SERVER_PORT}`);
  });
} else {
  // Fallback to HTTP server
  console.log(" SSL certificates not found, falling back to HTTP");
  server = http.createServer(app).listen(SERVER_PORT, () => {
    console.log(`HTTP Server is running on port ${SERVER_PORT}`);
    console.log(`Access at: http://localhost:${SERVER_PORT}`);
  });
}

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
