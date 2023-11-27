const Expense = require("../Model/Expense");
const db = require('../Utils/Database');
const path = require('path');


exports.getHomePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "Frontend", "Expense-Details", "index.html"));
  };

exports.addExpense = async (req,res,next)=>{
    const date = req.body.date;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
    try{
    await Expense.create({
        date: date,
        category: category,
        description: description,
        amount: amount,
        userId: req.user.id
    })
    res.status(200);
    res.redirect("/getHomePage");
    }catch(err){
        console.log(err);
    }
}

exports.getAllExpenses = async (req, res, next) => {
    const userId = req.user.id;
    console.log(userId);
    console.log("Entered in getAllExpenses Controller")
    try{
        const expenses = await Expense.findAll({where:{userId: userId}});
        res.json(expenses)
    }catch(err){
        console.log(err);
    }
}

exports.deleteExpense = (req,res)=>{
    const id = req.params.id;
    console.log(id);
    Expense.findByPk(id)
    .then((expense)=>{
        return expense.destroy();
    }).then((result)=>{
        res.redirect("/getHomePage");
    })
    .catch((err)=>{
        console.log(err);
    })
}


exports.editExpense = (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
    console.log(
      "controller main enter kar gya or yeh rhii values : ",
      id,
      category,
      description,
      amount
    );
    Expense.findByPk(id)
      .then((expense) => {
        expense.category = category;
        expense.description = description;
        expense.amount = amount;
        return expense.save();
      })
      .then((result) => {
        res.redirect("/getHomePage");
      })
      .catch((err) => console.log(err));
  };