const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./lib/sequelize"); // Sequelize DB instance

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Update with frontend URL if different
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/review", reviewRoutes);

// Sync Sequelize and Start server
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }) // Use { force: true } only during development
  .then(() => {
    console.log("✅ MySQL connection successful and models synced.");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MySQL:", err.message);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", status: false });
});
