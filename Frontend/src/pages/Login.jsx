import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.post("/auth/login", { email, password });

    // Save token
    localStorage.setItem("token", data.token);

    // Save user info
    localStorage.setItem("user", JSON.stringify({
      name: data.user.name,
      email: data.user.email,
      subscription: data.user.subscription || "Free",
      favoritesCount: data.user.favoritesCount || 0,
    }));

    // Dispatch event for Navbar update
    window.dispatchEvent(new Event("storageUpdated"));

    alert("✅ Login successful!");
    navigate("/Home");
  } catch {
    alert("❌ Invalid email or password");
  }
};


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-purple-900/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(147,51,234,0.4)] transition-all duration-500">
        <h2 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Login 🎬
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-black/50 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-black/50 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 py-2 rounded-lg text-lg font-semibold shadow-lg hover:scale-[1.03] hover:shadow-purple-500/30 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer font-semibold"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
