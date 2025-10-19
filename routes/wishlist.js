
// server/routes/wishlist.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ Get all wishlist items
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM wishlist ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching wishlist:", err.message);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// ✅ Add a new wishlist item
router.post("/", async (req, res) => {
  try {
    const { name, amount, priority } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ error: "Name and amount are required" });
    }

    await pool.query(
      "INSERT INTO wishlist (name, amount, priority) VALUES (?, ?, ?)",
      [name, amount, priority || 1]
    );

    res.json({ success: true, message: "Item added to wishlist!" });
  } catch (err) {
    console.error("Error adding wishlist item:", err.message);
    res.status(500).json({ error: "Failed to add wishlist item" });
  }
});

// ✅ Delete a wishlist item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM wishlist WHERE id = ?", [id]);
    res.json({ success: true, message: "Item deleted!" });
  } catch (err) {
    console.error("Error deleting wishlist item:", err.message);
    res.status(500).json({ error: "Failed to delete wishlist item" });
  }
});

export default router;
