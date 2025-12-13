import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

// ✅ Alle trainingen ophalen
router.get('/', async (req, res) => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM trainings ORDER BY id ASC');
  res.json(rows);
});

// ✅ Nieuwe training toevoegen
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

// ✅ Training bijwerken
router.put('/:id', async (req, res) => {
  const { label, date } = req.body;
  const pool = await getPool();
  const [result] = await pool.query(
    'UPDATE trainings SET label=?, date=? WHERE id=?',
    [label, date || null, req.params.id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Training niet gevonden' });
  const [rows] = await pool.query('SELECT * FROM trainings WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

// ✅ Training verwijderen
router.delete('/:id', async (req, res) => {
  const pool = await getPool();
  const [result] = await pool.query('DELETE FROM trainings WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Training niet gevonden' });
  res.json({ success: true });
});

export default router;



