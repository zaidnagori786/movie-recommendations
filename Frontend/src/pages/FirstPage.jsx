import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

export default function SplitLayout() {
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const TMDB_KEY = "f91aa496d9470e9d690de49a13933feb";

  // 🧩 Fetch trending movies
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/movies/trending");
        setTrending(data.slice(0, 8));
      } catch (e) {
        console.error("Error fetching trending movies:", e);
      }
    })();
  }, []);

  // 🔍 Fetch search suggestions
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
            search
          )}&page=1`
        );
        const json = await res.json();
        setSuggestions(
          json.results?.filter((m) => m.poster_path).slice(0, 6) || []
        );
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleSuggestionClick = (m) => {
    alert(`⚠️ Please login first to view "${m.title}"!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-slate-900 text-white overflow-hidden flex items-center justify-center p-6 md:p-12">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-1 lg:order-1">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Unlimited movies, shows,{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400">
              and more.
            </span>
          </h1>

          <p className="text-gray-300 max-w-lg text-lg sm:text-base">
            Stream anywhere, anytime. Discover today’s top hits and fan
            favorites. Sign in to explore the best of cinema.
          </p>

          {/* 🔍 Search Bar */}
          <div className="w-full max-w-md relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Search movies, shows..."
              className="w-full px-5 py-3 rounded-2xl bg-black/60 border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 shadow-lg backdrop-blur-lg"
            />
            {isFocused && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-black/90 border border-gray-700 rounded-xl shadow-lg overflow-auto max-h-64 z-50 backdrop-blur-md">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(s);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 cursor-pointer transition"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${s.poster_path}`}
                      alt={s.title}
                      className="w-10 h-14 rounded-md object-cover"
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="text-xs text-gray-400">
                        {s.release_date?.slice(0, 4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔘 Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-blue-600 rounded-full font-semibold hover:shadow-[0_0_25px_rgba(150,80,255,0.6)] transition transform hover:scale-105"
            >
              Login
            </Link>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-6 py-3 border border-gray-700 rounded-full hover:bg-white/5 transition text-white font-medium"
            >
              {showInfo ? "Hide Info" : "Learn More"}
            </button>
          </div>

          {/* Info Box */}
          {showInfo && (
            <div className="mt-4 w-full animate-fadeIn">
              <p className="text-gray-300 text-sm bg-white/5 p-4 rounded-xl border border-white/10 max-w-md mx-auto lg:mx-0">
                The information collected by Google reCAPTCHA is subject to the
                Google Privacy Policy and Terms of Service, and is used for
                providing, maintaining, and improving the reCAPTCHA service and
                for general security purposes.
              </p>
            </div>
          )}
        </div>

        {/* 🍿 Right Section - Hidden on mobile */}
        <div className="relative justify-center items-center order-2 lg:order-2 hidden md:flex">
          <div className="absolute inset-0 bg-fuchsia-600/10 blur-[100px] rounded-full -z-10" />
          <div className="flex items-center justify-center gap-6">
            {trending.slice(0, 3).map((m, i) => (
              <div
                key={m.id || i}
                className={`relative transition-transform duration-500 hover:scale-110 hover:z-20 ${
                  i === 1 ? "scale-110 z-10" : "opacity-80"
                }`}
                style={{ transform: `translateY(${i === 1 ? "-10px" : "0"})` }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(250,80,255,0.4)] transition-all duration-500">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    className="w-44 md:w-56 h-72 md:h-80 object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent text-white text-sm p-3 font-medium">
                    {m.title.length > 20
                      ? m.title.slice(0, 20) + "..."
                      : m.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
