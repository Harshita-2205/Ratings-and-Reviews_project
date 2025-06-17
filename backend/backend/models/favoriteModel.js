const { DataTypes } = require("sequelize");
const sequelize = require("../lib/sequelize"); // adjust path as needed

const Favorite = sequelize.define("Favorite", {
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  movieId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, // disable createdAt/updatedAt if not needed
});

module.exports = Favorite;
