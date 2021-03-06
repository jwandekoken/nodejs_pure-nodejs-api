/*
    Library for storing and editing data
*/

// dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// write data to a file
lib.create = (dir, file, data) => {
  return new Promise((resolve, reject) => {
    // check if collection/dir exists, if doesn't, create it
    if (!fs.existsSync(lib.baseDir + dir)) {
      fs.mkdirSync(lib.baseDir + dir);
    }

    // open the file for writing
    // 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
    // 'wx': Like 'w' but fails if the path exists.
    fs.open(
      lib.baseDir + dir + "/" + file + ".json",
      "wx",
      (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
          // convert data to string
          const stringData = JSON.stringify(data);

          // write to file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close the file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  resolve(data);
                } else {
                  reject(Error("Error closing the new file"));
                }
              });
            } else {
              reject(Error("Error writing to new file"));
            }
          });
        } else {
          reject(Error("Could not create new file, it may already exists"));
        }
      }
    );
  });
};

// read data from a file
lib.read = function (dir, file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      lib.baseDir + dir + "/" + file + ".json",
      "utf8",
      function (err, data) {
        if (!err && data) {
          const parsedData = data ? JSON.parse(data) : {};
          resolve(parsedData);
        } else {
          reject(err);
        }
      }
    );
  });
};

// update data inside a file
lib.update = function (dir, file, data) {
  return new Promise((resolve, reject) => {
    // open the file for writing
    // 'r+': Open file for reading and writing. An exception occurs if the file does not exist.
    fs.open(
      lib.baseDir + dir + "/" + file + ".json",
      "r+",
      function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
          // convert data to string
          const stringData = JSON.stringify(data);

          // truncate the file
          // https://nodejs.org/api/fs.html#fs_fs_truncate_path_len_callback
          // Passing a file descriptor is deprecated and may result in an error being thrown in the future. -> This is why i am passing the path
          fs.truncate(lib.baseDir + dir + "/" + file + ".json", function (err) {
            if (!err) {
              // write to the file and close it
              fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                  fs.close(fileDescriptor, function (err) {
                    if (!err) {
                      resolve(data);
                    } else {
                      reject(Error("Error closing file"));
                    }
                  });
                } else {
                  reject(Error("Error writing to existing file"));
                }
              });
            } else {
              reject(Error("Error truncating file"));
            }
          });
        } else {
          reject(
            Error("Could not open the file for update, it may not exist yet")
          );
        }
      }
    );
  });
};

// delete a file
lib.delete = function (dir, file) {
  return new Promise((resolve, reject) => {
    // unlink the file
    fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
};

// refactor from here

/*
// list all the items in a directory
lib.list = function (dir, cb) {
  // https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
  fs.readdir(lib.baseDir + dir + "/", (err, data) => {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach((filename) => {
        trimmedFileNames.push(filename.replace(".json", ""));
      });

      cb(false, trimmedFileNames);
    } else {
      cb(err, data);
    }
  });
};
*/

module.exports = lib;
