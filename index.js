const server = require("./lib/server");

const app = {};

app.init = () => {
  // start the server
  server.init();
};

app.init();

//module.exports = app;
