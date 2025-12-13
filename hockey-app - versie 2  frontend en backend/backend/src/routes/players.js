import { Router } from 'express';
import { getPool } from '../db.js';
const router = Router();

router.get('/', async (req, res) => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM players ORDER BY id ASC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, age, position, photo_url } = req.body;
  if (!name || !age || !position) return res.status(400).json({ error: 'name, age, position required' });
  const pool = await getPool();
  const [result] = await pool.query(
    'INSERT INTO players (name, age, position, photo_url) VALUES (?,?,?,?)',
    [name, age, position, photo_url || null]
  );
  const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

export default router;
