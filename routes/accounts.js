
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ get all accounts
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM accounts");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ create a new account
router.post("/", async (req, res) => {
  const { user_id, name, balance } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO accounts (user_id, name, balance) VALUES (?, ?, ?)",
      [user_id, name, balance]
    );
    res.json({ id: result.insertId, user_id, name, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
