const { DataTypes } = require("sequelize");
const sequelize = require("../lib/sequelize");// adjust path as needed

const Movie = sequelize.define("Movie", {
  movieId: {
    type: DataTypes.STRING,
    primaryKey: true,  // uses custom ID (UUID or string)
    allowNull: false,
  },
  movieName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  genres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.DATEONLY,  // stores ISO date formats
    allowNull: false,
  },
  runtime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  certification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  media: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shows: {
    type: DataTypes.JSON,  // store array of show IDs
    allowNull: true,
  },
}, {
  timestamps: false,  // disable createdAt/updatedAt if not needed
});

module.exports = Movie;
