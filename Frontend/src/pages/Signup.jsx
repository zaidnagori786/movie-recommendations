import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { name, email, password });
      alert("✅ Registered successfully!");
      navigate("/login");
    } catch {
      alert("❌ Registration failed. Try again!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center text-white overflow-hidden">
      {/* Cinematic dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-red-900/40 backdrop-blur-sm"></div>

      {/* Light glow behind the form */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full animate-pulse"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(255,0,0,0.3)] hover:shadow-[0_0_80px_rgba(255,0,0,0.5)] transition-all duration-500">
        <h2 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
           Signup 🍿
        </h2>
       

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-black/50 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-black/50 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
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
              className="w-full px-4 py-2 bg-black/50 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-600 py-2 rounded-lg text-lg font-semibold shadow-lg hover:scale-[1.03] hover:shadow-red-500/40 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-400 hover:text-red-300 cursor-pointer font-semibold"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
