const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

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
  dreams: Array,
  strikeScore: Number,
  lastConnection: Date,
  keywords: Array,
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      isAdmin: this.isAdmin
    },
    process.env.JWT_PRIVATE_KEY || config.get("jwtPrivateKey")
  );
  return token;
};

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
      .required()
  });

  return schema.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
