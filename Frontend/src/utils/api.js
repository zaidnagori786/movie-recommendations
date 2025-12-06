import axios from "axios";

const API = axios.create({ baseURL: "https://movie-backend-xyz.onrender.com/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// export const removeFavorite = (movieId) =>
//   API.delete("/auth/favorites", { data: { movieId } });
export default API;


// import axios from "axios";

// // ✅ Direct backend URL (change if you deploy backend later)
// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // your backend base URL
// });

// // ✅ Automatically attach JWT token for every request
// API.interceptors.request.use(
//   (req) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Handle 401 Unauthorized globally
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.warn("⚠️ Unauthorized! Redirecting to login...");
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;
