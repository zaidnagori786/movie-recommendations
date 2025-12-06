import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading || isAdded) return; // prevent double click
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please login first!");
      navigate("/login");
      setIsLoading(false);
      return;
    }

    try {
      const res = await API.post(
        "/auth/favorites",
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Add favorite success:", res.data);
      setIsAdded(true);
      alert("✅ Added to favorites!");
    } catch (err) {
      console.error("Add to favorites failed:", err);
      if (err.response) {
        alert(
          `❌ ${
            err.response.data?.msg ||
            err.response.data?.message ||
            "Server error"
          }`
        );
      } else if (err.request) {
        alert("❌ No response from server. Check backend & CORS.");
      } else {
        alert(`❌ Request error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
    >
      {/* 🎬 Movie Poster */}
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        className="w-full h-80 object-cover"
      />

      {/* ⭐ Rating Badge */}
      <div className="absolute top-3 right-3 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-400/40 shadow-md">
        ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
      </div>

      {/* 🎞️ Movie Info */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold">{movie.title}</h3>

        {/* ❤️ Add Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isLoading || isAdded}
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isAdded
              ? "bg-green-600 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
          }`}
        >
          {isAdded ? "✅ Added" : isLoading ? "⏳ Adding..." : "❤️ Add to Favorites"}
        </button>
      </div>
    </Link>
  );
}
