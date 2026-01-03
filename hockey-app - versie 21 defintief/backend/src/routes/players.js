import { Router } from "express";
import { pool } from "../db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router = Router();

/* ============================
      NIEUWE SPELER TOEVOEGEN
============================ */
router.post("/", async (req, res) => {
  const { name, age, position, photo_url, email } = req.body;

  if (!name || !age || !position || !email) {
    return res.status(400).json({ error: "name, age, position, email required" });
  }

  try {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // 0. Check of user al bestaat
    const [existingUser] = await pool.query(
      "SELECT id, player_id FROM users WHERE email = ?",
      [email]
    );

    // 1. Speler aanmaken
    const [result] = await pool.query(
      `INSERT INTO players (name, age, position, photo_url, email, reset_token, reset_token_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, age, position, photo_url || null, email, resetToken, expires]
    );

    const playerId = result.insertId;
    console.log("Nieuwe speler ID:", playerId);

    // 2. User aanmaken of koppelen
    if (existingUser.length === 0) {
      // User bestaat nog niet → nieuwe user maken
      const [userResult] = await pool.query(
        `INSERT INTO users (email, password_hash, role, player_id)
         VALUES (?, NULL, 'player', ?)`,
        [email, playerId]
      );
      console.log("Nieuwe user aangemaakt:", userResult);
    } else {
      // User bestaat al → player_id updaten naar de nieuwe speler
      console.log("User bestond al, oude koppeling:", existingUser[0].player_id);

      await pool.query(
        "UPDATE users SET player_id = ? WHERE email = ?",
        [playerId, email]
      );

      console.log("User opnieuw gekoppeld aan nieuwe speler:", playerId);
    }

    res.status(201).json({
      id: playerId,
      name,
      age,
      position,
      email,
      resetLink: `http://localhost:5173/reset-password/${resetToken}`
    });

  } catch (err) {
    console.error("FOUT BIJ SPELER TOEVOEGEN:", err);
    res.status(500).json({ error: "Database fout bij toevoegen speler" });
  }
});

/* ============================
      WACHTWOORD RESETTEN
============================ */
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Wachtwoord is verplicht" });
  }

  try {
    // Token opzoeken
    const [rows] = await pool.query(
      "SELECT id, reset_token_expires FROM players WHERE reset_token = ?",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Ongeldige of verlopen link" });
    }

    const playerId = rows[0].id;

    // Check geldigheid
    if (new Date(rows[0].reset_token_expires) < new Date()) {
      return res.status(400).json({ error: "Reset link is verlopen" });
    }

    // Wachtwoord hashen
    const hash = await bcrypt.hash(password, 10);

    // Wachtwoord opslaan in USERS
    const [update] = await pool.query(
      "UPDATE users SET password_hash = ? WHERE player_id = ?",
      [hash, playerId]
    );

    console.log("UPDATE RESULT:", update);

    if (update.affectedRows === 0) {
      return res.status(500).json({ error: "Geen user gekoppeld aan deze speler" });
    }

    // Token ongeldig maken
    await pool.query(
      "UPDATE players SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [playerId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ error: "Database fout bij resetten wachtwoord" });
  }
});

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
    await pool.query("DELETE FROM users WHERE player_id = ?", [req.params.id]);

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
/* ============================
   COACH: NIEUWE RESETLINK MAKEN
============================ */
router.post("/:id/reset-link", async (req, res) => {
  try {
    const playerId = req.params.id;

    // Check of speler bestaat
    const [rows] = await pool.query(
      "SELECT email FROM players WHERE id = ?",
      [playerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Speler niet gevonden" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // Token opslaan
    await pool.query(
      "UPDATE players SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [resetToken, expires, playerId]
    );

    res.json({
      success: true,
      resetLink: `http://localhost:5173/reset-password/${resetToken}`
    });

  } catch (err) {
    console.error("RESET-LINK ERROR:", err);
    res.status(500).json({ error: "Database fout bij resetlink genereren" });
  }
});


export default router;







