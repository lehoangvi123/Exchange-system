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
    <div style={{
      maxWidth: '550px',
      margin: '40px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🌐 Cross Rate Converter</h2>

      <p style={{ fontSize: '14px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
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
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />

      <input
        type="text"
        placeholder="Quote currency (e.g. JPY)"
        value={quote}
        onChange={(e) => setQuote(e.target.value.toUpperCase())}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />

      <input
        type="text"
        placeholder="Via currency (e.g. USD)"
        value={via}
        onChange={(e) => setVia(e.target.value.toUpperCase())}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />

      <button
        onClick={handleConvert}
        style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Convert
      </button>

      {rate !== null && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>
          <h3>💱 Cross Rate Result</h3>
          <p>{base}/{quote} via {via} = <strong>{rate.toFixed(6)}</strong></p>
          <p>Converted Amount: <strong>{result.toFixed(2)}</strong> {quote}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', textAlign: 'center', color: 'red' }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}
