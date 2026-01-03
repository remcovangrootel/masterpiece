
import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/* ----------------------------------------------------
   1) Coach overzicht: alle afmeldingen met speler + training info
---------------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        ta.id,
        ta.reason,
        p.id AS player_id,
        p.name AS player_name,
        t.id AS training_id,
        t.label AS training_label,
        t.date AS training_date
      FROM training_absences ta
      JOIN players p ON p.id = ta.player_id
      JOIN trainings t ON t.id = ta.training_id
      ORDER BY t.date ASC`
    );

    return res.json(rows);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Database fout bij ophalen coach overzicht"
    });
  }
});

/* ----------------------------------------------------
   2) ALLE AFMELDINGEN VAN ÉÉN SPELER
---------------------------------------------------- */
router.get("/player/:player_id", async (req, res) => {
  const { player_id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM training_absences WHERE player_id = ?",
      [player_id]
    );

    return res.json(Array.isArray(rows) ? rows : []);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Database fout bij ophalen afmeldingen"
    });
  }
});

/* ----------------------------------------------------
   3) Speler meldt zich af
---------------------------------------------------- */
router.post("/", async (req, res) => {
  const { player_id, training_id, reason } = req.body;

  if (!player_id || !training_id) {
    return res.status(400).json({ success: false, message: "player_id en training_id zijn verplicht" });
  }

  try {
    await pool.query(
      "INSERT INTO training_absences (player_id, training_id, reason) VALUES (?, ?, ?)",
      [player_id, training_id, reason || null]
    );

    return res.json({ success: true, message: "Afmelding opgeslagen" });

  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Je bent al afgemeld voor deze training"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Database fout bij afmelden"
    });
  }
});

/* ----------------------------------------------------
   4) Afmelding ongedaan maken
---------------------------------------------------- */
router.delete("/:player_id/:training_id", async (req, res) => {
  const { player_id, training_id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM training_absences WHERE player_id = ? AND training_id = ?",
      [player_id, training_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Geen afmelding gevonden om te verwijderen"
      });
    }

    return res.json({
      success: true,
      message: "Afmelding ongedaan gemaakt"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Database fout bij verwijderen afmelding"
    });
  }
});

/* ----------------------------------------------------
   5) Check of speler afgemeld is voor één training
---------------------------------------------------- */
router.get("/:player_id/:training_id", async (req, res) => {
  const { player_id, training_id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM training_absences WHERE player_id = ? AND training_id = ?",
      [player_id, training_id]
    );

    return res.json({
      success: true,
      absent: rows.length > 0,
      info: rows[0] || null
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Database fout bij checken afmelding"
    });
  }
});

export default router;




