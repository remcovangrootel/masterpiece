import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CoachOverviewPage() {
  const [absences, setAbsences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [resetLink, setResetLink] = useState(null);
  const [resetPlayer, setResetPlayer] = useState(null);

  // Filters
  const [playerFilter, setPlayerFilter] = useState("");
  const [trainingFilter, setTrainingFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");

  // Sortering
  const [sortField, setSortField] = useState("training_date");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    async function fetchData() {
      try {
        // Afmeldingen
        const resAbs = await fetch("http://localhost:4000/absences/all");
        const dataAbs = await resAbs.json();
        setAbsences(Array.isArray(dataAbs) ? dataAbs : []);
        setFiltered(Array.isArray(dataAbs) ? dataAbs : []);

        // Alle spelers
        const resPlayers = await fetch("http://localhost:4000/players");
        const dataPlayers = await resPlayers.json();
        setPlayers(Array.isArray(dataPlayers) ? dataPlayers : []);

      } catch (err) {
        console.error("Fout bij ophalen coach overzicht:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Resetlink genereren
  async function generateResetLink(playerId, playerName) {
    try {
      const res = await fetch(`http://localhost:4000/players/${playerId}/reset-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.success) {
        setResetLink(data.resetLink);
        setResetPlayer(playerName);
      } else {
        alert("Kon geen resetlink maken");
      }
    } catch (err) {
      console.error("Fout bij resetlink genereren:", err);
      alert("Fout bij resetlink genereren");
    }
  }

  // Filterfunctie
  useEffect(() => {
    let result = [...absences];

    if (playerFilter) {
      result = result.filter(a =>
        a.player_name.toLowerCase().includes(playerFilter.toLowerCase())
      );
    }

    if (trainingFilter) {
      result = result.filter(a =>
        a.training_label.toLowerCase().includes(trainingFilter.toLowerCase())
      );
    }

    if (reasonFilter) {
      result = result.filter(a =>
        (a.reason || "geen").toLowerCase() === reasonFilter.toLowerCase()
      );
    }

    // Sorteren
    result.sort((a, b) => {
      let A = a[sortField];
      let B = b[sortField];

      if (sortField === "training_date") {
        A = new Date(A);
        B = new Date(B);
      }

      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(result);
  }, [playerFilter, trainingFilter, reasonFilter, sortField, sortDir, absences]);

  function toggleSort(field) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  if (loading) return <p>Gegevens worden geladen...</p>;

  return (
    <div>
      <h2>Coach overzicht – Afmeldingen</h2>

      {/* Filters */}
      <div className="filters">
        <input
          placeholder="Filter op speler"
          value={playerFilter}
          onChange={e => setPlayerFilter(e.target.value)}
        />
        <input
          placeholder="Filter op training"
          value={trainingFilter}
          onChange={e => setTrainingFilter(e.target.value)}
        />
        <select
          value={reasonFilter}
          onChange={e => setReasonFilter(e.target.value)}
        >
          <option value="">Alle redenen</option>
          <option value="ziek">Ziek</option>
          <option value="blessure">Blessure</option>
          <option value="privé">Privé</option>
          <option value="voetbal">Voetbal</option>
          <option value="school">School</option>
          <option value="geen">Geen reden</option>
        </select>
      </div>

      {/* Afmeldingen tabel */}
      {filtered.length === 0 ? (
        <p>Geen afmeldingen.</p>
      ) : (
        <table className="coach-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("player_name")}>Speler</th>
              <th onClick={() => toggleSort("training_label")}>Training</th>
              <th onClick={() => toggleSort("training_date")}>Datum</th>
              <th>Reden</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.player_name}</td>
                <td>{a.training_label}</td>
                <td>{new Date(a.training_date).toLocaleDateString()}</td>
                <td>{a.reason || "Geen reden"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Nieuwe sectie: ALLE SPELERS */}
      <h2 style={{ marginTop: "40px" }}>Alle spelers – Wachtwoord resetten</h2>

      <table className="coach-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Positie</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.position}</td>
              <td>
                <button
                  className="reset-btn"
                  onClick={() => generateResetLink(p.id, p.name)}
                >
                  🔑 Reset wachtwoord
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup met klikbare link */}
      {resetLink && (
        <div className="reset-modal">
          <div className="reset-modal-content">
            <h3>Resetlink voor {resetPlayer}</h3>

            <a
              href={resetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="reset-link"
            >
              Klik hier om wachtwoord te resetten
            </a>

            <button onClick={() => setResetLink(null)}>Sluiten</button>
          </div>
        </div>
      )}

      <Link to="/players">← Terug naar spelerslijst</Link>
    </div>
  );
}






