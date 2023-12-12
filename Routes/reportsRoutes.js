const express = require("express");
const router = express.Router();
const reportsControllers = require("../Controllers/reportsControllers");
router.get("/getReportsPage", reportsControllers.getReportsPage);
module.exports = router;