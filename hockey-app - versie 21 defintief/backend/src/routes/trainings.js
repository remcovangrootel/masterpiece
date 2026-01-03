import { Router } from 'express';
import { pool } from '../db.js';   // ✅ correcte import

const router = Router();

// ✅ Alle trainingen ophalen
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM trainings ORDER BY date ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen trainingen' });
  }
});

// ✅ Training ophalen op id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM trainings WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Training niet gevonden' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij ophalen training' });
  }
});

// ✅ Training toevoegen
router.post('/', async (req, res) => {
  const { label, date } = req.body;

  if (!label || !date) {
    return res.status(400).json({ error: 'label en date zijn verplicht' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO trainings (label, date) VALUES (?, ?)',
      [label, date]
    );

    const [rows] = await pool.query(
      'SELECT * FROM trainings WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij toevoegen training' });
  }
});

// ✅ Training bijwerken
router.put('/:id', async (req, res) => {
  const { label, date } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE trainings SET label=?, date=? WHERE id=?',
      [label, date, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training niet gevonden' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM trainings WHERE id = ?',
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij bijwerken training' });
  }
});

// ✅ Training verwijderen
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM trainings WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training niet gevonden' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fout bij verwijderen training' });
  }
});

export default router;




