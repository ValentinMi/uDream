const _ = require("lodash");
const { User, validate } = require("../models/user");
const admin = require("../middlewares/admin");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const moment = require("moment");

// GET ALL USERS
router.get("/", async (req, res) => {
  const users = await User.find().select("- password").sort("score");

  res.send(users);
});

// GET ONE USER
router.get("/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.param.id }).select(
    "-password, -lastname"
  );
  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

// POST (REGISTER) USER
router.post("/", async (req, res) => {
  try {
    // Validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Destructure
    const { username, firstname, lastname, email, password } = req.body;

    // Check if user already exist
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(409).send("User already registered");

    const salt = await bcrypt.genSalt(10);

    const newUser = new User({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: await bcrypt.hash(password, salt),
      registerDate: moment.now(),
      dreams: []
    });

    await newUser.save();

    // Create JWT
    const token = newUser.generateAuthToken();
    res
      .header("uDream-auth-token", token)
      .header("access-control-expose-headers", "uDream-auth-token")
      .send(
        _.pick(newUser, ["id", "firstname", "lastname", "email", "- password"])
      );
  } catch (error) {
    res.send(error.message);
  }

  res.send("Registered");
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: await bcrypt.hash(password, salt)
    },
    { new: true }
  );

  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

// DELETE USER
router.delete("/:id", [admin], async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });

  if (!user) return res.status(404).send("User not found");

  res.send(user);
});

module.exports = router;
