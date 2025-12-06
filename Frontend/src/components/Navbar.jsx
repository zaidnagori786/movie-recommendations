import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          🎬 Movie<span className="text-white">Hub</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              {/* Favorites link (only visible when logged in) */}
              <Link
                to="/favorites"
                className="text-gray-300 hover:text-white font-medium hover:scale-105 transition-all duration-200"
              >
                ❤️ Favorites
              </Link>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium hover:scale-105 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
