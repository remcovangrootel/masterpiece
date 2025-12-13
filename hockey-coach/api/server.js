import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Maak connectie met MySQL
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL
});

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Alle spelers ophalen
app.get("/players", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM players ORDER BY id ASC");
  res.json(rows);
});

// Speler toevoegen
app.post("/players", async (req, res) => {
  const { name, age, position, photo_url } = req.body;
  const [result] = await pool.query(
    "INSERT INTO players (name, age, position, photo_url) VALUES (?,?,?,?)",
    [name, age, position, photo_url]
  );
  res.json({ id: result.insertId, name, age, position, photo_url });
});

// Trainingen ophalen
app.get("/trainings", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM trainings ORDER BY id ASC");
  res.json(rows);
});

app.listen(process.env.PORT, () => {
  console.log(`API running on http://localhost:${process.env.PORT}`);
});

