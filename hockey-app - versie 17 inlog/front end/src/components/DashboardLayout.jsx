import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#2b8a3e',
        color: 'white',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        
        {/* Bovenste deel */}
        <div>
          <h2 style={{ marginBottom: 20 }}>Hockey Dashboard</h2>

          {/* Gebruiker badge */}
          {user && (
            <div className="sidebar-user">
              <div className="user-badge">
                👤 {user.email}
                <span className="role-tag">{user.role}</span>
              </div>

              <button className="logout-btn" onClick={logout}>
                Uitloggen
              </button>
            </div>
          )}

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            <Link to="/" className="sidebar-link">🏠 Start</Link>
            <Link to="/players" className="sidebar-link">👥 Spelers</Link>
            <Link to="/trainings" className="sidebar-link">📅 Trainingen</Link>
            <Link to="/scores" className="sidebar-link">📊 Scores</Link>
            <Link to="/overview" className="sidebar-link">📈 Overzicht</Link>
            <Link to="/coach" className="sidebar-link">🧑‍🏫 Coach overzicht</Link>
          </nav>
        </div>

      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#f8f9fa', padding: 30 }}>
        <Outlet />
      </main>
    </div>
  );
}

