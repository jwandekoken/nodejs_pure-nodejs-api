const templ = require("../lib/templ");

const publicController = {};

publicController.serveStaticAsset = (data, cb) => {
  // get the filename being requested
  const trimmedAssetName = data.trimmedPath.replace("public/", "").trim();

  if (trimmedAssetName.length > 0) {
    // read in the asset's data
    templ.getStaticAsset(trimmedAssetName, (err, data) => {
      if (!err && data) {
        // determine the content type (default to plain text)
        let contentType = "plain";
        if (trimmedAssetName.indexOf(".css") > -1) {
          contentType = "css";
        }

        if (trimmedAssetName.indexOf(".png") > -1) {
          contentType = "png";
        }

        if (trimmedAssetName.indexOf(".jpg") > -1) {
          contentType = "jpg";
        }

        if (trimmedAssetName.indexOf(".ico") > -1) {
          contentType = "favicon";
        }

        // cb the data
        cb(200, data, contentType);
      } else {
        cb(404);
      }
    });
  } else {
    cb(404);
  }
};

module.exports = publicController;
