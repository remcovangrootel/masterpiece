import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

export default function PlayerDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const [player, setPlayer] = useState(location.state?.player || null);
  const [scores, setScores] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [absences, setAbsences] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!player) {
          const resPlayer = await fetch(`http://localhost:4000/players/${id}`);
          if (resPlayer.ok) setPlayer(await resPlayer.json());
        }

        const resScores = await fetch(`http://localhost:4000/players/${id}/scores`);
        if (resScores.ok) {
          const data = await resScores.json();
          setScores(Array.isArray(data) ? data : []);
        }

        const resTrainings = await fetch(`http://localhost:4000/players/${id}/trainings`);
        if (resTrainings.ok) {
          const data = await resTrainings.json();
          setTrainings(Array.isArray(data) ? data : []);
        }

        const resAbs = await fetch(`http://localhost:4000/absences/player/${id}`);
        if (resAbs.ok) {
          const data = await resAbs.json();
          setAbsences(Array.isArray(data) ? data : []);
        } else {
          setAbsences([]);
        }

      } catch (err) {
        console.error("Fout bij ophalen data:", err);
        setAbsences([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // 🔥 Afmelden
  const handleAbsence = async (trainingId) => {
    const reason = prompt("Waarom meld je je af? (optioneel)");

    const res = await fetch("http://localhost:4000/absences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_id: id,
        training_id: trainingId,
        reason: reason || null
      })
    });

    if (res.ok) {
      const updated = await fetch(`http://localhost:4000/absences/player/${id}`);
      const data = await updated.json();
      setAbsences(Array.isArray(data) ? data : []);
    } else {
      alert("Afmelden mislukt (misschien al afgemeld?)");
    }
  };

  // 🔥 Ongedaan maken
  const undoAbsence = async (trainingId) => {
    const res = await fetch(`http://localhost:4000/absences/${id}/${trainingId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      const updated = await fetch(`http://localhost:4000/absences/player/${id}`);
      const data = await updated.json();
      setAbsences(Array.isArray(data) ? data : []);
    } else {
      alert("Ongedaan maken mislukt.");
    }
  };

  if (loading) return <p>Gegevens worden geladen...</p>;
  if (!player) return <p>Speler niet gevonden.</p>;

  return (
    <div className="player-detail">
      <h2>{player.name}</h2>
      <p>Leeftijd: {player.age ?? "onbekend"}</p>
      <p>Positie: {player.position ?? "onbekend"}</p>

      {player.photo_url && (
        <img src={player.photo_url} alt={player.name} className="player-photo-large" />
      )}

      {/* Scores */}
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
                <td>{s.date ? new Date(s.date).toLocaleDateString() : "onbekend"}</td>
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

      {/* Trainingen */}
      <h3>Aankomende trainingen</h3>
      {trainings.length === 0 ? (
        <p>Geen trainingen gepland.</p>
      ) : (
        <ul className="training-list">
          {trainings.map((t) => {
            const absence = absences.find(a => a.training_id === t.id);
            const isAbsent = Boolean(absence);

            return (
              <li key={t.id} style={{ marginBottom: "10px" }}>
                <strong>{t.label}</strong> –{" "}
                {t.date ? new Date(t.date).toLocaleDateString() : "datum onbekend"}

                {isAbsent ? (
                  <span style={{ marginLeft: 10, color: "red" }}>
                    (Afgemeld
                    {absence?.reason ? ` – reden: ${absence.reason}` : ""}
                    )
                    <button
                      style={{ marginLeft: 10 }}
                      onClick={() => undoAbsence(t.id)}
                    >
                      Ongedaan maken
                    </button>
                  </span>
                ) : (
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => handleAbsence(t.id)}
                  >
                    Afmelden
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Link to="/players">← Terug naar spelerslijst</Link>
    </div>
  );
}








