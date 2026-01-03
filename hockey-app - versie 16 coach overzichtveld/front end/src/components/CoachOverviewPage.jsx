import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CoachOverviewPage() {
  const [absences, setAbsences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [playerFilter, setPlayerFilter] = useState("");
  const [trainingFilter, setTrainingFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");

  // Sortering
  const [sortField, setSortField] = useState("training_date");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    async function fetchAbsences() {
      try {
        const res = await fetch("http://localhost:4000/absences/all");
        const data = await res.json();
        setAbsences(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fout bij ophalen coach overzicht:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAbsences();
  }, []);

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

  // CSV export
  function exportCSV() {
    const header = "Speler,Training,Datum,Reden\n";
    const rows = filtered
      .map(a =>
        `${a.player_name},${a.training_label},${new Date(a.training_date).toLocaleDateString()},${a.reason || "Geen reden"}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "coach_overzicht.csv";
    a.click();
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

        <button onClick={exportCSV}>📥 Exporteer CSV</button>
      </div>

      {/* Tabel */}
      {filtered.length === 0 ? (
        <p>Geen resultaten.</p>
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
                <td>
                  <span className={`reason-badge reason-${(a.reason || "geen").toLowerCase()}`}>
                    {a.reason || "Geen reden"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/players">← Terug naar spelerslijst</Link>
    </div>
  );
}



