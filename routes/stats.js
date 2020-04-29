const { Dream } = require("../models/dream");
const { User } = require("../models/user");
// const { Keyword } = require("../models/keyword");
const auth = require("../middlewares/auth");
const router = require("express").Router();

// GET -- Get dreams stats
router.get("/dreams", [auth], async (req, res) => {
  try {
    const dreams = await Dream.find({ "author._id": req.user._id });
    if (!dreams || dreams.length === 0)
      return res.status(404).send("No dreams found");

    // Select usefull property to return
    let dreamStats = dreams.map(dream => {
      const { date, title, note } = dream;
      return {
        date,
        title,
        note
      };
    });

    // Sort dream by date
    dreamStats = dreamStats.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    // Calcul dream note average
    let noteAverage = 0;
    dreams.forEach(dream => (noteAverage += dream.note));
    noteAverage /= dreams.length;
    noteAverage = noteAverage.toFixed(2);

    res.send({
      noteAverage,
      dreamStats
    });
  } catch (error) {
    console.log(error.message);
  }
});

// GET -- Get keywords stats
router.get("/keywords", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    const userKeywordsSynthesis = user.keywords;
    if (!userKeywordsSynthesis || userKeywordsSynthesis.length === 0)
      return res.status(404).send("User's keywords not found");

    res.send(userKeywordsSynthesis);
  } catch (error) {
    console.log(error.message);
  }
});

// TODO Community routes

module.exports = router;
