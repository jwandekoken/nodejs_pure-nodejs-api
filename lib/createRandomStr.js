// create a string of random alphanumeric characters, of a given length
createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;

  if (strLength) {
    // define all the possible characters that could go into a string
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // start the final string
    let str = "";

    for (i = 1; i <= strLength; i++) {
      // get a random character from the possibleCharacters string
      // Math.random(): returns a floating-point, pseudo-random number in the range 0 to less than 1 (inclusive of 0, but not 1)
      // multiplying by the possibleCharacters.length we will get random numbers from 0 to the max length of the possibleCharacters string
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      // append this character to the final string
      str += randomCharacter;
    }

    // return the final string
    return str;
  } else {
    return false;
  }
};

module.exports = createRandomString;
