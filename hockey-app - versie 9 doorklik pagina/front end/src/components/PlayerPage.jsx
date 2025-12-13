import React, { useEffect, useState } from 'react';
import { getPlayers } from '../api.js';
import PlayerForm from './PlayerForm.jsx';
import PlayerList from './PlayerList.jsx';

export default function PlayerPage() {
  const [players, setPlayers] = useState([]);
  const refreshPlayers = () => getPlayers().then(setPlayers);

  useEffect(() => { refreshPlayers(); }, []);

  return (
    <div>
      <h2>Spelerskaart</h2>
      <PlayerForm onAdded={refreshPlayers} />
      <PlayerList players={players} onDeleted={refreshPlayers} />
    </div>
  );
}
