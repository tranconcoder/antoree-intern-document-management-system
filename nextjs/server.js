const { createServer } = require("https");
const { createServer: createHTTPServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Check if SSL certificates exist
  const sslKeyPath = path.join(__dirname, "../ssl/key.pem");
  const sslCertPath = path.join(__dirname, "../ssl/cert.pem");

  if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    // HTTPS server with SSL certificates
    const httpsOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };

    createServer(httpsOptions, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(
          `🔒 Next.js HTTPS Server ready on https://${hostname}:${port}`
        );
      });
  } else {
    // Fallback to HTTP server
    console.log("⚠️  SSL certificates not found, falling back to HTTP");
    createHTTPServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(
          `🌐 Next.js HTTP Server ready on http://${hostname}:${port}`
        );
      });
  }
});
