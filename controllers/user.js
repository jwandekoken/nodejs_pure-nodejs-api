const userController = {};

userController.createNew = (data, cb) => {
  cb(200, { msg: "Iam alive!" });
};

module.exports = userController;
