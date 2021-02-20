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

  const cardNumber =
    typeof data.payload.cardNumber == "number" && data.payload.cardNumber > 0
      ? data.payload.cardNumber
      : false;

  const cardExpMonth =
    typeof data.payload.cardExpMonth == "number" &&
    data.payload.cardExpMonth > 0
      ? data.payload.cardExpMonth
      : false;

  const cardExpYear =
    typeof data.payload.cardExpYear == "number" && data.payload.cardExpYear > 0
      ? data.payload.cardExpYear
      : false;

  const cardCvc =
    typeof data.payload.cardCvc == "number" && data.payload.cardCvc > 0
      ? data.payload.cardCvc
      : false;

  if (email && cartId && cardNumber && cardExpMonth && cardExpYear && cardCvc) {
    // check auth
    verifyAuth(data, email)
      .then((isLogged) => {
        if (isLogged) {
          // fetch cart
          _data
            .read("carts", cartId)
            .then((cart) => {
              // create a customer on stripe
              stripe.createCustomer(email, (customerResData) => {
                const customerId = customerResData.id;

                const cardDataObj = {
                  number: cardNumber,
                  exp_month: cardExpMonth,
                  exp_year: cardExpYear,
                  cvc: cardCvc,
                };

                // create card
                stripe.createdPaymentMethod(
                  cardDataObj,
                  (paymentMethodResData) => {
                    cb(200, paymentMethodResData);
                  }
                );
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
