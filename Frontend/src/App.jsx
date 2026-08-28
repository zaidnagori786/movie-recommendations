import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Favorites from "./pages/Favorites.jsx";
import FirstPage from "./pages/FirstPage.jsx";
import Subscription from "./pages/Subscription.jsx";
import Profile from "./pages/Profile.jsx";
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/firstpage" />} />
        <Route path="/firstpage" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} /> {/* ✅ Home after login */}
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/favorites" element={<Favorites />} />
<Route path="/subscription" element={<Subscription />} />

      </Routes>
    </Router>
  );
}


