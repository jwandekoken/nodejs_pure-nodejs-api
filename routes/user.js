// controller
const userController = require("../controllers/user");

const _routes = {};

const userRoutes = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405);
  }
};

// route: POST /users
// required data: name, email, streetAddress, password
// optional data: none
// auth required: no
_routes.post = userController.createNew;

module.exports = userRoutes;
