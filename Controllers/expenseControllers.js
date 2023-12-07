const Expense = require("../Model/Expense");
const sequelize = require('../Utils/Database');
const path = require('path');
const User = require('../Model/User');


exports.getHomePage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "../", "Frontend", "Expense-Details", "index.html"));
    } catch (error) {
        console.log(error);
    }
};

exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const date = req.body.date;
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;
        console.log(amount);
        console.log(req.user.totalExpenses);

        await User.update(
            {
                totalExpenses: req.user.totalExpenses + amount,
            },
            { where: { id: req.user.id } },
            { transaction: t }
        );


        await Expense.create({
            date: date,
            category: category,
            description: description,
            amount: amount,
            userId: req.user.id,
        },
            { transaction: t }
        ).then((result) => {
            res.status(200);
            res.redirect("/getHomePage");
        }).catch((err) => {
            console.log(err);
        })
        await t.commit();
    } catch (err) {
        console.log(err);
    }
};


exports.getAllExpenses = async (req, res, next) => {
    const userId = req.user.id;
    console.log(userId);
    console.log("Entered in getAllExpenses Controller")
    try {
        const expenses = await Expense.findAll({ where: { userId: userId } });
        res.json(expenses)
    } catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const expense = await Expense.findByPk(id)
        console.log(expense.amount)
        await User.update(
            {
                totalExpenses: req.user.totalExpenses - expense.amount,
            },
            { where: { id: req.user.id } }
        )

        await Expense.destroy({ where: { id: id, userId: req.user.id } })
            .then((result) => {
                res.redirect("/getHomePage");
            })
            .catch((err) => {
                console.log(err);
            })
    } catch (err) {
        console.log(err);
    }
}


exports.editExpense = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body);
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;
        const expense = await Expense.findByPk(id);
        await User.update(
            {
                totalExpenses: req.user.totalExpenses - expense.amount + Number(amount),
            },
            { where: { id: req.user.id } }
        )
        await Expense.update(
            {
                category: category,
                description: description,
                amount: amount,
            },
            { where: {id: id, userId: req.user.id} }
        );
        res.redirect('/getHomePage');
    } catch (err) {
        console.log(err);
    }
};