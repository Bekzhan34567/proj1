const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Entry = sequelize.define("Entry", {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  isFavorite: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Entry;
