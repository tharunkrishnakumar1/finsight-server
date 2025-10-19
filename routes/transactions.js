
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ get all transactions (with optional filters)
router.get("/", async (req, res) => {
  const { account_id, category, sort, start_date, end_date } = req.query;

  // base query
  let query = "SELECT * FROM transactions WHERE 1=1";
  const params = [];

  // optional filters
  if (account_id) {
    query += " AND account_id = ?";
    params.push(account_id);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (start_date) {
    query += " AND date >= ?";
    params.push(start_date);
  }
  if (end_date) {
    query += " AND date <= ?";
    params.push(end_date);
  }

  // optional sort
  if (sort && sort.toLowerCase() === "desc") {
    query += " ORDER BY date DESC";
  } else {
    query += " ORDER BY date ASC";
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ create a new transaction
router.post("/", async (req, res) => {
  const { account_id, amount, category, description, date } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO transactions (account_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)",
      [account_id, amount, category, description, date]
    );
    res.json({
      id: result.insertId,
      account_id,
      amount,
      category,
      description,
      date,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
