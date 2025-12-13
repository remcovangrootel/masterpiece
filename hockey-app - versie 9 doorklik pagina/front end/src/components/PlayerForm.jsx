import React, { useState } from 'react';
import { addPlayer } from '../api.js';

export default function PlayerForm({ onAdded }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !position) {
      alert('Naam, leeftijd en positie zijn verplicht');
      return;
    }

    try {
      await addPlayer({
        name,
        age: Number(age),
        position,
        photo_url: photoUrl || null,
      });
      // reset form
      setName('');
      setAge('');
      setPosition('');
      setPhotoUrl('');
      onAdded(); // refresh lijst
    } catch (err) {
      console.error(err);
      alert('Toevoegen mislukt');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: '20px',
      padding: '15px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <h3>Nieuwe speler toevoegen</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>Naam:</label><br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Leeftijd:</label><br />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Positie:</label><br />
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Foto‑URL:</label><br />
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="/images/players/default.png"
          style={{ width: '100%', padding: '6px' }}
        />
      </div>
      <button type="submit" style={{
        padding: '8px 16px',
        background: '#2b8a3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        ➕ Toevoegen
      </button>
    </form>
  );
}

