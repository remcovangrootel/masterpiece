import React, { useState } from 'react';
import PlayerList from './PlayerList.jsx';

export default function PlayerPage({ players, onAdd, onDelete }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    position: '',
    photo_url: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(form);
    setForm({ name: '', age: '', position: '', photo_url: '' }); // reset form
  }

  return (
    <div className="player-page">
      <h2>Spelers</h2>

      {/* Formulier om speler toe te voegen */}
      <form onSubmit={handleSubmit} className="add-player-form">
        <input
          type="text"
          placeholder="Naam"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Leeftijd"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />

        {/* ✅ Dropdown voor positie */}
        <select
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
        >
          <option value="">-- Kies positie --</option>
          <option value="keeper">Keeper</option>
          <option value="verdediger">Verdediger</option>
          <option value="middenvelder">Middenvelder</option>
          <option value="aanvaller">Aanvaller</option>
        </select>

        <input
          type="text"
          placeholder="Foto URL"
          value={form.photo_url}
          onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
        />
        <button type="submit">Toevoegen</button>
      </form>

      {/* Spelerslijst */}
      <PlayerList players={players} onDeleted={onDelete} />
    </div>
  );
}

