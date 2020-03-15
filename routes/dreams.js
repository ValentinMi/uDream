const { Dream, validate } = require("../models/dream");
const router = require("express").Router();
const moment = require("moment");

// GET -- Get one dream
router.get("/:id", async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) return res.status(404).send("Dream not found");

    res.send(dream);
  } catch (error) {
    console.log(error.message);
  }
});

// GET -- Get all dreams
router.get("/", async (req, res) => {
  try {
    const dreams = await Dream.find().sort("creationDate");
    if (!dreams) return res.status(404).send("Dreams not found");

    res.send(dreams);
  } catch (error) {
    console.log(error.message);
  }
});

// POST -- Post new dream
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send("Bad request");

    const { note, comment, author } = req.body;

    // Create new dream
    const newDream = new Dream({
      creationDate: moment.now(),
      note,
      comment,
      author
    });

    await newDream.save();
    res.send(newDream);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
