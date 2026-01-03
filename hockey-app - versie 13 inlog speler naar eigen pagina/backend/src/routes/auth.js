import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

// ⚠️ Gebruik in productie een echte geheime sleutel via .env
const JWT_SECRET = "vervang_dit_door_een_veilige_string";

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

export default router;

