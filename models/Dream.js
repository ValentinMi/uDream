const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { userSchema } = require("./User");

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
    author: new userSchema()
  })
);

// Validation
const validateDream = dream => {
  const schema = Joi.object({
    creationDate: Joi.date().required(),
    note: Joi.number().required(),
    comment: Joi.string().maxlength(1025)
  });

  return schema.validate(dream);
};

exports.Dream = Dream;
exports.validate = validateDream;
