const Sequelize = require('sequelize')
const sequelize = require('../Utils/Database');

const Expenses = sequelize.define('expenses', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Expenses;