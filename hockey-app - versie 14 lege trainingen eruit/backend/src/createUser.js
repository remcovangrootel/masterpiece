import bcrypt from "bcryptjs";

import { pool } from "./db.js";

async function createUser() {
  const email = "coach@team.nl";
  const password = "hockey123";
  const role = "coach";

  const password_hash = await bcrypt.hash(password, 10);

  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    console.log("❌ User bestaat al");
    process.exit(0);
  }

  await pool.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    [email, password_hash, role]
  );

  console.log("✅ User aangemaakt!");
  console.log("Email:", email);
  console.log("Wachtwoord:", password);

  process.exit(0);
}

createUser();
