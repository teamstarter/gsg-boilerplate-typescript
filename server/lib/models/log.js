"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function User(sequelize) {
    var Log = sequelize.define('log', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tag: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "INFO",
            validate: {
                isIn: [["INFO", "WARNING", "ERROR"]]
            }
        }
    }, {
        freezeTableName: true,
        tableName: 'log',
        paranoid: true
    });
    return Log;
}
exports["default"] = User;
