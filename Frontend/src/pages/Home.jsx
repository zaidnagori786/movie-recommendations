
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import MovieCard from "../components/MovieCard";
import { motion } from "framer-motion";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const TMDB_KEY = "f91aa496d9470e9d690de49a13933feb";

  const GENRES = [
    { id: "All", name: "All" },
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 16, name: "Animation" },
  ];

  const faqs = [
    { question: "How do I add movies to favorites?", answer: "Open any movie and click 'Add to Favorites'." },
    { question: "Where does MovieHub get data?", answer: "We use TMDB API for up-to-date movie info." },
    { question: "Is MovieHub free?", answer: "Yes, browsing and favorites are free." },
    { question: "Do I need an account?", answer: "Login unlocks favorites and watchlist." },
  ];

  const toggleFAQ = (index) =>
    setOpenIndex(openIndex === index ? null : index);

  // Fetch Trending
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await API.get("/api/movies/trending");
        setTrending(data.slice(0, 10));
      } catch (error) {
        console.error("Trending Movies Error:", error.response?.data || error.message);
      }
    };

    fetchTrending();
  }, []);

  // Fetch Movies by Genre
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        setLoading(true);

        const responses = await Promise.all(
          GENRES.filter((g) => g.id !== "All").map((genre) =>
            fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genre.id}&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=100`
            ).then((res) => {
              if (!res.ok) throw new Error("Genre request failed");
              return res.json();
            })
          )
        );

        const genreMovies = {};

        GENRES.filter((g) => g.id !== "All").forEach((g, i) => {
          genreMovies[g.id] = responses[i].results || [];
        });

        setCategorizedMovies(genreMovies);
      } catch (error) {
        console.error("Genre Movies Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, []);

  // Search Suggestions
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(search)}`
        );

        const json = await res.json();
        setSuggestions(json.results?.slice(0, 6) || []);
      } catch (error) {
        console.error("Search Error:", error);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  const moviesToShow =
    selectedGenre === "All"
      ? Object.values(categorizedMovies).flat()
      : categorizedMovies[selectedGenre] || [];

  const MovieBox = ({ children }) => (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="flex-shrink-0 w-40 sm:w-48 md:w-52 rounded-2xl overflow-hidden shadow-neon cursor-pointer bg-black/50 border border-purple-500/30"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 w-full h-full -z-20 bg-gradient-to-br from-indigo-900 via-black to-purple-900 animate-pulse-slow" />

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_#8e2de2_0%,_transparent_40%),radial-gradient(circle_at_bottom_right,_#4a00e0_0%,_transparent_50%)] mix-blend-overlay" />

      <div className="flex flex-col md:flex-row min-h-screen">

        {/* Genre Sidebar */}
        <aside className="w-full md:w-60 md:min-w-60 bg-black/60 backdrop-blur-lg p-4 md:p-6 flex flex-col gap-3 md:gap-6 md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-purple-500/30">

          <h2 className="text-xl md:text-2xl font-bold text-neon-purple">
            🎬 Genres
          </h2>

          <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`flex-shrink-0 text-sm md:text-left px-4 py-2 rounded-full md:rounded-2xl font-medium transition-all duration-300 ${
                  selectedGenre === g.id
                    ? "bg-purple-700/60 text-white shadow-neon"
                    : "bg-white/5 hover:bg-purple-900/40"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-6 space-y-10 md:space-y-12">

          {/* Search */}
          <div className="relative w-full max-w-xl mx-auto">
            <input
              className="w-full px-5 py-3 rounded-full bg-black/60 border border-purple-500/40 placeholder-gray-400 focus:bg-black/80 focus:border-purple-400 outline-none shadow-neon text-white text-sm sm:text-base"
              placeholder="🔍 Search for movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-black/95 border border-purple-500/30 rounded-xl mt-2 shadow-neon overflow-hidden z-50 max-h-80 overflow-y-auto">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center p-3 gap-3 hover:bg-purple-800/40 cursor-pointer transition"
                  >
                    <img
                      src={
                        s.poster_path
                          ? `https://image.tmdb.org/t/p/w92${s.poster_path}`
                          : "https://placehold.co/92x138?text=No+Poster"
                      }
                      alt={s.title}
                      className="w-12 h-16 rounded-md object-cover border border-purple-500"
                    />

                    <div className="min-w-0">
                      <div className="font-semibold truncate">{s.title}</div>
                      <div className="text-sm text-gray-400">
                        {s.release_date?.slice(0, 4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Movies */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-neon-purple">
              🔥 Trending Now
            </h2>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-500">
              {trending.map((m) => (
                <MovieBox key={m.id}>
                  <div className="w-full h-56 sm:h-64 overflow-hidden rounded-2xl">
                    <img
                      src={
                        m.poster_path
                          ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                          : "https://placehold.co/300x450?text=No+Poster"
                      }
                      className="w-full h-full object-cover"
                      alt={m.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="p-3 text-center text-sm font-semibold text-purple-300 truncate">
                    {m.title}
                  </div>
                </MovieBox>
              ))}
            </div>
          </section>

          {/* Genre Movies */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-neon-purple">
              🎞️ {selectedGenre} Movies
            </h2>

            {loading ? (
              <p className="text-gray-400">Loading movies...</p>
            ) : (
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-500">
                {moviesToShow.slice(0, 20).map((movie) => (
                  <MovieBox key={movie.id}>
                    <MovieCard movie={movie} />
                  </MovieBox>
                ))}
              </div>
            )}
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-neon-purple">
              ❓ Frequently Asked Questions
            </h2>

            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => toggleFAQ(i)}
                className="bg-black/50 p-4 rounded-2xl cursor-pointer hover:bg-purple-900/30 transition shadow-neon border border-purple-500/20"
              >
                <div className="flex justify-between items-center gap-3">
                  <h3 className="font-semibold text-purple-300 text-sm sm:text-base">
                    {faq.question}
                  </h3>

                  <span className="text-purple-500 text-xl">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </div>

                {openIndex === i && (
                  <p className="mt-3 text-gray-300 text-sm sm:text-base">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Footer */}
          <footer className="text-center py-6 text-gray-400 text-xs sm:text-sm border-t border-purple-500/20">
            © {new Date().getFullYear()} MovieHub — Neon Futuristic Edition
          </footer>

        </main>
      </div>

      <style>{`
        .text-neon-purple {
          color: #bb00ff;
          text-shadow: 0 0 8px #bb00ff, 0 0 16px #aa00ff;
        }

        .shadow-neon {
          box-shadow: 0 0 12px #bb00ff33, 0 0 25px #aa00ff22;
        }

        .shadow-neon:hover {
          box-shadow: 0 0 25px #ff00ff66, 0 0 40px #aa00ff55;
        }

        .animate-pulse-slow {
          animation: pulse 8s infinite alternate;
        }

        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
