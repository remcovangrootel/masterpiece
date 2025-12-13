import { Router } from 'express';
import { getPool } from '../db.js';
const router = Router();

router.get('/', async (req, res) => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM trainings ORDER BY id ASC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { label, date } = req.body;
  if (!label) return res.status(400).json({ error: 'label required' });
  const pool = await getPool();
  const [result] = await pool.query(
    'INSERT INTO trainings (label, date) VALUES (?, ?)',
    [label, date || null]
  );
  const [rows] = await pool.query('SELECT * FROM trainings WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

export default router;
