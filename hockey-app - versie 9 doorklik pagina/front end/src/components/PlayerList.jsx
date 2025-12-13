import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePlayer } from '../api.js';

export default function PlayerList({ players, onDeleted }) {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm('Weet je zeker dat je deze speler wilt verwijderen?')) {
      try {
        await deletePlayer(id);
        onDeleted(); // refresh de lijst
      } catch (err) {
        console.error(err);
        alert('Verwijderen mislukt');
      }
    }
  };

  return (
    <div className="grid">
      {players.map((p) => (
        <div key={p.id} className="card" style={{ textAlign: 'center' }}>
          {/* Foto */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <img
              src={p.photo_url || '/images/players/default.png'}
              alt={p.name}
              className="player-photo"
            />
          </div>

          {/* Info */}
          <h4 style={{ margin: '6px 0' }}>{p.name}</h4>
          <p style={{ margin: 0, color: '#555' }}>
            Leeftijd: {p.age} • Positie: {p.position}
          </p>

          {/* Knoppen */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
            <button
              className="button secondary"
              onClick={() => navigate(`/players/${p.id}`)}
            >
              Details
            </button>
            <button
              className="button danger"
              onClick={() => handleDelete(p.id)}
            >
              Verwijderen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}



