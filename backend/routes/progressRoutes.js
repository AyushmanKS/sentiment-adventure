const express = require("express");
const router = express.Router();
const UserProgress = require("../models/userProgressModel");

// Get or create progress for a user
router.get("/:userId", async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });
    if (!progress) {
      progress = await UserProgress.create({
        userId: req.params.userId,
        unlockedLevel: 1,
      });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching progress." });
  }
});

// Update a user's progress
router.post("/:userId", async (req, res) => {
  try {
    const { newUnlockedLevel } = req.body;
    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.params.userId },
      { unlockedLevel: newUnlockedLevel },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error saving progress." });
  }
});

module.exports = router;
