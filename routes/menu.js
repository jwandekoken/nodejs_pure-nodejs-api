// controller
const menuController = require("../controllers/menu");

const _routes = {};

const menuRouter = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405);
  }
};

// route: GET /auth
// required data: none
// optional data: none
// auth required: yes
_routes.get = menuController.showMenu;

module.exports = menuRouter;
