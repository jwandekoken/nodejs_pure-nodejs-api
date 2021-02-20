// dependencies
const http = require("http");
const https = require("https");
const { StringDecoder } = require("string_decoder");
const fs = require("fs");
const path = require("path");
const util = require("util");
const debug = util.debuglog("server");

const config = require("./config");

// routes
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

    const chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : server.router.notFound;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: payload ? JSON.parse(payload) : {},
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      payload = typeof payload == "object" ? payload : {};
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader("Content-Type", "application/json");
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
  users: userRoutes,
  auth: authRoutes,
  menu: menuRoutes,
  cart: cartRoutes,
  order: orderRoutes,
  notFound: notFoundRoute,
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
