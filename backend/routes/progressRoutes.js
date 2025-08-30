const express = require("express");
const router = express.Router();
const UserProgress = require("../models/userProgressModel");

router.get("/:userId", async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });
    if (!progress) {
      // --- FIX: Use 'unlockedLevel' when creating a new user ---
      progress = await UserProgress.create({
        userId: req.params.userId,
        unlockedLevel: 1,
      });
    }
    res.json(progress);
  } catch (error) {
    console.error("Error in GET /api/progress:", error);
    res.status(500).json({ message: "Server error while getting progress" });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    // --- FIX: Expect 'newUnlockedLevel' from the request body ---
    const { newUnlockedLevel } = req.body;
    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.params.userId },
      // --- FIX: Update the 'unlockedLevel' field in the database ---
      { unlockedLevel: newUnlockedLevel },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    console.error("Error in POST /api/progress:", error);
    res.status(500).json({ message: "Server error while saving progress" });
  }
});

module.exports = router;
