import { Router } from 'express';
import { pool } from '../db.js';   // ✅ correcte import

const router = Router();

function validateScore(body) {
  const fields = ['inzet','conditie','tactiek','techniek_basis','proactief','techniek_hoog'];
  for (const f of fields) {
    const v = Number(body[f]);
    if (!Number.isInteger(v) || v < 1 || v > 5) return `Invalid ${f}`;
  }
  return null;
}

// ✅ Score toevoegen
router.post('/', async (req, res) => {
  const { player_id, training_id, ...metrics } = req.body;

  if (!player_id || !training_id) {
    return res.status(400).json({ error: 'player_id and training_id required' });
  }

  const err = validateScore(metrics);
  if (err) return res.status(400).json({ error: err });

  try {
    const [result] = await pool.query(
      `INSERT INTO scores 
       (player_id, training_id, inzet, conditie, tactiek, techniek_basis, proactief, techniek_hoog)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        player_id,
        training_id,
        metrics.inzet,
        metrics.conditie,
        metrics.tactiek,
        metrics.techniek_basis,
        metrics.proactief,
        metrics.techniek_hoog
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM scores WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Score voor deze speler & training bestaat al' });
    } else {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// ✅ Scores van één speler ophalen
router.get('/player/:id', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.*, t.label 
     FROM scores s 
     JOIN trainings t ON s.training_id = t.id 
     WHERE s.player_id = ?
     ORDER BY t.id ASC`,
    [req.params.id]
  );

  res.json(rows);
});

// ✅ Team scores voor één training
router.get('/team/:trainingId', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.name, p.position, s.* 
     FROM scores s 
     JOIN players p ON s.player_id = p.id 
     WHERE s.training_id = ?
     ORDER BY p.id ASC`,
    [req.params.trainingId]
  );

  res.json(rows);
});

// ✅ Overzicht per metric
router.get('/overview/:metric', async (req, res) => {
  const metric = req.params.metric;
  const allowed = ['inzet','conditie','tactiek','techniek_basis','proactief','techniek_hoog'];

  if (!allowed.includes(metric)) {
    return res.status(400).json({ error: 'Unknown metric' });
  }

  const [rows] = await pool.query(
    `SELECT p.id, p.name, AVG(s.${metric}) AS avg_metric
     FROM players p
     LEFT JOIN scores s ON s.player_id = p.id
     GROUP BY p.id, p.name
     ORDER BY avg_metric DESC`
  );

  res.json(rows);
});

// ✅ Score verwijderen
router.delete('/:id', async (req, res) => {
  const [result] = await pool.query(
    'DELETE FROM scores WHERE id = ?',
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Score niet gevonden' });
  }

  res.json({ success: true });
});

export default router;


