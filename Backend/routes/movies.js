import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Trending movies
router.get("/trending", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data.results);
  } catch (err) {
    console.error("TMDB API Error:", err.response?.data || err.message);
    res.status(500).send("Server error");
  }
});

// Movie search (optional, uncomment if needed)
// router.get("/search", async (req, res) => {
//   const { query } = req.query;
//   try {
//     const response = await axios.get(
//       `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
//     );
//     res.json(response.data.results);
//   } catch (err) {
//     console.error("TMDB API Error:", err.response?.data || err.message);
//     res.status(500).send("Server error");
//   }
// });

// Movie details
router.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,similar`
    );
    res.json(response.data);
  } catch (err) {
    console.error("TMDB API Error:", err.response?.data || err.message);
    res.status(500).send("Server error");
  }
});

// Similar movies
router.get("/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data.results);
  } catch (err) {
    console.error("Error fetching similar movies:", err.message);
    res.status(500).json({ error: "Failed to fetch similar movies" });
  }
});

// Add to favorites (example)
// router.post("/favorites", authMiddleware, async (req, res) => {
//   const { movieId } = req.body;
//   // your favorite logic here
// });

export default router;
