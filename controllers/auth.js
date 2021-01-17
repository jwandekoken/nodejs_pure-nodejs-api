const _data = require("../lib/data");
const hashStr = require("../lib/hashStr");
const createRandomString = require("../lib/createRandomStr");

const authController = {};

authController.login = (data, cb) => {
  console.log("data", data);

  // check required data
  const email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length >= 6
      ? data.payload.password.trim()
      : false;

  if (email && password) {
    _data
      .read("users", email)
      .then((userData) => {
        if (!userData) {
          return cb(403, { Error: "Invalid credentials" });
        }

        const hashedPwd = hashStr(password);
        if (hashedPwd === userData.password) {
          const tokenId = createRandomString(25);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObj = {
            email,
            id: tokenId,
            expires,
          };

          _data
            .create("tokens", tokenId, tokenObj)
            .then((createdToken) => {
              cb(200, createdToken);
            })
            .catch((err) => {
              console.log(err);
              cb(500, err.message);
            });
        } else {
          cb(403, {
            Error: "Invalid credentials",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        cb(403, { Error: "Invalid credentials" });
      });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

authController.delete = (data, cb) => {
  // check that the id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 25
      ? data.queryStringObject.id.trim()
      : false;

  if (id) {
    _data
      .read("tokens", id)
      .then((tokenData) => {
        if (!tokenData) {
          return cb(403, { Error: "Could not find the specified token" });
        }

        _data
          .delete("tokens", id)
          .then(() => {
            cb(200, { deletedToken: tokenData });
          })
          .catch((err) => {
            console.log(err);
            cb(500, { Error: "Could not delete the specified token" });
          });
      })
      .catch((err) => {
        console.log(err);
        cb(400, { Error: "Could not find the specified token" });
      });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

module.exports = authController;
