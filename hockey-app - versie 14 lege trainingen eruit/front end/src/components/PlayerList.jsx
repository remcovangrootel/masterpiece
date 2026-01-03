import React from "react";
import { Link } from "react-router-dom";

export default function PlayerList({ players, onDeleted, setEditingPlayer }) {
  if (!players || players.length === 0) {
    return <p>Geen spelers gevonden.</p>;
  }

  return (
    <div className="player-list">
      {players.map((p) => (
        <div key={p.id} className="player-card">
          {/* ✅ Geef de volledige speler mee via state */}
          <Link to={`/players/${p.id}`} state={{ player: p }} className="player-link">
            {p.photo_url ? (
              <img src={p.photo_url} alt={p.name} className="player-photo" />
            ) : (
              <div className="player-photo fallback">📷</div>
            )}
            <h3>{p.name}</h3>
          </Link>

          <p>Leeftijd: {p.age}</p>
          <p>Positie: {p.position}</p>

          <button onClick={() => setEditingPlayer(p)}>Bewerken</button>
          <button
            onClick={() => {
              if (window.confirm(`Weet je zeker dat je ${p.name} wilt verwijderen?`)) {
                onDeleted(p.id);
              }
            }}
          >
            Verwijderen
          </button>
        </div>
      ))}
    </div>
  );
}












