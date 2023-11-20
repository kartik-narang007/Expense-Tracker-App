const express = require('express');
const router = express.Router();
const expenseControllers = require("../Controllers/expenseControllers");
const userAuthentication = require("../middleware/auth");

router.use(express.static("Frontend"));
router.get("/getHomePage", expenseControllers.getHomePage);

router.get("/", expenseControllers.getHomePage);
router.get(
  "/getAllExpenses",
  userAuthentication,
  expenseControllers.getAllExpenses
);
router.get(
  "/deleteExpense/:id",
  userAuthentication,
  expenseControllers.deleteExpense
);

router.post("/addExpense", userAuthentication, expenseControllers.addExpense);
router.post(
  "/editExpense/:id",
  userAuthentication,
  expenseControllers.editExpense
);
module.exports = router;