// controller
const faviconController = require("../controllers/favicon");

const _routes = {};

const faviconRoutes = (data, cb) => {
  const acceptableMethods = ["get"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405, undefined, "html");
  }
};

// route: GET /favicon.ico
// required data: none
// optional data: none
// auth required: no
_routes.get = faviconController.serveFavicon;

module.exports = faviconRoutes;
