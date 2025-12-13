import React, { useState } from 'react';

export default function PlayerForm({ onAdded }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [position, setPosition] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hier komt jouw fetch
    const res = await fetch('http://localhost:4000/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        age: parseInt(age, 10),
        position,
        photo_url: photoUrl || null,
      }),
    });

    if (res.ok) {
      setName('');
      setAge('');
      setPosition('');
      setPhotoUrl('');
      onAdded(); // refresh de lijst
    } else {
      const err = await res.json();
      alert('Toevoegen mislukt: ' + err.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Naam"
        required
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Leeftijd"
        required
      />
      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      >
        <option value="">Kies positie</option>
        <option value="Keeper">Keeper</option>
        <option value="Verdediger">Verdediger</option>
        <option value="Middenvelder">Middenvelder</option>
        <option value="Aanvaller">Aanvaller</option>
      </select>
      <input
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
        placeholder="Foto URL (optioneel)"
      />
      <button type="submit">Toevoegen</button>
    </form>
  );
}


