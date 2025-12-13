import React, { useState } from 'react';
import { addTraining } from '../api.js';

export default function TrainingSelector({ trainings }) {
  const [label, setLabel] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    await addTraining({ label });
    setLabel('');
    alert('Training toegevoegd. Herlaad om lijst te verversen of maak automatische refresh.');
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ marginBottom: 6 }}>Beschikbare trainingen: {trainings.map(t => t.label).join(', ')}</div>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Nieuwe training label" value={label} onChange={e => setLabel(e.target.value)} />
        <button type="submit">Training toevoegen</button>
      </form>
    </div>
  );
}
