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

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  // Fetch Trending
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/movies/trending");
        setTrending(data.slice(0, 10));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Fetch Movies by Genre
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all(
          GENRES.filter(g => g.id !== "All").map(genre =>
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genre.id}&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=100`).then(res => res.json())
          )
        );
        const genreMovies = {};
        GENRES.filter(g => g.id !== "All").forEach((g, i) => {
          genreMovies[g.id] = responses[i].results || [];
        });
        setCategorizedMovies(genreMovies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoviesByGenre();
  }, []);

  // Search Suggestions
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!search.trim()) return setSuggestions([]);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(search)}`);
        const json = await res.json();
        setSuggestions(json.results?.slice(0, 6) || []);
      } catch (e) { console.error(e); }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const moviesToShow =
    selectedGenre === "All"
      ? Object.values(categorizedMovies).flat()
      : categorizedMovies[selectedGenre] || [];

  // Common movie box style
  const MovieBox = ({ children }) => (
    <motion.div
      whileHover={{ scale: 1.15, rotateZ: [-2, 2, 0] }}
      className="flex-shrink-0 w-52 rounded-3xl overflow-hidden shadow-neon cursor-pointer bg-black/50 border border-purple-500/30"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">

      {/* Futuristic Background */}
      <div className="absolute inset-0 w-full h-full z-[-2] bg-gradient-to-br from-indigo-900 via-black to-purple-900 animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#8e2de2_0%,_transparent_40%),radial-gradient(circle_at_bottom_right,_#4a00e0_0%,_transparent_50%)] mix-blend-overlay z-[-1]" />

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-60 bg-black/40 backdrop-blur-lg p-6 flex flex-col gap-6 shadow-neon sticky top-0 h-screen border-l border-r border-purple-500/20 rounded-r-3xl">
          <h2 className="text-2xl font-bold text-neon-purple">Genres</h2>
          {GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`text-left px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                selectedGenre === g.id ? "bg-neon-purple/40 text-white shadow-neon" : "hover:bg-neon-purple/20"
              }`}
            >
              {g.name}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-6 space-y-12 overflow-y-auto">

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <input
              className="w-full px-5 py-3 rounded-full bg-black/50 placeholder-gray-400 focus:bg-black/70 outline-none shadow-neon text-white"
              placeholder="Search for movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-black/80 rounded-xl mt-2 shadow-neon overflow-hidden z-50">
                {suggestions.map(s => (
                  <div key={s.id} className="flex items-center p-3 hover:bg-purple-800/40 cursor-pointer transition">
                    <img src={`https://image.tmdb.org/t/p/w92${s.poster_path}`} className="w-12 h-16 rounded-md mr-3 object-cover border border-purple-500" />
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-sm text-gray-400">{s.release_date?.slice(0, 4)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Carousel */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-neon-purple">Trending Now</h2>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-500">
              {trending.map((m) => (
                <MovieBox key={m.id}>
                  <div className="w-full h-64 overflow-hidden border-2 border-purple-500/40 rounded-3xl">
                    <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} className="w-full h-full object-cover" alt={m.title} />
                  </div>
                  <div className="mt-2 text-center text-sm font-semibold text-purple-300">{m.title}</div>
                </MovieBox>
              ))}
            </div>
          </section>

          {/* Movies by Genre */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-neon-purple">{selectedGenre} Movies</h2>
            {loading ? (
              <p className="text-gray-400">Loading movies...</p>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-500">
                {moviesToShow.slice(0, 20).map(movie => (
                  <MovieBox key={movie.id}>
                    <MovieCard movie={movie} />
                  </MovieBox>
                ))}
              </div>
            )}
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold mb-4 text-neon-purple">FAQ</h2>
            {faqs.map((faq, i) => (
              <div key={i} onClick={() => toggleFAQ(i)} className="bg-black/50 p-4 rounded-2xl cursor-pointer hover:bg-purple-900/30 transition shadow-neon">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-purple-300">{faq.question}</h3>
                  <span className="text-purple-500">{openIndex === i ? "−" : "+"}</span>
                </div>
                {openIndex === i && <p className="mt-2 text-gray-300">{faq.answer}</p>}
              </div>
            ))}
          </section>

          {/* Footer */}
          <footer className="text-center py-6 text-gray-400 text-sm">
            © {new Date().getFullYear()} MovieHub — Neon Futuristic Edition
          </footer>
        </main>
      </div>

      {/* Neon Glow Styles */}
      <style jsx>{`
        .text-neon-purple { color: #bb00ff; text-shadow: 0 0 8px #bb00ff, 0 0 16px #aa00ff; }
        .shadow-neon { box-shadow: 0 0 20px #bb00ff, 0 0 40px #aa00ff; }
        .shadow-neon:hover { box-shadow: 0 0 40px #ff00ff, 0 0 60px #aa00ff; }
        .animate-pulse-slow { animation: pulse 8s infinite alternate; }
        @keyframes pulse { 0% {opacity:0.8;} 50% {opacity:1;} 100% {opacity:0.8;} }
      `}</style>
    </div>
  );
}
