parseJsonToObject = function (str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (error) {
    console.log(error);
    return {};
  }
};

module.exports = parseJsonToObject;
