import React from 'react';
import { deletePlayer } from '../api.js';

export default function PlayerList({ players, onDeleted }) {
  const remove = async (id) => {
    if (window.confirm('Weet je zeker dat je deze speler wilt verwijderen?')) {
      await deletePlayer(id);
      onDeleted?.();
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
      {players.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
          <img src={p.photo_url || 'https://via.placeholder.com/200x150?text=Speler'} alt={p.name} />
          <div>
            <strong>{p.name}</strong><br />
            Leeftijd: {p.age}<br />
            Positie: {p.position}<br />
            <button onClick={() => remove(p.id)} style={{ marginTop: 6, background: 'red', color: 'white' }}>
              Verwijderen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

