const express = require("express");
const router = express.Router();
const UserProgress = require("../models/userProgressModel");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`GET request received for userId: ${userId}`); // Add this log
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = await UserProgress.create({ userId, currentLevel: 1 });
    }
    res.status(200).json(progress);
  } catch (error) {
    console.error(`Error in GET /api/progress/${req.params.userId}:`, error);
    res.status(500).json({ message: "Server error while getting progress" });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newLevel } = req.body;
    console.log(
      `POST request received for userId: ${userId} with newLevel: ${newLevel}`
    ); // Add this log
    const progress = await UserProgress.findOneAndUpdate(
      { userId },
      { currentLevel: newLevel },
      { new: true, upsert: true }
    );
    res.status(200).json(progress);
  } catch (error) {
    console.error(`Error in POST /api/progress/${req.params.userId}:`, error);
    res.status(500).json({ message: "Server error while saving progress" });
  }
});

module.exports = router;
