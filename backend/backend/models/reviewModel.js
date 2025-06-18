const { DataTypes } = require("sequelize");
const sequelize = require("../lib/sequelize");

// ✅ Define Review model
const Review = sequelize.define("Review", {
  reviewId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  movieId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

// ✅ Sync model with the database
async function initReviewModel() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL database");

    await sequelize.sync(); // Use { force: true } to reset the table if needed
    console.log("✅ Review table synced");
  } catch (error) {
    console.error("❌ Error syncing Review model:", error);
  }
}

initReviewModel();

module.exports = Review;
