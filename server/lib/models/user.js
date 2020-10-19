"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function User(sequelize) {
    var User = sequelize.define('user', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'user',
        paranoid: true
    });
    return User;
}
exports["default"] = User;
