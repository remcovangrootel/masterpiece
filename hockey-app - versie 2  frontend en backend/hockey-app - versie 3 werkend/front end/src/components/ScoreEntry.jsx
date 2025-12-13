import React, { useState } from 'react';
import { addScore } from '../api.js';

const metrics = [
  { key: 'inzet', label: 'Inzet' },
  { key: 'conditie', label: 'Conditie' },
  { key: 'tactiek', label: 'Tactiek' },
  { key: 'techniek_basis', label: 'Techniek basis' },
  { key: 'proactief', label: 'Proactief' },
  { key: 'techniek_hoog', label: 'Techniek hoger niveau' },
];

export default function ScoreEntry({ players, trainings }) {
  const [trainingId, setTrainingId] = useState(trainings[0]?.id || null);
  const [scores, setScores] = useState({}); // {playerId: {metric: value}}

  const onChange = (pid, key, val) => {
    setScores(s => ({ ...s, [pid]: { ...(s[pid] || {}), [key]: Number(val) } }));
  };

  const submitPlayer = async (pid) => {
    const data = scores[pid];
    if (!trainingId || !data) return alert('Selecteer training en voer scores in.');
    const payload = { player_id: pid, training_id: trainingId, ...data };
    try {
      await addScore(payload);
      alert(`Scores opgeslagen voor speler ${pid}`);
    } catch (e) {
      alert('Opslaan mislukt (mogelijk al ingevuld voor deze training).');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>Training: </label>
        <select value={trainingId ?? ''} onChange={e => setTrainingId(Number(e.target.value))}>
          <option value="" disabled>Kies training</option>
          {trainings.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {players.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10 }}>
            <strong>{p.name}</strong> — {p.position}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: 8 }}>
              {metrics.map(m => (
                <div key={m.key}>
                  <label>{m.label}<br />
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={scores[p.id]?.[m.key] ?? ''}
                      onChange={e => onChange(p.id, m.key, e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 8 }} onClick={() => submitPlayer(p.id)}>Scores opslaan</button>
          </div>
        ))}
      </div>
    </div>
  );
}
