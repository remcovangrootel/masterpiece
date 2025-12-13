import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home.jsx';
import PlayerPage from './components/PlayerPage.jsx';
import TrainingPage from './components/TrainingPage.jsx';
import ScorePage from './components/ScorePage.jsx';
import OverviewPage from './components/OverviewPage.jsx';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 10, background: '#2b8a3e' }}>
        <Link to="/" style={{ marginRight: 10, color: 'white' }}>Start</Link>
        <Link to="/players" style={{ marginRight: 10, color: 'white' }}>Spelers</Link>
        <Link to="/trainings" style={{ marginRight: 10, color: 'white' }}>Trainingen</Link>
        <Link to="/scores" style={{ marginRight: 10, color: 'white' }}>Scores</Link>
        <Link to="/overview" style={{ color: 'white' }}>Overzicht</Link>
      </nav>
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/trainings" element={<TrainingPage />} />
          <Route path="/scores" element={<ScorePage />} />
          <Route path="/overview" element={<OverviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}



