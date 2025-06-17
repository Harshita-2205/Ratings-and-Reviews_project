const { DataTypes } = require("sequelize");
const sequelize = require("../lib/sequelize"); // adjust path if needed

const Admin = sequelize.define("Admin", {
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20],
    },
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [1, 50],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8],
    },
  },
});

module.exports = Admin;
