// controller
const orderController = require("../controllers/order");

const _routes = {};

const orderRoutes = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405);
  }
};

// route: POST /menu
// required data: email, cartId, cardNumber, cardExpMonth, cardExpYear, cardCvc
// optional data: none
// auth required: yes
_routes.post = orderController.create;

module.exports = orderRoutes;
