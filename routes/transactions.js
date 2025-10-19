// server/routes/transactions.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ Get all transactions
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// ✅ Add a new transaction
router.post("/", async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ error: "Description and amount are required" });
    }

    const query = `
      INSERT INTO transactions (description, amount, category, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [description, amount, category || null, date || new Date()];
    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding transaction:", err.message);
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

// ✅ Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    console.error("Error deleting transaction:", err.message);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
