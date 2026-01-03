import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = "vervang_dit_door_een_veilige_string";

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0) {
    return res.status(401).json({ success: false, message: "Onjuist email" });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ success: false, message: "Onjuist wachtwoord" });
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
});

export default router;
