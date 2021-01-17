// controller
const authController = require("../controllers/auth");

const _routes = {};

const authRouter = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405);
  }
};

// route: POST /auth
// required data: email, password
// optional data: none
// auth required: no
_routes.post = authController.login;

// route: DELETE /auth
// required data: id
// optional data: none
// auth required: no
_routes.delete = authController.delete;

module.exports = authRouter;
