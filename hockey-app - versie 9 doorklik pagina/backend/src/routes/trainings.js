import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

// ✅ Alle trainingen ophalen
router.get('/', async (req, res) => {
  const pool = await getPool();
  const [rows] = await pool.query('SELECT * FROM trainings ORDER BY id ASC');
  res.json(rows);
});

// ✅ Toekomstige trainingen voor een speler (via koppeltabel player_trainings)
router.get('/upcoming/:playerId', async (req, res) => {
  const pool = await getPool();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [rows] = await pool.query(
    `SELECT t.* 
     FROM trainings t
     JOIN player_trainings pt ON pt.training_id = t.id
     WHERE pt.player_id = ? AND (t.date IS NULL OR t.date > ?)
     ORDER BY t.date ASC`,
    [req.params.playerId, now]
  );
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

// ✅ Speler afmelden voor een training
router.post('/:id/unsubscribe', async (req, res) => {
  const { playerId } = req.body;
  if (!playerId) return res.status(400).json({ error: 'playerId required' });

  const pool = await getPool();
  const [result] = await pool.query(
    'DELETE FROM player_trainings WHERE player_id=? AND training_id=?',
    [playerId, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Geen inschrijving gevonden' });
  }

  res.json({ success: true });
});

// ✅ Training verwijderen
router.delete('/:id', async (req, res) => {
  const pool = await getPool();
  const [result] = await pool.query('DELETE FROM trainings WHERE id = ?', [req.params.id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Training niet gevonden' });
  }

  res.json({ success: true });
});

// ✅ Training bijwerken
router.put('/:id', async (req, res) => {
  const { label, date } = req.body;
  const pool = await getPool();

  const [result] = await pool.query(
    'UPDATE trainings SET label=?, date=? WHERE id=?',
    [label, date || null, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Training niet gevonden' });
  }

  const [rows] = await pool.query('SELECT * FROM trainings WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

export default router;


