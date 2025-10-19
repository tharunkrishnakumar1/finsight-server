import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ Get all budgets
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM budgets ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new budget
router.post("/", async (req, res) => {
  const { category, limit_amount } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO budgets (category, limit_amount) VALUES (?, ?)",
      [category, limit_amount]
    );
    res.json({
      id: result.insertId,
      category,
      limit_amount,
      spent: 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM budgets WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
