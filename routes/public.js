// controller
const publicController = require("../controllers/public");

const _routes = {};

const publicRoutes = (data, cb) => {
  const acceptableMethods = ["get"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405, undefined, "html");
  }
};

// route: GET /public
// required data: none
// optional data: none
// auth required: no
_routes.get = publicController.serveStaticAsset;

module.exports = publicRoutes;
