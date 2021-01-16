const notFoundRouter = (data, cb) => {
  cb(404, { Error: "Requested route does not exist" });
};

module.exports = notFoundRouter;
