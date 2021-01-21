const _data = require("../lib/data");
const createRandomString = require("../lib/createRandomStr");

const cartController = {};

cartController.createCart = (data, cb) => {
  // check required data
  const email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  const itemsArr =
    typeof data.payload.itemsArr == "object" &&
    data.payload.itemsArr instanceof Array &&
    data.payload.itemsArr.length > 0
      ? data.payload.itemsArr
      : false;

  if (email && itemsArr) {
    // validate itemsArr
    let itemsArrIsValid;
    itemsArr.forEach((item) => {
      if (
        typeof item.id == "string" &&
        typeof item.name == "string" &&
        typeof item.value == "number"
      ) {
        itemsArrIsValid = true;
      } else {
        itemsArrIsValid = false;
      }
    });

    if (itemsArrIsValid) {
      // check auth
      verifyAuth(data, email)
        .then((isLogged) => {
          if (isLogged) {
            let totalValue = 0;
            itemsArr.forEach((item) => {
              totalValue += item.value * item.amount;
            });

            const cartId = Date.now();

            // create cart obj
            const cartObj = {
              id: cartId,
              userEmail: email,
              items: itemsArr,
              cartTotalValue: totalValue,
            };
            _data
              .create("carts", cartId, cartObj)
              .then((createdCart) => {
                cb(200, createdCart);
              })
              .catch((err) => {
                console.log(err);
                cb(500, { Error: err.message });
              });
          } else {
            cb(403, { Error: "Acess denied" });
          }
        })
        .catch((err) => {
          console.log(err);
          cb(403, { Error: err.message });
        });
    } else {
      cb(422, { Error: "Invalid items data" });
    }
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

module.exports = cartController;
