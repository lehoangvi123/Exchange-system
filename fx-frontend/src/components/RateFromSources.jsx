import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RatesFromSources() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rates/sources')
      .then(res => {
        if (res.data.success) {
          setSources(res.data.sources);
        }
      })
      .catch(err => {
        console.error('❌ Error fetching source rates:', err.message);
      });
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center' }}>📡 Raw Rates From All Providers</h2>
      {sources.map((src, idx) => (
        <div key={idx} style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '8px' }}>
          <h4>🌐 Provider: {src.provider}</h4>
          <ul style={{ columns: 2 }}>
            {Object.entries(src.rates).map(([currency, rate]) => (
              <li key={currency}>
                {currency}: <strong>{rate}</strong>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
