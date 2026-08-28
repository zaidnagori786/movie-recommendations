import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";

dotenv.config();

const app = express();

// ================================
// Middleware
// ================================

app.use(
  cors({
    origin: "https://movie-recommendation-nine-khaki.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// ================================
// Routes
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// ================================
// Test Route
// ================================

app.get("/", (req, res) => {
  res.json({
    message: "Movie Recommendation API is running 🚀",
  });
});

// ================================
// MongoDB Connection
// ================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });