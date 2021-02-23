// controller
const homeController = require("../controllers/home");

const _routes = {};

const homeRoutes = (data, cb) => {
  const acceptableMethods = ["get"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405, undefined, "html");
  }
};

// route: GET /
// required data: none
// optional data: none
// auth required: no
_routes.get = homeController.index;

module.exports = homeRoutes;
