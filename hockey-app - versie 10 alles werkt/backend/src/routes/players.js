import { Router } from 'express';
import { getPool } from '../db.js';

const router = Router();

// ✅ Alle spelers ophalen
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM players ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen spelers' });
  }
});

// ✅ Speler ophalen op id
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Speler niet gevonden' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen speler' });
  }
});

// ✅ Scores van een speler ophalen
router.get('/:id/scores', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT s.*, t.label, t.date FROM scores s JOIN trainings t ON s.training_id = t.id WHERE s.player_id = ? ORDER BY t.date ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen scores' });
  }
});

// ✅ Aankomende trainingen ophalen
router.get('/:id/trainings', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT * FROM trainings WHERE date >= NOW() ORDER BY date ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen trainingen' });
  }
});

// ✅ Nieuwe speler toevoegen
router.post('/', async (req, res) => {
  const { name, age, position, photo_url } = req.body;
  if (!name || !age || !position) {
    return res.status(400).json({ error: 'name, age, position required' });
  }

  try {
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO players (name, age, position, photo_url) VALUES (?,?,?,?)',
      [name, age, position, photo_url || null]
    );

    const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij toevoegen speler' });
  }
});

// ✅ Speler verwijderen
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [result] = await pool.query('DELETE FROM players WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Speler niet gevonden' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij verwijderen speler' });
  }
});

// ✅ Speler bijwerken
router.put('/:id', async (req, res) => {
  const { name, age, position, photo_url } = req.body;

  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij bijwerken speler' });
  }
});

export default router;



