const Sequelize = require('sequelize');
const sequelize = require('../Utils/Database');

const ResetPassword = sequelize.define("ResetPassword",{
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    isActive: Sequelize.BOOLEAN,
});

module.exports = ResetPassword;