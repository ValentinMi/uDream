const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true
  },
  frequency: {
    type: Number,
    min: 1
  }
});

const Keyword = mongoose.model("Keyword", keywordSchema);

// Validation

const validateKeyword = keyword => {
  const schema = Joi.string()
    .min(1)
    .max(50);

  return schema.validate(keyword);
};

exports.keywordSchema = keywordSchema;
exports.Keyword = Keyword;
exports.validateKeyword = validateKeyword;
