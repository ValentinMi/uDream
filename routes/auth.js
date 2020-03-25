const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { User } = require("../models/user");
const router = require("express").Router();

// AUTH POST
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!user || !validPassword)
      return res.status(400).send("Invalid email or password");

    // Update last connection date
    await user.updateOne({ lastConnection: moment.now() });

    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    console.log(error.message);
  }
});

function validate(body) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  });
  return schema.validate(body);
}

module.exports = router;
