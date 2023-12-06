const Expense = require("../Model/Expense");
const db = require('../Utils/Database');
const path = require('path');
const User = require('../Model/User');


exports.getHomePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "Frontend", "Expense-Details", "index.html"));
  };

exports.addExpense = (req,res,next)=>{
    const date = req.body.date;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
    console.log(amount);
    console.log(req.user.totalExpenses);

    User.update(
        {
            totalExpenses: req.user.totalExpenses + amount,
        },
        {where: { id: req.user.id}}
    );

    
    Expense.create({
        date: date,
        category: category,
        description: description,
        amount: amount,
        userId: req.user.id
    }).then((result)=>{
        res.status(200);
        res.redirect("/getHomePage");
    }).catch((err)=>{
        console.log(err);
    })
    
};


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
        console.log(expense.amount)
        User.update(
            {
                totalExpenses: req.user.totalExpenses - expense.amount,
            },
            { where: { id: req.user.id}}
        ).then()
    })
    Expense.destroy({ where: { id: id, userId: req.user.id } })
    .then((result) => {
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
    Expense.findByPk(id)
    .then((expense) => {
        User.update(
            {
                totalExpenses : req.user.totalExpenses - expense.amount + amount,
            },
            {where: { id: req.user.id}}
        )

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