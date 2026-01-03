import { Router } from "express";
import { pool } from "../db.js";
import crypto from "crypto";

const router = Router();

/* ============================
      ALLE SPELERS OPHALEN
============================ */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM players ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij ophalen spelers" });
  }
});

/* ============================
      SPELER OP ID OPHALEN
============================ */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM players WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Speler niet gevonden" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij ophalen speler" });
  }
});

/* ============================
      SCORES OPHALEN
============================ */
router.get("/:id/scores", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, t.label, t.date 
       FROM scores s 
       JOIN trainings t ON s.training_id = t.id 
       WHERE s.player_id = ? 
       ORDER BY t.date ASC`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij ophalen scores" });
  }
});

/* ============================
      TRAININGEN OPHALEN
============================ */
router.get("/:id/trainings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM trainings WHERE date >= NOW() ORDER BY date ASC"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij ophalen trainingen" });
  }
});

/* ============================
      NIEUWE SPELER TOEVOEGEN
============================ */
router.post("/", async (req, res) => {
  const { name, age, position, photo_url, email } = req.body;

  if (!name || !age || !position || !email) {
    return res.status(400).json({ error: "name, age, position, email required" });
  }

  try {
    // Reset token genereren
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 uur

    const [result] = await pool.query(
      `INSERT INTO players (name, age, position, photo_url, email, reset_token, reset_token_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, age, position, photo_url || null, email, resetToken, expires]
    );

    const playerId = result.insertId;

    res.status(201).json({
      id: playerId,
      name,
      age,
      position,
      email,
      resetLink: `http://localhost:5173/reset-password/${resetToken}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij toevoegen speler" });
  }
});

/* ============================
      SPELER BIJWERKEN
============================ */
router.put("/:id", async (req, res) => {
  const { name, age, position, photo_url } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE players SET name=?, age=?, position=?, photo_url=? WHERE id=?",
      [name, age, position, photo_url || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Speler niet gevonden" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM players WHERE id = ?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij bijwerken speler" });
  }
});

/* ============================
      SPELER VERWIJDEREN
============================ */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM players WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Speler niet gevonden" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fout bij verwijderen speler" });
  }
});

export default router;




