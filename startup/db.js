const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
  try {
    const db = config.get("db");
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.info("Connected to database...");
  } catch (error) {
    console.error(error.message);
  }
};
