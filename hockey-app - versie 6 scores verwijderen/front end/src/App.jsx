import React, { useEffect, useState } from 'react';
import { getPlayers, getTrainings, getOverview } from './api.js';
import PlayerForm from './components/PlayerForm.jsx';
import PlayerList from './components/PlayerList.jsx';
import TrainingForm from './components/TrainingForm.jsx';
import TrainingSelector from './components/TrainingSelector.jsx';
import TrainingList from './components/TrainingList.jsx';
import ScoreEntry from './components/ScoreEntry.jsx';
import Overview from './components/Overview.jsx';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [metric, setMetric] = useState('inzet');
  const [overviewData, setOverviewData] = useState([]);

  const refreshPlayers = () => getPlayers().then(setPlayers);
  const refreshTrainings = () => getTrainings().then(setTrainings);
  const refreshOverview = () => getOverview(metric).then(setOverviewData);

  useEffect(() => {
    refreshPlayers();
    refreshTrainings();
  }, []);

  useEffect(() => {
    refreshOverview();
  }, [metric]);

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Hockey Team Scoring</h1>

      {/* Spelerbeheer */}
      <section>
        <h2>Spelerbeheer</h2>
        <PlayerForm onAdded={refreshPlayers} />
        <PlayerList players={players} onDeleted={refreshPlayers} />
      </section>

      {/* Trainingenbeheer */}
      <section>
        <h2>Trainingen</h2>
        <TrainingForm onAdded={refreshTrainings} />
        <TrainingSelector trainings={trainings} onAdded={refreshTrainings} />
        <TrainingList trainings={trainings} onDeleted={refreshTrainings} />
      </section>

      {/* Scores invoeren */}
      <section>
        <h2>Scores invoeren</h2>
        <ScoreEntry players={players} trainings={trainings} />
      </section>

      {/* Teamoverzicht */}
      <section>
        <h2>Teamoverzicht per metric</h2>
        <Overview metric={metric} onChangeMetric={setMetric} data={overviewData} />
      </section>
    </div>
  );
}


