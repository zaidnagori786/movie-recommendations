import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
// import favoriteRoutes from "./routes/favorites.js"; // ✅ Added this

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://movie-recommendationss.onrender.com", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
// app.use("/api/favorites", favoriteRoutes); // ✅ Favorites route

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import serverless from "serverless-http";

// import authRoutes from "./routes/auth.js";
// import movieRoutes from "./routes/movies.js";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/movies", movieRoutes);

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // Export for Vercel Serverless
// export const handler = serverless(app);

