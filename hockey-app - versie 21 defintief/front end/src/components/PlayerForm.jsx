import React, { useState, useEffect } from "react";

export default function PlayerForm({ onAdd, onUpdate, existingPlayer }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [email, setEmail] = useState("");

  // Velden invullen bij bewerken
  useEffect(() => {
    if (existingPlayer) {
      setName(existingPlayer.name);
      setAge(Math.max(0, existingPlayer.age));
      setPosition(existingPlayer.position);
      setPhotoUrl(existingPlayer.photo_url || "");
      setEmail(existingPlayer.email || ""); // alleen tonen als speler email heeft
    } else {
      setName("");
      setAge(0);
      setPosition("");
      setPhotoUrl("");
      setEmail("");
    }
  }, [existingPlayer]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const playerData = {
      id: existingPlayer ? existingPlayer.id : undefined,
      name,
      age: Math.max(0, age),
      position,
      photo_url: photoUrl || null,
      email: existingPlayer ? existingPlayer.email : email, // email alleen nieuw instellen
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

      {/* Alleen bij nieuwe speler e-mail invoeren */}
      {!existingPlayer && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail speler"
          required
        />
      )}

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












