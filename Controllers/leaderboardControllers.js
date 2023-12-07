const path = require("path");
const User = require("../Model/User");
const Expense = require("../Model/Expense");
const sequelize = require("../Utils/Database");

exports.getLeaderboardPage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "Frontend", "LeaderBoard", "leaderboard.html")
    );
  } catch (err) {
    console.log(err);
  }
};


// exports.getLeaderboard = (req, res, next) => {
//     Expense.findAll({
//       attributes: [
//         [sequelize.fn("sum", sequelize.col("amount")), "totalExpense"],
//         [sequelize.col("user.name"), "name"],
//       ],
//       group: ["userId"],
//       include: [
//         {
//           model: User,
//           attributes: [],
//         },
//       ],
//       order: [[sequelize.fn("sum", sequelize.col("amount")), "DESC"]],
//     })
//       .then((expenses) => {
//         const result = expenses.map((expense) => ({
//           name: expense.getDataValue("name"),
//           amount: expense.getDataValue("totalExpense"),
//         }));
//         res.send(JSON.stringify(result));
//       })
//       .catch((err) => console.log(err));
//   };
