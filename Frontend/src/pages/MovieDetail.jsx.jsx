import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/api/movies/${id}`);
        setMovie(data);

        const { data: sim } = await API.get(`/api/movies/${id}/similar`);
        setSimilar(sim.results || sim);
      } catch (err) {
        console.error("🔥 Error fetching movie or similar:", err);
      }
    };
    fetchData();
  }, [id]);

  const fetchTrailer = async (movieId) => {
    const TMDB_KEY = "f91aa496d9470e9d690de49a13933feb";
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_KEY}`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.site === "YouTube" && vid.type === "Trailer"
      );
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        setShowTrailer(true);
      } else {
        alert("🎞 No trailer available for this movie.");
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
      alert("⚠️ Could not load trailer");
    }
  };

  if (!movie)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-gray-300 text-xl animate-pulse">
        🎬 Loading movie details...
      </div>
    );

  return (
    <div
      className="min-h-screen relative text-white px-6 py-12"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        
        {/* Poster */}
        <div className="relative group flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
        </div>

        {/* Movie Info */}
        <div className="flex flex-col justify-center space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-300 drop-shadow-lg">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-gray-300 italic text-lg">"{movie.tagline}"</p>
          )}
          <p className="text-gray-200 leading-relaxed tracking-wide">{movie.overview}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-sm">
            <span className="bg-yellow-500/20 border border-yellow-400/50 px-3 py-1 rounded-full">
              ⭐ {movie.vote_average.toFixed(1)} / 10
            </span>
            <span className="bg-green-500/20 border border-green-400/50 px-3 py-1 rounded-full">
              📅 {movie.release_date}
            </span>
            {movie.runtime && (
              <span className="bg-purple-500/20 border border-purple-400/50 px-3 py-1 rounded-full">
                ⏱️ {movie.runtime} min
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 px-3 py-1 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:scale-105 transition-all duration-300"
              >
                🎞️ {g.name}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={() => navigate("/subscription")}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-105 transition-all duration-300"
            >
              🎬 Watch Now
            </button>
            <button
              onClick={() => fetchTrailer(movie.id)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300"
            >
              🎥 Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div className="mt-16 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">
          Similar Movies
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {similar && similar.length > 0 ? (
            similar.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/movie/${m.id}`)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-3">
                  <p className="text-sm md:text-base text-center text-gray-100 font-semibold tracking-wide">
                    {m.title}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">
              No similar movies found 🎞️
            </p>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="relative w-[90%] md:w-[70%] lg:w-[60%] aspect-video bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-700">
            <iframe
              src={trailerUrl}
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-all"
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
