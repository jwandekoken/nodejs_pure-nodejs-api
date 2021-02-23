const templ = require("../lib/templ");

const faviconController = {};

faviconController.serveFavicon = (data, cb) => {
  templ.getStaticAsset("favicon.ico", (err, data) => {
    if (!err && data) {
      cb(200, data, "favicon");
    } else {
      cb(500);
    }
  });
};

module.exports = faviconController;
