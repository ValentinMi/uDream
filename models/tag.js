const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
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

const Tag = mongoose.model("Tag", tagSchema);

// Validation

const validateTag = tag => {
  const schema = Joi.string()
    .min(1)
    .max(50);

  return schema.validate(tag);
};

exports.tagSchema = tagSchema;
exports.Tag = Tag;
exports.validateTag = validateTag;
