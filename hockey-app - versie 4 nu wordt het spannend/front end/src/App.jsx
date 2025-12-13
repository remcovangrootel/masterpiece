import React, { useEffect, useState } from 'react';
import { getPlayers, getTrainings, getOverview } from './api.js';
import PlayerForm from './components/PlayerForm.jsx';
import PlayerList from './components/PlayerList.jsx';
import TrainingSelector from './components/TrainingSelector.jsx';
import ScoreEntry from './components/ScoreEntry.jsx';
import Overview from './components/Overview.jsx';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [metric, setMetric] = useState('inzet');
  const [overviewData, setOverviewData] = useState([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
    getTrainings().then(setTrainings);
  }, []);

  useEffect(() => {
    getOverview(metric).then(setOverviewData);
  }, [metric]);

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Hockey Team Scoring</h1>

      <section>
        <h2>Spelerbeheer</h2>
        <PlayerForm onAdded={() => getPlayers().then(setPlayers)} />
        <PlayerList players={players} />
      </section>



      <section>
        <h2>Scores invoeren</h2>
        <TrainingSelector trainings={trainings} />
        <ScoreEntry players={players} trainings={trainings} />
      </section>

      <section>
        <h2>Teamoverzicht per metric</h2>
        <Overview metric={metric} onChangeMetric={setMetric} data={overviewData} />
      </section>
    </div>
  );
}
