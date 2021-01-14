const _data = require("../lib/data");
const hashStr = require("../lib/hashStr");

const userController = {};

userController.createNew = (data, cb) => {
  console.log("data", data);

  // check required data
  const name =
    typeof data.payload.name == "string" && data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;

  const email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  const streetAddress =
    typeof data.payload.streetAddress == "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6
      ? data.payload.password.trim()
      : false;

  console.log({ name, email, streetAddress, password });

  if (name && email && streetAddress && password) {
    const hashedPwd = hashStr(password);

    if (hashedPwd) {
      const userObj = {
        name,
        email,
        streetAddress,
        password: hashedPwd,
      };

      _data
        .create("users", email, userObj)
        .then((user) => {
          cb(200, user);
        })
        .catch((err) => {
          console.log(err);
          cb(500, { Error: err.message });
        });
    } else {
      cb(500, { Error: "Could not hash users password" });
    }
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

module.exports = userController;
