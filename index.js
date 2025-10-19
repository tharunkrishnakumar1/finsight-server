// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js"; // ✅ now using Postgres
import wishlistRoutes from "./routes/wishlist.js";
import budgetsRoutes from "./routes/budgets.js";
import transactionsRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Test PostgreSQL connection
pool
  .connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("❌ PostgreSQL connection error:", err.message));

// ✅ Use your wishlist routes
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/transactions", transactionsRoutes);

// Basic API check route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Finsight backend is live!" });
});

// ✅ Add test DB route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Database connected successfully!",
      serverTime: result.rows[0].now,
    });
  } catch (err) {
    console.error("❌ Database test error:", err.message);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Finsight backend is live on port ${PORT}`);
});
