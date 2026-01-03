console.log("AUTH ROUTER LOADED");
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

// ⚠️ Gebruik in productie een echte geheime sleutel via .env
const JWT_SECRET = process.env.JWT_SECRET || "vervang_dit_door_een_veilige_string";

// =========================
//   JWT MIDDLEWARE
// =========================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Geen token meegegeven" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // bevat id, role, player_id
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Ongeldige token" });
  }
}

// =========================
//        LOGIN ROUTE
// =========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. User ophalen
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Onjuist email"
      });
    }

    const user = rows[0];

    // 2. Wachtwoord checken
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Onjuist wachtwoord"
      });
    }

    // 3. JWT token maken
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        player_id: user.player_id, // belangrijk voor spelers
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 4. Response sturen
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        player_id: user.player_id,
      },
    });

  } catch (err) {
    console.error("Login fout:", err);
    res.status(500).json({
      success: false,
      message: "Serverfout bij inloggen"
    });
  }
});

// =========================
//        AUTH /ME
// =========================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, role, player_id FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Gebruiker niet gevonden" });
    }

    res.json({
      success: true,
      user: rows[0]
    });

  } catch (err) {
    console.error("Fout bij /auth/me:", err);
    res.status(500).json({ success: false, message: "Serverfout" });
  }
});

export default router;


