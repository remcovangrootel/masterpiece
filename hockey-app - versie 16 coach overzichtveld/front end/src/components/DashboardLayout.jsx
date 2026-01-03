import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#2b8a3e',
        color: 'white',
        padding: 20,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ marginBottom: 20 }}>Hockey Dashboard</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Start</Link>
          <Link to="/players" style={{ color: 'white', textDecoration: 'none' }}>👥 Spelers</Link>
          <Link to="/trainings" style={{ color: 'white', textDecoration: 'none' }}>📅 Trainingen</Link>
          <Link to="/scores" style={{ color: 'white', textDecoration: 'none' }}>📊 Scores</Link>
          <Link to="/overview" style={{ color: 'white', textDecoration: 'none' }}>📈 Overzicht</Link>
          <Link to="/coach" style={{ color: 'white', textDecoration: 'none' }}>
  🧑‍🏫 Coach overzicht
</Link>


        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#f8f9fa', padding: 30 }}>
        <Outlet />
      </main>
    </div>
  );
}
