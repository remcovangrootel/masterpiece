import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

// ✅ Alle spelers ophalen
router.get('/', async (req, res) => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM players ORDER BY id ASC');
  res.json(rows);
});

// ✅ Nieuwe speler toevoegen
router.post('/', async (req, res) => {
  const { name, age, position, photo_url } = req.body;
  if (!name || !age || !position) {
    return res.status(400).json({ error: 'name, age, position required' });
  }

  const pool = await getPool();
  const [result] = await pool.query(
    'INSERT INTO players (name, age, position, photo_url) VALUES (?,?,?,?)',
    [name, age, position, photo_url || null]
  );

  const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

// ✅ Speler verwijderen
router.delete('/:id', async (req, res) => {
  const pool = await getPool();
  const [result] = await pool.query('DELETE FROM players WHERE id = ?', [req.params.id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Speler niet gevonden' });
  }

  res.json({ success: true });
});

// ✅ Speler bijwerken (optioneel)
router.put('/:id', async (req, res) => {
  const { name, age, position, photo_url } = req.body;
  const pool = await getPool();

  const [result] = await pool.query(
    'UPDATE players SET name=?, age=?, position=?, photo_url=? WHERE id=?',
    [name, age, position, photo_url || null, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Speler niet gevonden' });
  }

  const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

export default router;

