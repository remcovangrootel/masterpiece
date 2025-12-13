import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

function PlayerForm({ onAdded }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  async function submit(e) {
    e.preventDefault();
    const { data } = await api.post("/players", {
      name,
      age: Number(age),
      position,
      photo_url: photoUrl || "https://picsum.photos/seed/fallback/200",
    });
    onAdded(data);
    setName(""); setAge(""); setPosition(""); setPhotoUrl("");
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Speler toevoegen</h3>
      <label>Naam</label>
      <input value={name} onChange={e=>setName(e.target.value)} required />
      <label>Leeftijd</label>
      <input type="number" value={age} onChange={e=>setAge(e.target.value)} required />
      <label>Positie</label>
      <select value={position} onChange={e=>setPosition(e.target.value)} required>
        <option value="">-- kies --</option>
        <option>Aanvaller</option>
        <option>Middenvelder</option>
        <option>Verdediger</option>
        <option>Keeper</option>
      </select>
      <label>Foto URL</label>
      <input value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} placeholder="https://..." />
      <button type="submit">Opslaan</button>
    </form>
  );
}

function PlayerList({ players }) {
  return (
    <div className="grid">
      {players.map(p => (
        <div key={p.id} className="card">
          <img src={p.photo_url} alt={p.name} className="avatar" />
          <h4>{p.name}</h4>
          <p><b>Leeftijd:</b> {p.age}</p>
          <p><b>Positie:</b> {p.position}</p>
        </div>
      ))}
    </div>
  );
}

function TrainingsList({ trainings }) {
  return (
    <div className="card">
      <h3>Trainingen</h3>
      <ul className="list">
        {trainings.map(t => (
          <li key={t.id}><b>Datum:</b> {t.date} — <b>Beschrijving:</b> {t.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [trainings, setTrainings] = useState([]);

  async function load() {
    const [p, t] = await Promise.all([api.get("/players"), api.get("/trainings")]);
    setPlayers(p.data);
    setTrainings(t.data);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <h2>Hockeycoach Dashboard</h2>

      <div className="layout">
        <PlayerForm onAdded={(p) => setPlayers(prev => [p, ...prev])} />
        <PlayerList players={players} />
      </div>

      <TrainingsList trainings={trainings} />
    </div>
  );
}

