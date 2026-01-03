import React, { useState, useEffect } from 'react';
import { addScore, getTeamScoresByTraining, deleteScore } from '../api.js';

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
  const [scores, setScores] = useState({});
  const [teamScores, setTeamScores] = useState([]);

  useEffect(() => {
    if (trainingId) {
      getTeamScoresByTraining(trainingId).then(setTeamScores);
    }
  }, [trainingId]);

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
      getTeamScoresByTraining(trainingId).then(setTeamScores);
    } catch (e) {
      alert('Opslaan mislukt (mogelijk al ingevuld voor deze training).');
    }
  };

  const removeScore = async (id) => {
    if (window.confirm('Weet je zeker dat je deze score wilt verwijderen?')) {
      await deleteScore(id);
      getTeamScoresByTraining(trainingId).then(setTeamScores);
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

      {/* Invoer per speler */}
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

      {/* Overzicht met delete-knop */}
      <div style={{ marginTop: 20 }}>
        <h3>Ingevoerde scores voor {trainings.find(t => t.id === trainingId)?.label}</h3>
        {teamScores.length === 0 ? (
          <p>Geen scores ingevoerd.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Speler</th>
                {metrics.map(m => <th key={m.key}>{m.label}</th>)}
                <th>Actie</th>
              </tr>
            </thead>
            <tbody>
              {teamScores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  {metrics.map(m => <td key={m.key}>{s[m.key]}</td>)}
                  <td>
                    <button onClick={() => removeScore(s.id)} style={{ background: 'red', color: 'white' }}>
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

