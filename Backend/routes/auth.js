import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// / ✅ Register route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user with empty favorites array
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      favorites: [], // ✅ make sure this is initialized
    });

    await newUser.save();

    res.json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Error signing up", error: err.message });
  }
});


// ✅ Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});




// ❤️ Add to favorites
router.post("/favorites", authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Add Favorite Error:", err);
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// 🎬 Get all favorites
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (err) {
    console.error("Get Favorites Error:", err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

// for deleting a favorite
router.delete("/favorites/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.id;

  // remove from user's favorites
  await User.findByIdAndUpdate(userId, { $pull: { favorites: movieId } });
  res.json({ success: true });
});


export default router;
