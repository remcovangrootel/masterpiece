import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayerScores, getTrainings, deleteTraining } from '../api.js';

export default function PlayerDetailPage() {
  const { id } = useParams();
  const [scores, setScores] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    // scores van speler ophalen
    getPlayerScores(id).then(setScores);

    // alle trainingen ophalen en filteren op toekomst
    getTrainings().then(data => {
      const upcoming = data.filter(t => new Date(t.date) > new Date());
      setTrainings(upcoming);
    });
  }, [id]);

  const handleUnsubscribe = async (trainingId) => {
    if (window.confirm('Wil je je echt afmelden voor deze training?')) {
      try {
        await deleteTraining(trainingId); // of een aparte API call zoals "unsubscribe"
        setTrainings(trainings.filter(t => t.id !== trainingId));
      } catch (err) {
        console.error(err);
        alert('Afmelden mislukt');
      }
    }
  };

  return (
    <div>
      <h2>Spelerkaart #{id}</h2>

      {/* Scores */}
      <section style={{ marginBottom: '20px' }}>
        <h3>Scores</h3>
        {scores.length === 0 ? (
          <p>Geen scores gevonden.</p>
        ) : (
          <ul>
            {scores.map(s => (
              <li key={s.id}>
                Training {s.training_id}: {s.value}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Toekomstige trainingen */}
      <section>
        <h3>Toekomstige trainingen</h3>
        {trainings.length === 0 ? (
          <p>Geen toekomstige trainingen.</p>
        ) : (
          <ul>
            {trainings.map(t => (
              <li key={t.id}>
                {t.label} – {new Date(t.date).toLocaleDateString()}
                <button
                  onClick={() => handleUnsubscribe(t.id)}
                  style={{
                    marginLeft: '10px',
                    padding: '4px 8px',
                    background: '#d9534f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Afmelden
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
