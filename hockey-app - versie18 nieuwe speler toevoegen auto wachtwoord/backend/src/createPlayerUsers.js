import bcrypt from "bcryptjs";
import { pool } from "./db.js";

async function createUsersForPlayers() {
  const defaultPassword = "speler123";

  const [players] = await pool.query("SELECT id, name FROM players");

  for (const player of players) {
    const email = `${player.name.toLowerCase().replace(/\s+/g, '')}@team.nl`;

    // Check of user al bestaat
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE player_id = ?",
      [player.id]
    );

    if (exists.length > 0) {
      console.log(`⏭️ User voor ${player.name} bestaat al`);
      continue;
    }

    const password_hash = await bcrypt.hash(defaultPassword, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, role, player_id) VALUES (?, ?, 'player', ?)",
      [email, password_hash, player.id]
    );

    console.log(`✅ User aangemaakt voor ${player.name}: ${email}`);
  }

  console.log("🎉 Klaar!");
  process.exit(0);
}

createUsersForPlayers();
