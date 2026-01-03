import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";

const router = Router();

// POST /reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Token opzoeken
    const [rows] = await pool.query(
      "SELECT id FROM players WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Ongeldige of verlopen resetlink" });
    }

    const playerId = rows[0].id;

    // Nieuw wachtwoord hashen
    const hashed = await bcrypt.hash(password, 10);

    // Wachtwoord opslaan + token verwijderen
    await pool.query(
      "UPDATE players SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, playerId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ error: "Serverfout" });
  }
});

export default router;
