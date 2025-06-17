const { DataTypes } = require("sequelize");
const sequelize = require("../lib/sequelize");
// ✅ Define User model
const User = sequelize.define("User", {
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

// ✅ Sync the model with the database
async function initUserModel() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL database");
    await sequelize.sync(); // use { force: true } to recreate the table
    console.log("✅ User table synced");
  } catch (error) {
    console.error("❌ Error syncing User model:", error);
  }
}

initUserModel();

module.exports = User;
