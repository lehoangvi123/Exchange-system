import React, { useState } from 'react';
import axios from 'axios';

export default function CrossRateConverter() {
  const [base, setBase] = useState('EUR');
  const [quote, setQuote] = useState('JPY');
  const [via, setVia] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/rates/convert-cross', {
        from: base,
        to: quote,
        via,
        amount
      });

      setRate(res.data.rate);
      setResult(res.data.result);
      setError(null);
    } catch (err) {
      setRate(null);
      setResult(null);
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌐 Cross Rate Converter</h2>

      <p style={styles.formula}>
        📌 <strong>Cross Rate Formula:</strong><br />
        <code>{base}/{via} = A</code><br />
        <code>{quote}/{via} = B</code><br />
        → <strong>{base}/{quote}</strong> = A / B
      </p>

      <input
        type="text"
        placeholder="Base currency (e.g. EUR)"
        value={base}
        onChange={(e) => setBase(e.target.value.toUpperCase())}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Quote currency (e.g. JPY)"
        value={quote}
        onChange={(e) => setQuote(e.target.value.toUpperCase())}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Via currency (e.g. USD)"
        value={via}
        onChange={(e) => setVia(e.target.value.toUpperCase())}
        style={styles.input}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={styles.input}
      />

      <button onClick={handleConvert} style={styles.button}>
        Convert
      </button>

      {rate !== null && (
        <div style={styles.result}>
          <h3>💱 Cross Rate Result</h3>
          <p>{base}/{quote} via {via} = <strong>{rate.toFixed(6)}</strong></p>
          <p>Converted Amount: <strong>{result.toFixed(2)}</strong> {quote}</p>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '550px',
    margin: '40px auto',
    padding: '24px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fafb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '22px',
    color: '#0f172a', // dark navy
  },
  formula: {
    fontSize: '14px',
    backgroundColor: '#e0f2fe', // light blue
    color: '#0369a1', // deep sky blue
    padding: '12px',
    borderRadius: '8px',
    lineHeight: '1.6',
    border: '1px solid #bae6fd',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#2563eb', // strong blue
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  result: {
    marginTop: '24px',
    textAlign: 'center',
    color: '#16a34a', // green-600
    backgroundColor: '#dcfce7',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  error: {
    marginTop: '24px',
    textAlign: 'center',
    color: '#b91c1c', // red-700
    backgroundColor: '#fee2e2',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
};
