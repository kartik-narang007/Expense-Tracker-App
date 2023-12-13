const express = require("express");
const router = express.Router();
const reportsControllers = require("../Controllers/reportsControllers");
const userAuthentication = require('../middleware/auth');
router.get("/getReportsPage", reportsControllers.getReportsPage);
router.post("/dailyReports", userAuthentication, reportsControllers.dailyReports);
router.post("/monthlyReports", userAuthentication, reportsControllers.monthlyReports);
module.exports = router;