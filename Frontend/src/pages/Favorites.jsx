import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get("/auth/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const TMDB = "f91aa496d9470e9d690de49a13933feb";

        const details = await Promise.all(
          data.map((id) =>
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB}`)
              .then((res) => res.json())
          )
        );

        setFavorites(details);
      } catch (err) {
        alert("Could not load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await API.delete(`/auth/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">

      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Your Favorites</h1>

        <button
          onClick={() => navigate("/home")}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
      </div>

      {/* Movies Grid */}
      {favorites.length > 0 ? (
        <div className="grid gap-8 max-w-7xl mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-xl bg-gray-900 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              {/* Poster */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                className="w-full h-[260px] object-cover cursor-pointer group-hover:opacity-90 transition"
                alt={movie.title}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />

              {/* Info */}
              <div className="p-4">
                <h2 className="text-md font-semibold truncate">
                  {movie.title}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </p>

                <button
                  onClick={() => handleDelete(movie.id)}
                  className="text-red-400 hover:text-red-300 text-sm mt-3"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg mb-4">No favorites yet.</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg"
          >
            Browse Movies
          </button>
        </div>
      )}
    </div>
  );
}
