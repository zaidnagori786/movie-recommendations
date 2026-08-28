import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../contex/UserContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const [showCard, setShowCard] = useState(false);

  const handleLogout = () => {
    logout();              // ✅ context logout
    setShowCard(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          🎬 MovieHub
        </Link>

        <div className="flex items-center space-x-5">
          {/* 🔓 NOT LOGGED IN */}
          {!user ? (
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
          ) : (
            <>
              {/* ❤️ FAVORITES */}
              <Link
                to="/favorites"
                className="text-gray-300 hover:text-white font-medium hover:scale-105 transition-all duration-200"
              >
                ❤️ Favorites
              </Link>

              {/* 👤 USER ICON */}
              <div className="relative">
                <div
                  onClick={() => setShowCard(!showCard)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl cursor-pointer shadow-md hover:scale-105 transition"
                >
                  👤
                </div>

                {/* USER CARD */}
                {showCard && (
                  <div className="absolute right-0 mt-3 w-72 bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl p-5 z-50">
                    
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                        👤
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl">
                      <p className="text-sm text-gray-300">Subscription</p>
                      <p className="text-md font-semibold text-purple-400">
                        {user.subscription || "Free"}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full text-left px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-gray-300"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => navigate("/subscription")}
                        className="w-full text-left px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-gray-300"
                      >
                        Manage Subscription
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      >
                        Logout
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
