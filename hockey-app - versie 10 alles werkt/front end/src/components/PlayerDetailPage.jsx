import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PlayerDetailPage() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [scores, setScores] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Speler ophalen
        const resPlayer = await fetch(`http://localhost:4000/players/${id}`);
        if (resPlayer.ok) setPlayer(await resPlayer.json());

        // Scores ophalen
        const resScores = await fetch(`http://localhost:4000/players/${id}/scores`);
        if (resScores.ok) setScores(await resScores.json());

        // Aankomende trainingen ophalen
        const resTrainings = await fetch(`http://localhost:4000/players/${id}/trainings`);
        if (resTrainings.ok) setTrainings(await resTrainings.json());
      } catch (err) {
        console.error('Fout bij ophalen data:', err);
      }
    }
    fetchData();
  }, [id]);

  if (!player) return <p>Speler wordt geladen...</p>;

  return (
    <div className="player-detail">
      <h2>{player.name}</h2>
      <p>Leeftijd: {player.age}</p>
      <p>Positie: {player.position}</p>
      {player.photo_url && (
        <img src={`/images/players/${player.photo_url}`} alt={player.name} />

      )}

      {/* Scores tabel */}
      <h3>Scores</h3>
      {scores.length === 0 ? (
        <p>Geen scores gevonden.</p>
      ) : (
        <table className="score-table">
          <thead>
            <tr>
              <th>Training</th>
              <th>Datum</th>
              <th>Inzet</th>
              <th>Conditie</th>
              <th>Tactiek</th>
              <th>Techniek basis</th>
              <th>Proactief</th>
              <th>Techniek hoog</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s) => (
              <tr key={s.id}>
                <td>{s.label}</td>
                <td>{s.date ? new Date(s.date).toLocaleDateString() : 'onbekend'}</td>
                <td>{s.inzet}</td>
                <td>{s.conditie}</td>
                <td>{s.tactiek}</td>
                <td>{s.techniek_basis}</td>
                <td>{s.proactief}</td>
                <td>{s.techniek_hoog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Aankomende trainingen */}
      <h3>Aankomende trainingen</h3>
      {trainings.length === 0 ? (
        <p>Geen trainingen gepland.</p>
      ) : (
        <ul className="training-list">
          {trainings.map((t) => (
            <li key={t.id}>
              {t.label} – {t.date ? new Date(t.date).toLocaleDateString() : 'datum onbekend'}
            </li>
          ))}
        </ul>
      )}

      <Link to="/players">← Terug naar spelerslijst</Link>
    </div>
  );
}



