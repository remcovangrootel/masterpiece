console.log("AUTH ROUTER LOADED");
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import crypto from "crypto";

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

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Onjuist wachtwoord"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        player_id: user.player_id,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

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

// =========================
//   RESET PASSWORD TOKEN
// =========================
router.post("/create-reset-token", async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Email niet gevonden" });
    }

    const user = rows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 uur

    await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [token, expires, user.id]
    );

    res.json({
      success: true,
      resetLink: `http://localhost:5173/reset-password/${token}`
    });

  } catch (err) {
    console.error("Fout bij reset-token:", err);
    res.status(500).json({ success: false, message: "Serverfout" });
  }
});

// =========================
//   RESET PASSWORD ROUTE
// =========================
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Token ongeldig of verlopen" });
    }

    const user = rows[0];

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, user.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Fout bij reset-password:", err);
    res.status(500).json({ success: false, message: "Serverfout" });
  }
});

export default router;


