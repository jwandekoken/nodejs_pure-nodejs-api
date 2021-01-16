// controller
const userController = require("../controllers/user");

const _routes = {};

const userRouter = (data, cb) => {
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

// route: PUT /users
// required data: email
// optional data: name, streetAddress, password (at least one must be provided)
// auth required: no (EDIT HERE)
// @TODO: only let logged users update their own data
_routes.put = userController.update;

// route: GET /users
// required data: email
// optional data: none
// auth required: no
_routes.get = userController.fetch;

// route: DELETE /users
// required data: email
// optional data: none
// auth required: no (EDIT HERE)
// @TODO: only let logged users delete their own data
_routes.delete = userController.delete;

module.exports = userRouter;
