import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Startpagina Hockey Team App</h1>
      <p>Kies een kaart:</p>
      <ul>
        <li><Link to="/players">Spelerskaart</Link></li>
        <li><Link to="/trainings">Trainingskaart</Link></li>
        <li><Link to="/scores">Scorekaart</Link></li>
        <li><Link to="/overview">Overzichtkaart</Link></li>
      </ul>
    </div>
  );
}
