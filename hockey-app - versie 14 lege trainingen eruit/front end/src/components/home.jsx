import React from 'react';

export default function Home() {
  return (
    <div style={{ textAlign: 'center' }}>
      {/* Logo */}
      <img 
        src="/images/hc-fontys-u17-logo.png" 
        alt="HC Fontys U17 Logo" 
        style={{ maxWidth: 300, marginBottom: 20 }}
      />

      {/* Welkomsttekst */}
      <h1>Welkom bij het Hockey Team Dashboard</h1>
      <p>Dit is het dashboard van de U17 jongens van HC Fontys.</p>
      <p>Gebruik het menu links om spelers, trainingen en scores te beheren.</p>
    </div>
  );
}


