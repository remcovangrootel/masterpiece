import React, { useState } from 'react';
import { addPlayer } from '../api.js';

export default function PlayerForm({ onAdded }) {
  const [form, setForm] = useState({ name: '', age: '', position: 'Middenvelder', photo_url: '' });

  const submit = async (e) => {
    e.preventDefault();
    await addPlayer({ ...form, age: Number(form.age) });
    setForm({ name: '', age: '', position: 'Middenvelder', photo_url: '' });
    onAdded?.();
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
      <div>
        <label>Naam<br />
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </label>
      </div>
      <div>
        <label>Leeftijd<br />
          <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
        </label>
      </div>
      <div>
        <label>Positie<br />
          <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}>
            <option>Keeper</option>
            <option>Verdediger</option>
            <option>Middenvelder</option>
            <option>Aanvaller</option>
          </select>
        </label>
      </div>
      <div>
        <label>Foto URL<br />
          <input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} />
        </label>
      </div>
      <button type="submit">Toevoegen</button>
    </form>
  );
}
