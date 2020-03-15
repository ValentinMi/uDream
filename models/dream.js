const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { userSchema } = require("./user");

// Create model
const Dream = mongoose.model(
  "Dream",
  new mongoose.Schema({
    creationDate: {
      type: Date,
      required: true
    },
    note: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: {
      type: String,
      required: false,
      maxlength: 1025
    },
    author: {
      type: String,
      required: true
    }
  })
);

// Validation
const validateDream = dream => {
  const schema = Joi.object({
    note: Joi.number().required(),
    comment: Joi.string().max(1025),
    author: Joi.string().min(2)
  });

  return schema.validate(dream);
};

exports.Dream = Dream;
exports.validate = validateDream;
