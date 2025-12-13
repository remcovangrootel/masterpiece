import React, { useEffect, useState } from 'react';
import { getOverview } from '../api.js';
import Overview from './Overview.jsx';

export default function OverviewPage() {
  const [metric, setMetric] = useState('inzet');
  const [overviewData, setOverviewData] = useState([]);

  const refreshOverview = () => getOverview(metric).then(setOverviewData);

  useEffect(() => { refreshOverview(); }, [metric]);

  return (
    <div>
      <h2>Overzichtkaart</h2>
      <Overview metric={metric} onChangeMetric={setMetric} data={overviewData} />
    </div>
  );
}
