import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardLayout from './components/DashboardLayout.jsx';
import Home from './components/Home.jsx';
import PlayerPage from './components/PlayerPage.jsx';
import PlayerDetailPage from './components/PlayerDetailPage.jsx';
import TrainingPage from './components/TrainingPage.jsx';
import ScorePage from './components/ScorePage.jsx';
import OverviewPage from './components/OverviewPage.jsx';

import LoginModal from './components/LoginModal.jsx';
import { useAuth } from './AuthContext.jsx';
import CoachOverviewPage from "./components/CoachOverviewPage.jsx";

import './styles.css';

export default function App() {
  const { user, token } = useAuth();

  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);

  // Loginmodal moet automatisch openstaan als user niet ingelogd is
  const showLogin = !user;

  // 🔐 Helper: fetch met token
  async function apiFetch(url, options = {}) {
    const headers = options.headers || {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  }

  // ✅ Spelers ophalen bij start (alleen als ingelogd)
  useEffect(() => {
    if (!token) return;

    async function fetchPlayers() {
      try {
        const res = await apiFetch('http://localhost:4000/players');
        if (res.ok) {
          setPlayers(await res.json());
        }
      } catch (err) {
        console.error('Fout bij ophalen spelers:', err);
      }
    }

    fetchPlayers();
  }, [token]);

  // CRUD functies blijven hetzelfde…

  async function handleAddPlayer(newPlayer) {
    try {
      const res = await apiFetch('http://localhost:4000/players', {
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

  async function handleUpdatePlayer(updatedPlayer) {
    try {
      const res = await apiFetch(`http://localhost:4000/players/${updatedPlayer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlayer)
      });

      if (res.ok) {
        const saved = await res.json();
        setPlayers(players.map(p => p.id === saved.id ? saved : p));
        setEditingPlayer(null);
      } else {
        const err = await res.json();
        alert('Bijwerken mislukt: ' + err.error);
      }
    } catch (err) {
      console.error('Fout bij bijwerken speler:', err);
    }
  }

  async function handleDeletePlayer(id) {
    try {
      const res = await apiFetch(`http://localhost:4000/players/${id}`, {
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

      {/* 🔐 Login popup opent automatisch als user niet ingelogd is */}
      <LoginModal isOpen={showLogin} onClose={() => {}} />

      {/* 🔒 Als niet ingelogd → NIETS tonen behalve modal */}
      {!user ? null : (
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />

            {(user.role === 'coach' || user.role === 'admin') && (
              <Route
                path="/players"
                element={
                  <PlayerPage
                    players={players}
                    onAdd={handleAddPlayer}
                    onUpdate={handleUpdatePlayer}
                    onDelete={handleDeletePlayer}
                    editingPlayer={editingPlayer}
                    setEditingPlayer={setEditingPlayer}
                  />
                }
              />
            )}

            <Route path="/players/:id" element={<PlayerDetailPage />} />
            <Route path="/trainings" element={<TrainingPage />} />
            <Route path="/scores" element={<ScorePage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/coach" element={<CoachOverviewPage />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}




















