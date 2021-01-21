// controller
const cartController = require("../controllers/cart");

const _routes = {};

const cartRouter = (data, cb) => {
  const acceptableMethods = ["post", "get", "put", "delete"];
  // check if the request method exists within the acceptableMethods arr
  if (acceptableMethods.indexOf(data.method) > -1) {
    _routes[data.method](data, cb);
  } else {
    cb(405);
  }
};

// route: POST /menu
// required data: email, itemsObj
// optional data: none
// auth required: yes

/*
  itemsArr format:
  [
    {
      id: "01",
      name: "Pepperoni",
      value: 33.0,
      amount: 1
    },
    {
      id: "02",
      name: "BBQ Chicken",
      value: 32.0,
      amount: 1
    },
  ]
*/
_routes.post = cartController.createCart;

module.exports = cartRouter;
