import React, { useEffect, useState } from 'react';
import { getTrainings } from '../api.js';
import TrainingForm from './TrainingForm.jsx';
import TrainingList from './TrainingList.jsx';

export default function TrainingPage() {
  const [trainings, setTrainings] = useState([]);
  const refreshTrainings = () => getTrainings().then(setTrainings);

  useEffect(() => { refreshTrainings(); }, []);

  return (
    <div>
      <h2>Trainingskaart</h2>
      <TrainingForm onAdded={refreshTrainings} />
      <TrainingList trainings={trainings} onDeleted={refreshTrainings} />
    </div>
  );
}
