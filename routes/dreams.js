const { Dream, validate } = require("../models/dream");
const { Keyword, validateKeyword } = require("../models/keyword");
const { User } = require("../models/user");
const auth = require("../middlewares/auth");
const router = require("express").Router();
const moment = require("moment");

// GET -- Get one dream
router.get("/:id", [auth], async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) return res.status(404).send("Dream not found");

    res.send(dream);
  } catch (error) {
    console.log(error.message);
  }
});

// GET -- Get all dreams
router.get("/", [auth], async (req, res) => {
  try {
    const dreams = await Dream.find().sort("creationDate");
    if (!dreams) return res.status(404).send("Dreams not found");

    res.send(dreams);
  } catch (error) {
    console.log(error.message);
  }
});

// GET -- Get user's dreams
router.get("/userDreams/:userId", [auth], async (req, res) => {
  try {
    const userDreams = await Dream.find({ "author._id": req.params.userId });
    if (!userDreams) return res.status(404).send("Dreams not found");

    res.send(userDreams);
  } catch (error) {
    console.log(error);
  }
});

// POST -- Post new dream
router.post("/", [auth], async (req, res) => {
  try {
    // Validate req.body
    const { error } = validate(req.body);
    if (error) return res.status(400).send("Bad request");

    const { note, description, keywords, title } = req.body;

    // Validate keywords & save or update it
    keywords.forEach(async keyword => {
      try {
        const { error } = validateKeyword(keyword);
        if (error) return res.status(400).send("Bad request");

        // If keyword exists => increment frequency
        const existingKeyword = await Keyword.findOneAndUpdate(
          { name: keyword },
          {
            $inc: {
              frequency: 1
            }
          },
          { new: true }
        );

        // If it's a new keyword => save
        if (!existingKeyword) {
          const newKeyword = new Keyword({
            name: keyword,
            frequency: 1
          });
          await newKeyword.save();
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    // Create new dream
    const newDream = new Dream({
      creationDate: moment.now(),
      title,
      note,
      description,
      author: {
        _id: req.user._id,
        username: req.user.username
      },
      keywords
    });

    await newDream.save();

    // Find current user
    const user = await User.findById(req.user._id);

    // Add new dream to user dreams list
    await user.updateOne({ dreams: [...user.dreams, newDream._id] });

    // Add new keywords to user's keywords or increment existing keywords
    const userKeywords = user.keywords;
    let newUserKeywords = [...userKeywords];

    keywords.forEach(keyword => {
      if (userKeywords.find(t => t.name == keyword)) {
        const toIncrement = newUserKeywords.find(t => t.name == keyword);
        // Increment
        newUserKeywords[newUserKeywords.indexOf(toIncrement)].frequency++;
        // Or push in if new
      } else newUserKeywords.push({ name: keyword, frequency: 1 });
    });

    // Save user's keywords changes
    await user.updateOne({ keywords: newUserKeywords });

    res.send(newDream);
  } catch (error) {
    console.log(error.message);
  }
});

// DELETE -- Delete a dream
router.delete("/:id", [auth], async (req, res) => {
  try {
    const dream = await Dream.findByIdAndDelete(req.params.id);
    if (!dream) return res.status(404).send("Dream not found");

    res.send(dream);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
