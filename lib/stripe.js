/*
  Library for integrating with Stripe
*/
const queryString = require("querystring");
const https = require("https");
const config = require("./config");

const lib = {};

// create a customer
lib.createCustomer = (email, cb) => {
  const postData = queryString.stringify({
    email,
  });

  const reqOptions = {
    protocol: "https:",
    hostname: config.stripeApiUrl,
    path: "/v1/customers",
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };

  const req = https.request(reqOptions, (res) => {
    let resData = "";
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on("data", (chunk) => {
      console.log("chunk: ", chunk);
      resData += chunk;
    });

    res.on("end", () => {
      const parsedData = JSON.parse(resData);
      console.log("parsedData", parsedData);
      cb(parsedData);
    });
  });

  req.on("error", (e) => {
    console.log("bateu aqui", e);
  });

  req.write(postData);

  req.end();
};

module.exports = lib;
