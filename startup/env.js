const config = require("config");

module.exports = function() {
  if (process.env.JWT_PRIVATE_KEY === undefined) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined in env");
  }
};
