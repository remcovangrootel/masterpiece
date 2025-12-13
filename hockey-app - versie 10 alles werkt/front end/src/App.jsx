import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.jsx';
import Home from './components/Home.jsx';
import PlayerPage from './components/PlayerPage.jsx';
import PlayerDetailPage from './components/PlayerDetailPage.jsx';
import TrainingPage from './components/TrainingPage.jsx';
import ScorePage from './components/ScorePage.jsx';
import OverviewPage from './components/OverviewPage.jsx';
import './styles.css';

export default function App() {
  const [players, setPlayers] = useState([]);

  // ✅ Spelers ophalen bij start
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('http://localhost:4000/players');
        if (res.ok) {
          setPlayers(await res.json());
        }
      } catch (err) {
        console.error('Fout bij ophalen spelers:', err);
      }
    }
    fetchPlayers();
  }, []);

  // ✅ Speler toevoegen
  async function handleAddPlayer(newPlayer) {
    try {
      const res = await fetch('http://localhost:4000/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer)
      });
      if (res.ok) {
        const created = await res.json();
        setPlayers([...players, created]);
      } else {
        const err = await res.json();
        alert('Toevoegen mislukt: ' + err.error);
      }
    } catch (err) {
      console.error('Fout bij toevoegen speler:', err);
    }
  }

  // ✅ Speler verwijderen
  async function handleDeletePlayer(id) {
    try {
      const res = await fetch(`http://localhost:4000/players/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPlayers(players.filter(p => p.id !== id));
      } else {
        const err = await res.json();
        alert('Verwijderen mislukt: ' + err.error);
      }
    } catch (err) {
      console.error('Fout bij verwijderen speler:', err);
    }
  }

  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/players"
            element={
              <PlayerPage
                players={players}
                onAdd={handleAddPlayer}
                onDelete={handleDeletePlayer}
              />
            }
          />
          <Route path="/players/:id" element={<PlayerDetailPage />} />
          <Route path="/trainings" element={<TrainingPage />} />
          <Route path="/scores" element={<ScorePage />} />
          <Route path="/overview" element={<OverviewPage />} />
        </Route>
      </Routes>
    </Router>
  );
}









