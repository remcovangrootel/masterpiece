import React, { useState, useEffect } from 'react';
import PlayerList from './PlayerList.jsx';

export default function PlayerPage({
  players,
  onAdd,
  onUpdate,
  onDelete,
  editingPlayer,
  setEditingPlayer
}) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    position: '',
    photo_url: ''
  });

  // ✅ Vul formulier bij bewerken
  useEffect(() => {
    if (editingPlayer) {
      setForm({
        name: editingPlayer.name,
        age: editingPlayer.age,
        position: editingPlayer.position,
        photo_url: editingPlayer.photo_url || ''
      });
    } else {
      setForm({ name: '', age: '', position: '', photo_url: '' });
    }
  }, [editingPlayer]);

  function handleSubmit(e) {
    e.preventDefault();
    const playerData = {
      id: editingPlayer ? editingPlayer.id : undefined,
      ...form,
      age: parseInt(form.age, 10)
    };

    if (editingPlayer) {
      onUpdate(playerData);
    } else {
      onAdd(playerData);
    }

    setForm({ name: '', age: '', position: '', photo_url: '' });
  }

  return (
    <div className="player-page">
      <h2>Spelers</h2>

      {/* Formulier om speler toe te voegen/bewerken */}
      <form onSubmit={handleSubmit} className="player-form">
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
        <select
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
        >
          <option value="">-- Kies positie --</option>
          <option value="Keeper">Keeper</option>
          <option value="Verdediger">Verdediger</option>
          <option value="Middenvelder">Middenvelder</option>
          <option value="Aanvaller">Aanvaller</option>
        </select>
        <input
          type="text"
          placeholder="Foto URL"
          value={form.photo_url}
          onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
        />
        <button type="submit">
          {editingPlayer ? 'Opslaan' : 'Toevoegen'}
        </button>
      </form>

      {/* Spelerslijst */}
      <PlayerList
        players={players}
        onDeleted={onDelete}
        setEditingPlayer={setEditingPlayer}
      />
    </div>
  );
}


