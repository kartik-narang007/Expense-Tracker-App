const express = require('express');
const router = express.Router();

const leaderboardControllers = require("../Controllers/leaderboardControllers");

router.get("/getLeaderboardPage", leaderboardControllers.getLeaderboardPage);

router.get("/getLeaderboard", leaderboardControllers.getLeaderboard);

module.exports = router;
