import React, { useState, useEffect } from "react";

export default function PlayerForm({ onAdd, onUpdate, existingPlayer }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Velden invullen bij bewerken
  useEffect(() => {
    if (existingPlayer) {
      setName(existingPlayer.name);
      setAge(Math.max(0, existingPlayer.age)); // nooit negatief
      setPosition(existingPlayer.position);
      setPhotoUrl(existingPlayer.photo_url || "");
    } else {
      setName("");
      setAge(0);
      setPosition("");
      setPhotoUrl("");
    }
  }, [existingPlayer]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const playerData = {
      id: existingPlayer ? existingPlayer.id : undefined,
      name,
      age: Math.max(0, age), // extra beveiliging
      position,
      photo_url: photoUrl || null,
    };

    if (existingPlayer) {
      onUpdate(playerData);
    } else {
      onAdd(playerData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="player-form">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Naam"
        required
      />

      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Math.max(0, Number(e.target.value)))}
        placeholder="Leeftijd"
        min="0"
        step="1"
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

      <button type="submit">
        {existingPlayer ? "Opslaan" : "Toevoegen"}
      </button>
    </form>
  );
}











