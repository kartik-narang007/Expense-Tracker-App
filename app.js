const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./Routes/userRoutes');
const expenseRoutes = require('./Routes/expenseRoutes');

const sequelize = require('./Utils/Database');

const cors = require('cors');

const user = require('./Model/User');
const expenses = require('./Model/Expense');

const app = express();

app.use(express.static("Frontend"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use(userRoutes);
app.use(expenseRoutes);

user.hasMany(expenses);
expenses.belongsTo(user);

sequelize.sync().then(()=>{
    app.listen(3000, ()=>{
        console.log('server is running on localhost : 3000');
    })
}).catch((err)=>{
    console.log(err);
})







