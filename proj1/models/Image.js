const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Entry = require("./Entry");

const Image = sequelize.define("Image", {
  path: { type: DataTypes.STRING, allowNull: false },
});

Image.belongsTo(Entry, { foreignKey: "entryId", onDelete: "CASCADE" });

Entry.hasMany(Image, { foreignKey: "entryId", onDelete: "CASCADE" });

module.exports = Image;
