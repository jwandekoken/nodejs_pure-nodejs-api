const _data = require("../lib/data");

// verify if a given token id is currently valid for a given user
verifyAuth = function (data, email) {
  return new Promise((resolve, reject) => {
    // get the token from the headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    if (!token) {
      reject(Error("Token não encontrado"));
    }

    // lookup the token
    _data
      .read("tokens", token)
      .then((tokenData) => {
        // check that the token is for the given user and has not expired
        if (tokenData.email == email && tokenData.expires > Date.now()) {
          resolve(true);
        } else {
          reject(Error("Token expirado"));
        }
      })
      .catch((err) => {
        console.log(err);
        reject(Error("Token invalido"));
      });
  });
};

module.exports = verifyAuth;
