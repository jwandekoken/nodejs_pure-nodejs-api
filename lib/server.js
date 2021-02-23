// native
const http = require("http");
const https = require("https");
const { StringDecoder } = require("string_decoder");
const fs = require("fs");
const path = require("path");
const util = require("util");
const debug = util.debuglog("server");
// config
const config = require("./config");
// helpers
const parseJsonToObject = require("./parseJsonToObject");
// gui routes
const publicRoutes = require("../routes/public");
const faviconRoute = require("../routes/favicon");
const homeRoute = require("../routes/home");
// api routes
const userRoutes = require("../routes/user");
const notFoundRoute = require("../routes/notFound");
const authRoutes = require("../routes/auth");
const menuRoutes = require("../routes/menu");
const cartRoutes = require("../routes/cart");
const orderRoutes = require("../routes/order");

const server = {};

// http server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// https server
server.httpsServerOpts = {
  key: fs.readFileSync(path.join(__dirname, "../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../https/cert.pem")),
};
server.httpsServer = https.createServer(server.httpsServerOpts, (req, res) => {
  server.unifiedServer(req, res, true);
});

// http and https server logic
server.unifiedServer = (req, res, https = false) => {
  // build domain
  const protocol = !https ? "http" : "https";
  const port = !https ? config.httpPort : config.httpsPort;
  const domain = `${protocol}://${config.domainWithoutPort}:${port}`;

  // get request metadata
  const parsedUrl = new URL(req.url, domain);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = Object.fromEntries(parsedUrl.searchParams);
  const method = req.method.toLowerCase();
  const headers = req.headers;

  // get payload, if any
  const decoder = new StringDecoder("utf8");
  let payload = "";
  req.on("data", (chunk) => {
    payload += decoder.write(chunk);
  });
  req.on("end", () => {
    payload += decoder.end();

    let chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : server.router.notFound;

    // if the request is within the public directory, use the public handler instead
    chosenHandler =
      trimmedPath.indexOf("public/") > -1
        ? server.router["public"]
        : chosenHandler;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: payload.length > 0 ? parseJsonToObject(payload) : payload,
    };

    chosenHandler(data, (statusCode, payload, contentType) => {
      // determine the type of response (fallback to JSON)
      contentType = typeof contentType == "string" ? contentType : "json";

      // use the status code called back by the handler, or defaul to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // return the response parts that are content-specific
      let payloadString = "";
      if (contentType == "json") {
        res.setHeader("Content-Type", "application/json");
        payload = typeof payload == "object" ? payload : {};
        payloadString = JSON.stringify(payload);
      }

      if (contentType == "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload == "string" ? payload : "";
      }

      if (contentType == "favicon") {
        res.setHeader("Content-Type", "image/x-icon");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "css") {
        res.setHeader("Content-Type", "text/css");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "png") {
        res.setHeader("Content-Type", "image/png");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "jpg") {
        res.setHeader("Content-Type", "image/jpeg");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "plain") {
        res.setHeader("Content-Type", "text/plain");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      // return the response-parts that are common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);

      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      }
    });
  });
};

// server router
server.router = {
  // gui routes
  "": homeRoute,
  public: publicRoutes,
  "favicon.ico": faviconRoute,
  // api routes
  "api/users": userRoutes,
  "api/auth": authRoutes,
  "api/menu": menuRoutes,
  "api/cart": cartRoutes,
  "api/order": orderRoutes,
  "api/notFound": notFoundRoute,
};

// init server
server.init = () => {
  // start the http server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `Server listening on port ${config.httpPort}`
    );
  });

  // start the https server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[35m%s\x1b[0m",
      `Server listening on port ${config.httpsPort}`
    );
  });
};

module.exports = server;
