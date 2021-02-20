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

  console.log("postData", postData);

  const reqOptions = {
    protocol: "https:",
    hostname: config.stripeApiUrl,
    path: "/v1/customers",
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(reqOptions, (res) => {
    let resData = "";
    res.on("data", (chunk) => {
      resData += chunk;
    });

    res.on("end", () => {
      const parsedData = JSON.parse(resData);
      cb(parsedData);
    });
  });

  req.on("error", (e) => {
    console.log(e);
  });

  req.write(postData);

  req.end();
};

lib.createdPaymentMethod = (cardDataObj, cb) => {
  const postData = {
    type: "card",
    "card[number]": cardDataObj.number,
    "card[exp_month]": cardDataObj.exp_month,
    "card[exp_year]": cardDataObj.exp_year,
    "card[cvc]": cardDataObj.cvc,
  };
  console.log("postData", postData);

  const stringifiedPostData = queryString.stringify(postData);

  console.log("stringifiedPostData", stringifiedPostData);

  const reqOptions = {
    protocol: "https:",
    hostname: config.stripeApiUrl,
    path: `v1/payment_methods`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(stringifiedPostData),
    },
  };

  const req = https.request(reqOptions, (res) => {
    let resData = "";
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on("data", (chunk) => {
      resData += chunk;
    });

    res.on("end", () => {
      console.log("resData: ", resData);
      const parsedData = JSON.parse(resData);
      console.log("parsedData", parsedData);
      cb(parsedData);
    });
  });

  req.on("error", (e) => {
    console.log(e);
  });

  req.write(stringifiedPostData);

  req.end();
};

module.exports = lib;
