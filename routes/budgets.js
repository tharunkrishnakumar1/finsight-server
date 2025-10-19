// server/routes/budgets.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ Get all budgets
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM budgets ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching budgets:", err.message);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// ✅ Add a new budget
router.post("/", async (req, res) => {
  try {
    const { category, amount, spent, start_date, end_date } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ error: "Category and amount are required" });
    }

    const query = `
      INSERT INTO budgets (category, amount, spent, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [category, amount, spent || 0, start_date || null, end_date || null];
    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding budget:", err.message);
    res.status(500).json({ error: "Failed to add budget" });
  }
});

// ✅ Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM budgets WHERE id = $1", [id]);
    res.json({ success: true, message: "Budget deleted" });
  } catch (err) {
    console.error("Error deleting budget:", err.message);
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

export default router;
