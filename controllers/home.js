const templ = require("../lib/templ");

const homeController = {};

homeController.index = (data, cb) => {
  const templateData = {
    "head.title": "Pizza Gate - Order your pizza",
    "head.description": "Order your pizza now",
  };

  // read in the index template as a string
  templ.getTemplate("index", templateData, (err, str) => {
    if (!err && str) {
      // add the universal header and footer
      templ.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          cb(200, str, "html");
        } else {
          cb(500, undefined, "html");
        }
      });
    } else {
      cb(500, undefined, "html");
    }
  });
};

module.exports = homeController;
