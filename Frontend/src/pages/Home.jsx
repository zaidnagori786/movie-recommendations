import { useEffect, useState } from "react";
import API from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const TMDB_KEY = "f91aa496d9470e9d690de49a13933feb";

  const GENRES = [
    { id: "All", name: "All" },
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 16, name: "Animation" },
  ];

  // ⭐ Remove duplicate movies
  const removeDuplicates = (movies) => {
    const map = new Map();
    movies.forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  };

  // 🎬 Fetch movies by genre (sorted by rating)
  const fetchMoviesByGenre = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all(
        GENRES.filter((g) => g.id !== "All").map((genre) =>
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genre.id}&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=100`
          ).then((res) => res.json())
        )
      );

      const genreMovies = {};
      GENRES.filter((g) => g.id !== "All").forEach((genre, i) => {
        const sortedMovies = (responses[i].results || []).sort(
          (a, b) => b.vote_average - a.vote_average
        );

        // FIX: Use genre.id as key
        genreMovies[genre.id] = sortedMovies;
      });

      setCategorizedMovies(genreMovies);
    } catch (err) {
      console.error("Error fetching categorized movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesByGenre();
  }, []);

  // 🔍 Fetch search suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1&include_adult=false`
      );
      const data = await res.json();
      setSuggestions(data.results?.filter((m) => m.poster_path) || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // ⏳ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) fetchSuggestions(search);
      else setSuggestions([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ✅ When clicking a suggestion
  const handleSelectSuggestion = async (movie) => {
    setSearch(movie.title);
    setSuggestions([]);
    setSelectedGenre("search");
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${encodeURIComponent(
          movie.title
        )}&page=1&include_adult=false`
      );
      const data = await res.json();

      const sorted = (data.results || [])
        .filter((m) => m.poster_path)
        .sort((a, b) => b.vote_average - a.vote_average);

      setCategorizedMovies((prev) => ({
        ...prev,
        search: sorted, // FIX
      }));
    } catch (err) {
      console.error("Error fetching movie details:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ FIXED: remove duplicates before showing
  const moviesToShow =
    selectedGenre === "All"
      ? removeDuplicates(
          Object.values(categorizedMovies)
            .flat()
            .sort((a, b) => b.vote_average - a.vote_average)
        )
      : removeDuplicates(categorizedMovies[selectedGenre] || []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1a1a40,_#000000_70%)]">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-purple-700/20 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] animate-pulse delay-3000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-14">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Movie Explorer 🎥
        </h1>
        <p className="text-gray-400 text-lg mt-2">
          Discover top-rated movies by category or search your favorites
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative z-50 flex justify-center mb-10">
        <div
          className={`relative w-full max-w-2xl transition-all duration-500 ${
            isFocused ? "scale-105" : "scale-100"
          }`}
        >
          <div
            className={`absolute -inset-0.5 rounded-2xl blur-md transition-all duration-500 ${
              isFocused
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 opacity-100"
                : "bg-gray-700/40 opacity-40"
            }`}
          ></div>

          <div
            className={`relative flex items-center border border-gray-700 rounded-2xl overflow-hidden 
            shadow-[0_0_20px_rgba(150,80,255,0.15)] backdrop-blur-sm transition-all duration-500
            ${search.trim() !== "" ? "bg-black/40" : "bg-black/70"}`}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 300)}
              placeholder="🔍 Search for movies..."
              className="w-full px-5 py-3 text-gray-200 bg-transparent focus:outline-none placeholder-gray-400"
            />
            <button
              onClick={() => fetchSuggestions(search)}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 
                        hover:from-fuchsia-500 hover:to-blue-500 transition-all font-semibold rounded-r-2xl"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute w-full mt-2 bg-black/90 border border-gray-700 rounded-xl shadow-2xl 
                            z-[9999] overflow-hidden max-h-72 backdrop-blur-md">
              {suggestions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectSuggestion(m)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 cursor-pointer transition"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                    alt={m.title}
                    className="w-10 h-14 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-gray-200 font-medium text-sm">{m.title}</p>
                    <p className="text-gray-500 text-xs">
                      ⭐ {m.vote_average?.toFixed(1)} | {m.release_date?.slice(0, 4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🎭 Genre Filter */}
      <div className="relative z-20 flex flex-wrap justify-center gap-4 mb-12 px-4">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 border 
              ${
                selectedGenre === genre.id
                  ? "bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white border-transparent shadow-lg"
                  : "bg-black/40 border-gray-700 hover:border-fuchsia-400 text-gray-300"
              }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* 🎬 Movies Display */}
      <div className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-400 text-lg animate-pulse mt-32">
            🎬 Loading movies...
          </div>
        ) : moviesToShow.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {selectedGenre === "search"
                ? "Search Results"
                : selectedGenre === "All"
                ? "All Movies"
                : GENRES.find((g) => g.id === selectedGenre)?.name}
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {moviesToShow.slice(0, 20).map((movie) => (
                <div
                  key={movie.id}
                  className="group transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_25px_rgba(150,80,255,0.3)]"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 italic mt-20">
            No movies found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
