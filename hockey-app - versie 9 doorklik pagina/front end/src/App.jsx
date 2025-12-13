import React from 'react';
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
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/players/:id" element={<PlayerDetailPage />} />
          <Route path="/trainings" element={<TrainingPage />} />
          <Route path="/scores" element={<ScorePage />} />
          <Route path="/overview" element={<OverviewPage />} />
        </Route>
      </Routes>
    </Router>
  );
}





