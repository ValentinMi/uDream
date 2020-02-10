const mongoose = require("mongoose");

module.exports = async function() {
  try {
    await mongoose.connect(`mongodb://localhost:27017/uDream`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.info("Connected to database...");
  } catch (error) {
    console.error(error.message);
  }
};
