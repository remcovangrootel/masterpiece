import React, { useEffect, useState } from 'react';
import { getPlayers, getTrainings } from '../api.js';
import ScoreEntry from './ScoreEntry.jsx';

export default function ScorePage() {
  const [players, setPlayers] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
    getTrainings().then(setTrainings);
  }, []);

  return (
    <div>
      <h2>Scorekaart</h2>
      <ScoreEntry players={players} trainings={trainings} />
    </div>
  );
}
