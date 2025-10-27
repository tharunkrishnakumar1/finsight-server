import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./config/db.js";

import userRoutes from "./routes/users.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import authRoutes from "./routes/auth.js";
import wishlistRoutes from "./routes/wishlist.js";
import budgetRoutes from "./routes/budgets.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- Path setup for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(express.json());

// --- API Routes ---
app.use("/users", userRoutes);
app.use("/accounts", accountRoutes);
app.use("/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// --- Test DB Connection ---
app.get("/test-db", async (req, res) => {
  try {
    // ✅ PostgreSQL version
    const result = await pool.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: result.rows[0].result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Serve Frontend (important: last) ---
app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
