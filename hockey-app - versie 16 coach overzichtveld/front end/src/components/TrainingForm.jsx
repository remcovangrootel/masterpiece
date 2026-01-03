import React, { useState } from 'react';
import { addTraining } from '../api.js';

export default function TrainingForm({ onAdded }) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await addTraining({ label, date });
    setLabel('');
    setDate('');
    onAdded?.();
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <div>
        <label>Training naam<br />
          <input value={label} onChange={e => setLabel(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>Datum<br />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
      </div>
      <button type="submit">Training toevoegen</button>
    </form>
  );
}
