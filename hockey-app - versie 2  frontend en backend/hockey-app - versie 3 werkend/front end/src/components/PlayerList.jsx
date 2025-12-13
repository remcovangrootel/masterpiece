import React from 'react';

export default function PlayerList({ players }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
      {players.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
          <img
            src={p.photo_url || 'https://via.placeholder.com/200x150?text=Speler'}
            alt={p.name}
            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }}
          />
          <div style={{ marginTop: 8 }}>
            <strong>{p.name}</strong><br />
            Leeftijd: {p.age}<br />
            Positie: {p.position}
          </div>
        </div>
      ))}
    </div>
  );
}
