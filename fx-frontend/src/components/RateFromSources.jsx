import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RatesFromSources() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    axios.get('https://backend-1-8b9z.onrender.com/api/rates/sources')
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
    <div style={styles.container}>
      <h2 style={styles.title}>📡 Raw Rates From All Providers</h2>
      {sources.map((src, idx) => (
        <div key={idx} style={styles.card}>
          <h4 style={styles.provider}>🌐 Provider: {src.provider}</h4>
          <ul style={styles.rateList}>
            {Object.entries(src.rates).map(([currency, rate]) => (
              <li key={currency} style={styles.rateItem}>
                <span style={styles.currency}>{currency}:</span>
                <span style={styles.value}>{rate}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '26px',
    color: '#1a202c',
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  provider: {
    marginBottom: '16px',
    fontSize: '18px',
    color: '#2b6cb0',
  },
  rateList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  rateItem: {
    backgroundColor: '#edf2f7',
    padding: '10px 12px',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '14px',
  },
  currency: {
    fontWeight: '600',
    marginRight: '4px',
  },
  value: {
    color: '#4a5568',
  },
};
