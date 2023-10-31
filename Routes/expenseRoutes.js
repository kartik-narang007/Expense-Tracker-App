const express = require('express');
const router = express.Router();
const expenseControllers = require("../Controllers/expenseControllers");

router.get("/getHomePage", expenseControllers.getHomePage);
router.post("/addExpense", expenseControllers.addExpense);
router.get("/getAllExpenses", expenseControllers.getAllExpenses);
router.get("/deleteExpense/:id", expenseControllers.deleteExpense);
router.post("/editExpense/:id", expenseControllers.editExpense);

module.exports = router;