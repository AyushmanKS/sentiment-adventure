const express = require('express');
const router = express.Router();

router.get('/hero', (req, res) => {
  const heroContent = {
    title: "Gloomy the Robot!",
    description: "This content is loaded directly from the backend server.",
    robotType: 'intro'
  };
  res.json(heroContent);
});

module.exports = router;