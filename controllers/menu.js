const verifyAuth = require("../lib/verifyAuth");

const menuController = {};

menuController.showMenu = (data, cb) => {
  // check required data
  const email =
    typeof data.queryStringObject.email == "string" &&
    data.queryStringObject.email.trim().length > 0
      ? data.queryStringObject.email.trim()
      : false;

  if (email) {
    verifyAuth(data, email)
      .then((isLogged) => {
        if (isLogged) {
          const menuItems = [
            {
              id: "01",
              name: "Pepperoni",
              value: "33.00",
            },
            {
              id: "02",
              name: "BBQ Chicken",
              value: "32.00",
            },
          ];

          cb(200, {
            menu: menuItems,
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
    cb(400, { Error: "Missing required field" });
  }

  verifyAuth(data);
};

module.exports = menuController;
