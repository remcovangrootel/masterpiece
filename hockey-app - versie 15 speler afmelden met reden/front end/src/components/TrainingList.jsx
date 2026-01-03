import React from 'react';
import { deleteTraining } from '../api.js';

export default function TrainingList({ trainings, onDeleted }) {
  const remove = async (id) => {
    if (window.confirm('Weet je zeker dat je deze training wilt verwijderen?')) {
      await deleteTraining(id);
      onDeleted?.();
    }
  };

  if (!trainings.length) return <p>Geen trainingen beschikbaar.</p>;

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Overzicht trainingen</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {trainings.map(t => (
          <li key={t.id} style={{ borderBottom: '1px solid #ddd', padding: '6px 0' }}>
            <strong>{t.label}</strong> {t.date ? `— ${t.date}` : ''}
            <button onClick={() => remove(t.id)} style={{ marginLeft: 10, background: 'red', color: 'white' }}>
              Verwijderen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

