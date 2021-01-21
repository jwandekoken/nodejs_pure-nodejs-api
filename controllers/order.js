const _data = require("../lib/data");
const verifyAuth = require("../lib/verifyAuth");
const stripe = require("../lib/stripe");

const orderController = {};

orderController.create = (data, cb) => {
  // check required data
  const email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  const cartId =
    typeof data.payload.cartId == "string" &&
    data.payload.cartId.trim().length > 0
      ? data.payload.cartId.trim()
      : false;

  if (email && cartId) {
    // check auth
    verifyAuth(data, email)
      .then((isLogged) => {
        if (isLogged) {
          // fetch cart
          _data
            .read("carts", cartId)
            .then((cart) => {
              console.log("cart: ", cart);

              // create a customer on stripe
              stripe.createCustomer(email, (resData) => {
                cb(200, resData);

                // continue from here (create card, attach to customer, make purchase)
              });
            })
            .catch((err) => {
              console.log(err);
              cb(404, { Error: "Cart not found" });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        cb(403, { Error: err.message || "Access denied" });
      });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

module.exports = orderController;
