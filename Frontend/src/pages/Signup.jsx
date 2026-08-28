import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import API from "../utils/api";
import { useContext } from "react";
import { UserContext } from "../../contex/UserContext.jsx";


export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


const { login } = useContext(UserContext);
  // 🔐 Google OAuth login function
  
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const res = await API.post("/auth/google", {
        access_token: tokenResponse.access_token,
      });

      // ✅ UPDATE GLOBAL USER STATE
      login(res.data.user, res.data.token);

      // ✅ REDIRECT
      navigate("/Home");
    } catch (err) {
      console.error("Google Login Failed", err);
      alert("Google login failed");
    }
  },
});
  // Normal email signup
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
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center text-white">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-red-900/40"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(255,0,0,0.3)]">
        
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Signup 🍿
        </h2>

        {/* NORMAL SIGNUP FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            required
            placeholder="Name"
            className="w-full px-4 py-2 bg-black/50 rounded-lg border border-white/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            required
            placeholder="Email"
            className="w-full px-4 py-2 bg-black/50 rounded-lg border border-white/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-4 py-2 bg-black/50 rounded-lg border border-white/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 py-2 rounded-lg text-lg font-semibold hover:scale-[1.03]"
          >
            Create Account
          </button>
        </form>

        {/* ✅ SAME BUTTON → GOOGLE LOGIN */}
        <div className="mt-6 text-center">
          <button
            onClick={() => googleLogin()}
            className="w-full mt-3 bg-white/10 border border-white/30 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition"
          >
            Sign up with Email
          </button>
        </div>

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
