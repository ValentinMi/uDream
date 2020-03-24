const { Dream, validate } = require("../models/dream");
const { Tag, validateTag } = require("../models/tag");
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

// POST -- Post new dream
router.post("/", [auth], async (req, res) => {
  try {
    // Validate req.body
    const { error } = validate(req.body);
    if (error) return res.status(400).send("Bad request");

    const { note, description, tags } = req.body;

    // Validate tags & save or update it
    tags.forEach(async tag => {
      try {
        const { error } = validateTag(tag);
        if (error) return res.status(400).send("Bad request");

        // If tag exists => increment frequency
        const existingTag = await Tag.findOneAndUpdate(
          { name: tag },
          {
            $inc: {
              frequency: 1
            }
          },
          { new: true }
        );

        // If it's a new tag => save
        if (!existingTag) {
          const newTag = new Tag({
            name: tag,
            frequency: 1
          });
          await newTag.save();
        }
      } catch (error) {
        console.log(error.message);
      }
    });

    // Create new dream
    const newDream = new Dream({
      creationDate: moment.now(),
      note,
      description,
      author: req.user._id,
      tags
    });

    await newDream.save();

    const user = await User.findById(req.user._id);

    // Add new dream to user dreams list
    await user.updateOne({ dreams: [...user.dreams, newDream._id] });

    // Add new tags to user's tags or increment existing tags
    const userTags = user.tags;
    let newUserTags = [...userTags];

    tags.forEach(tag => {
      if (userTags.find(t => t.name === tag)) {
        const toIncrement = newUserTags.find(t => t.name === tag);
        // Increment
        newUserTags[newUserTags.indexOf(toIncrement)].frequency++;
        // Or push in if new
      } else newUserTags.push({ name: tag, frequency: 1 });
    });

    // Save user's tags changes
    await user.updateOne({ tags: newUserTags });

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
