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

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );


const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-recommendations-steel.vercel.app",
  "https://movie-recommendations-git-main-zaid-s-projects-1fa67b07.vercel.app",
  "https://movie-recommendations-a16hsporc-zaid-s-projects-1fa67b07.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
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
