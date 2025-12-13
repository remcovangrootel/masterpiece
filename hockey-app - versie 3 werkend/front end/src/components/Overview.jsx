import React from 'react';
import MetricChart from './MetricChart.jsx';

export default function Overview({ metric, onChangeMetric, data }) {
  const options = [
    { key: 'inzet', label: 'Inzet' },
    { key: 'conditie', label: 'Conditie' },
    { key: 'tactiek', label: 'Tactiek' },
    { key: 'techniek_basis', label: 'Techniek basis' },
    { key: 'proactief', label: 'Proactief' },
    { key: 'techniek_hoog', label: 'Techniek hoger niveau' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label>Metric: </label>
        <select value={metric} onChange={e => onChangeMetric(e.target.value)}>
          {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>
      <MetricChart data={data} metric={metric} />
    </div>
  );
}
