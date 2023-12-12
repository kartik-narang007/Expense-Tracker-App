const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./Routes/userRoutes');
const expenseRoutes = require('./Routes/expenseRoutes');
const purchaseRoutes = require('./Routes/purchaseRoutes');
const leaderboardRoutes = require('./Routes/leaderboardRoutes');
const resetPasswordRoutes = require('./Routes/resetPasswordRoutes');
const sequelize = require('./Utils/Database');

const cors = require('cors');

const user = require('./Model/User');
const expenses = require('./Model/Expense');
const order = require('./Model/Orders');
const ResetPassword = require("./Model/resetPasswordModel");
const reportsRoutes = require('./Routes/reportsRoutes');
const app = express();

app.use(express.static("Frontend"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use(userRoutes);
app.use("/getHomePage", expenseRoutes);
app.use(expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', leaderboardRoutes);
app.use(resetPasswordRoutes);
app.use(reportsRoutes);
user.hasMany(expenses);
expenses.belongsTo(user);

user.hasMany(order);
order.belongsTo(user);

ResetPassword.belongsTo(user);
user.hasMany(ResetPassword);

sequelize.sync().then(()=>{
    app.listen(3000, ()=>{
        console.log('server is running on localhost : 3000');
    })
}).catch((err)=>{
    console.log(err);
})







