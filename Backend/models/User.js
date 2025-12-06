import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  favorites: { type: [String], default: [] },
});

export default mongoose.model("User", userSchema);
