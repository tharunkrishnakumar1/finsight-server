// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import wishlistRoutes from "./routes/wishlist.js"; // ✅ import route file

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Test MySQL connection
pool.getConnection()
  .then(() => console.log("✅ Connected to MySQL"))
  .catch(err => console.error("❌ MySQL connection error:", err.message));

// ✅ Use the wishlist routes here
app.use("/api/wishlist", wishlistRoutes);

// Test route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Finsight backend is live!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Finsight backend is live on port ${PORT}`);
});
