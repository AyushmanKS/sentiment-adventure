const mongoose = require('mongoose');

const userProgressSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  unlockedLevel: { type: Number, required: true, default: 1 },
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
module.exports = UserProgress;