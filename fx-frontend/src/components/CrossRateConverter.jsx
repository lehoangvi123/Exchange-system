import React, { useState } from 'react';

export default function CrossRateConverter() {
  const [base, setBase] = useState('EUR');
  const [quote, setQuote] = useState('JPY');
  const [via, setVia] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateCrossRate = async (fromCurrency, toCurrency, viaCurrency) => {
    try {
      // Fetch exchange rates from exchangerate-api.com
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${viaCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get rates for both currencies against the via currency
      const fromRate = data.rates[fromCurrency];
      const toRate = data.rates[toCurrency];
      
      if (!fromRate || !toRate) {
        throw new Error(`Currency not found: ${!fromRate ? fromCurrency : toCurrency}`);
      }
      
      // Cross rate formula: FROM/TO = (FROM/VIA) / (TO/VIA)
      // Since we have VIA/FROM and VIA/TO, we need: FROM/TO = (VIA/TO) / (VIA/FROM) = (1/TO) / (1/FROM) = FROM/TO
      const crossRate = fromRate / toRate;
      
      return crossRate;
    } catch (error) {
      console.error('Error calculating cross rate:', error);
      throw error;
    }
  };

  const handleConvert = async () => {
    if (!base || !quote || !via || amount <= 0) {
      setError('Please fill all fields with valid values');
      return;
    }

    if (base === quote) {
      setError('Base and quote currencies cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    setRate(null);
    setResult(null);

    try {
      // Use exchangerate-api.com for cross rate calculation
      const crossRate = await calculateCrossRate(base, quote, via);
      const convertedAmount = amount * crossRate;
      
      setRate(crossRate);
      setResult(convertedAmount);
      setError(null);
      
    } catch (err) {
      console.error('Conversion failed:', err.message);
      setError(`Conversion failed: ${err.message}`);
      setRate(null);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

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
      color: '#0f172a',
    },
    formula: {
      fontSize: '14px',
      backgroundColor: '#e0f2fe',
      color: '#0369a1',
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
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: loading ? '#94a3b8' : '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    buttonHover: {
      background: '#1d4ed8',
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    result: {
      marginTop: '24px',
      textAlign: 'center',
      color: '#16a34a',
      backgroundColor: '#dcfce7',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #bbf7d0',
    },
    error: {
      marginTop: '24px',
      textAlign: 'center',
      color: '#b91c1c',
      backgroundColor: '#fee2e2',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
    },
    warning: {
      marginTop: '24px',
      textAlign: 'center',
      color: '#d97706',
      backgroundColor: '#fef3c7',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #fde68a',
    }
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
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
        onChange={(e) => setBase(e.target.value.toUpperCase().substring(0, 3))}
        style={styles.input}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Quote currency (e.g. JPY)"
        value={quote}
        onChange={(e) => setQuote(e.target.value.toUpperCase().substring(0, 3))}
        style={styles.input}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Via currency (e.g. USD)"
        value={via}
        onChange={(e) => setVia(e.target.value.toUpperCase().substring(0, 3))}
        style={styles.input}
        disabled={loading}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={styles.input}
        disabled={loading}
        min="0"
        step="0.01"
      />

      <button 
        onClick={handleConvert} 
        style={styles.button}
        disabled={loading}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.background = '#1d4ed8';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.background = '#2563eb';
          }
        }}
      >
        {loading && <div style={styles.spinner}></div>}
        {loading ? 'Converting...' : 'Convert'}
      </button>

      {rate !== null && result !== null && (
        <div style={styles.result}>
          <h3>💱 Cross Rate Result</h3>
          <p>
            <strong>{base}/{quote}</strong> via {via} = <strong>{rate.toFixed(6)}</strong>
          </p>
          <p>
            Converted Amount: <strong>{result.toFixed(2)}</strong> {quote}
          </p>
          <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
            Formula: {amount} × {rate.toFixed(6)} = {result.toFixed(2)}
          </p>
        </div>
      )}

      {error && (
        <div style={error.includes('⚠️') ? styles.warning : styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}