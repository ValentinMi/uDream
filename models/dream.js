const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

// Create model
const Dream = mongoose.model(
  "Dream",
  new mongoose.Schema({
    creationDate: {
      type: Date,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    title: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true
    },
    note: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    description: {
      type: String,
      required: false,
      maxlength: 3000
    },
    author: {
      type: new mongoose.Schema({
        username: {
          type: String,
          minlength: 4,
          maxlength: 25,
          required: true
        }
      }),
      required: true
    },
    keywords: {
      type: Array,
      maxlength: 100
    }
  })
);

// Validation
const validateDream = dream => {
  const schema = Joi.object({
    date: Joi.date().required(),
    title: Joi.string()
      .min(2)
      .max(255)
      .required(),
    note: Joi.number()
      .min(0)
      .max(5)
      .required(),
    description: Joi.string()
      .max(3000)
      .required(),
    keywords: Joi.array().max(100)
  });

  return schema.validate(dream);
};

exports.Dream = Dream;
exports.validate = validateDream;
