const path = require("path");
const fs = require("fs");

const config = require("./config");

const templ = {};

// get the string content of a template
templ.getTemplate = function (templateName, data, cb) {
  templateName =
    typeof templateName == "string" && templateName.length > 0
      ? templateName
      : false;

  data = typeof data == "object" && data !== null ? data : {};

  if (templateName) {
    const templatesDir = path.join(__dirname, "/../templates/");
    fs.readFile(templatesDir + templateName + ".html", "utf8", (err, str) => {
      if (!err && str && str.length > 0) {
        // do interpolation on the string
        const finalString = templ.interpolate(str, data);
        cb(false, finalString);
      } else {
        cb("No template could be found");
      }
    });
  } else {
    cb("A valid template name was not specified");
  }
};

// add the universal header and footer to a string, and pass provided data object to the header and footer for interpolation
templ.addUniversalTemplates = function (str, data, cb) {
  str = typeof str == "string" && str.length > 0 ? str : "";
  data = typeof data == "object" && data !== null ? data : {};

  // get the header
  templ.getTemplate("_header", data, (err, headerString) => {
    if (!err && headerString) {
      // get the footer
      templ.getTemplate("_footer", data, (err, footerString) => {
        if (!err && footerString) {
          // add them all together
          const fullString = headerString + str + footerString;
          cb(false, fullString);
        } else {
          cb("Could not find the footer template");
        }
      });
    } else {
      cb("Could not find the header template");
    }
  });
};

// take a given string and a data object and find/replace all the keys within in it
templ.interpolate = (str, data) => {
  str = typeof str == "string" && str.length > 0 ? str : "";
  data = typeof data == "object" && data !== null ? data : {};

  // add the templateGlobals to the data object, prepending their key name with "global"
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data["global." + keyName] = config.templateGlobals[keyName];
    }
  }

  // for each key in the data object, insert its value into the string at the corresponding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] == "string") {
      var replace = data[key];
      var find = "{" + key + "}";
      str = str.replace(find, replace);
    }
  }
  return str;
};

// get the contents of a static (public) asset
templ.getStaticAsset = function (fileName, cb) {
  fileName =
    typeof fileName == "string" && fileName.length > 0 ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, "/../public/");
    fs.readFile(publicDir + fileName, (err, data) => {
      if (!err && data) {
        cb(false, data);
      } else {
        cb("No file could be found");
      }
    });
  } else {
    cb("A valid file name was not specified");
  }
};

// export the module
module.exports = templ;
