const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

// Create model

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  firstname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  registerDate: {
    type: Date,
    minlength: 8,
    maxlength: 255
  },
  strikeScore: Number,
  dreamPosts: Array
});

const User = mongoose.model("User", userSchema);

// Validation

const validateUser = user => {
  const schema = Joi.object({
    username: Joi.string()
      .min(4)
      .max(255)
      .required(),
    firstname: Joi.string()
      .min(2)
      .max(255)
      .required(),
    lastname: Joi.string()
      .min(2)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .min(4)
      .max(255)
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required(),
    registerDate: Joi.date()
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
