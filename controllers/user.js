const _data = require("../lib/data");
const hashStr = require("../lib/hashStr");
const verifyAuth = require("../lib/verifyAuth");

const userController = {};

userController.createNew = (data, cb) => {
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

userController.update = (data, cb) => {
  // check required data
  const email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  // check optional data
  const name =
    typeof data.payload.name == "string" && data.payload.name.trim().length > 0
      ? data.payload.name.trim()
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

  if (!email) {
    cb(400, { Error: "Missing required fields" });
  } else if (!name && !streetAddress && !password) {
    cb(400, { Error: "Missing fields to update" });
  } else {
    // check auth
    verifyAuth(data, email)
      .then((isLogged) => {
        if (isLogged) {
          // fetch user
          _data
            .read("users", email)
            .then((user) => {
              if (name) user.name = name;
              if (streetAddress) user.streetAddress = streetAddress;
              if (password) {
                const hashedPwd = hashStr(password);
                user.password = hashedPwd;
              }

              // update on storage
              _data
                .update("users", email, user)
                .then((updatedUser) => {
                  cb(200, updatedUser);
                })
                .catch((err) => {
                  console.log(err);
                  cb(500, { Error: err.message });
                });
            })
            .catch((err) => {
              console.log(err);
              cb(500, { Error: err.message });
            });
        } else {
          cb(403, { Error: "Access denied" });
        }
      })
      .catch((err) => {
        console.log(err);
        cb(403, { Error: err.message });
      });
  }
};

userController.fetch = (data, cb) => {
  // check required data
  const email =
    typeof data.queryStringObject.email == "string" &&
    data.queryStringObject.email.trim().length > 0
      ? data.queryStringObject.email.trim()
      : false;

  _data
    .read("users", email)
    .then((user) => {
      cb(200, user);
    })
    .catch((err) => {
      console.log(err);
      cb(404, { Error: "User not found" });
    });
};

userController.delete = (data, cb) => {
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
          _data
            .delete("users", email)
            .then(() => {
              cb(200, { Msg: "User deleted" });
            })
            .catch((err) => {
              console.log(err);
              cb(500, { Error: err.message });
            });
        }
      })
      .catch((err) => {
        cb(403, { Error: err.message });
      });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

module.exports = userController;
