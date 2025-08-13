import React, { useEffect, useState, useRef } from 'react';
import '../css/ExchangeRate.css'
export default function ExchangeRateDisplay() {
  const [rates, setRates] = useState({});
  const [previousRates, setPreviousRates] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  // Threshold for anomaly detection (10% change)
  const ANOMALY_THRESHOLD = 0.10;

  // Major currencies to monitor
  const MAJOR_CURRENCIES = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NOK', 'KRW'];

  const fetchExchangeRates = async () => {
    try {
      setError(null);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter to only major currencies for cleaner display
      const filteredRates = {};
      MAJOR_CURRENCIES.forEach(currency => {
        if (data.rates[currency]) {
          filteredRates[currency] = data.rates[currency];
        }
      });
      
      // Check for anomalies if we have previous rates
      if (Object.keys(previousRates).length > 0) {
        detectAnomalies(filteredRates, previousRates);
      }
      
      // Update states
      setPreviousRates(rates);
      setRates(filteredRates);
      setLastUpdate(new Date());
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(`Failed to fetch rates: ${err.message}`);
      setLoading(false);
    }
  };

  const detectAnomalies = (newRates, oldRates) => {
    const detectedAnomalies = [];
    
    Object.keys(newRates).forEach(currency => {
      const oldRate = oldRates[currency];
      const newRate = newRates[currency];
      
      if (oldRate && newRate) {
        // Calculate percentage change: |newRate - oldRate| / oldRate
        const change = Math.abs(newRate - oldRate) / oldRate;
        const changePercent = (change * 100).toFixed(2);
        
        if (change > ANOMALY_THRESHOLD) {
          detectedAnomalies.push({
            currency,
            oldValue: oldRate.toFixed(4),
            newValue: newRate.toFixed(4),
            changePercent: changePercent,
            isIncrease: newRate > oldRate
          });
        }
      }
    });
    
    setAnomalies(detectedAnomalies);
    
    // Clear anomalies after 10 seconds for better UX
    if (detectedAnomalies.length > 0) {
      setTimeout(() => setAnomalies([]), 10000);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchExchangeRates();
    
    // Set up interval to fetch every 30 seconds
    intervalRef.current = setInterval(fetchExchangeRates, 30000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatRate = (rate) => {
    return typeof rate === 'number' ? rate.toFixed(4) : 'N/A';
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'white',
        maxWidth: '700px', 
        margin: '30px auto', 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <h2 style={{ textAlign: 'center', color: 'black'}}>💱 Defective Abnormal Exchange Rates</h2>
        <div style={{ 
          backgroundColor: '#e8f4fd',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <strong>⏳ Loading exchange rates...</strong>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: 'white',
        maxWidth: '700px', 
        margin: '30px auto', 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ textAlign: 'center', color: '#0f172a'}}>💱 Defective Abnormal Exchange Rates</h2>
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffeeba',
          color: '#856404'
        }}>
          <strong>❌ Error: {error}</strong>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'white',
      maxWidth: '700px', 
      margin: '30px auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2 style={{ textAlign: 'center', color: 'white'}}>💱 Defective Abnormal Exchange Rates</h2>

      {/* 🔍 Lý thuyết phát hiện tỷ giá bất thường */}
      <div style={{
        backgroundColor: '#e8f4fd',
        border: '1px solid #b6d8f2',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        lineHeight: '1.6',
      }}>
        <strong>💡 Lý thuyết phát hiện tỷ giá bất thường:</strong><br />
        1️⃣ Lưu tỷ giá trước đó (<code>oldRate</code>) và tỷ giá hiện tại (<code>newRate</code>)<br />
        2️⃣ Tính phần trăm thay đổi theo công thức:<br />
        <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
          change = |newRate - oldRate| / oldRate
        </code><br />
        3️⃣ Nếu <code>change &gt; threshold</code> (ví dụ <strong>10%</strong>), thì được xem là <strong>bất thường</strong>.<br />
        <em>Ví dụ:</em> oldRate = 10, newRate = 12 → change = (12 - 10)/10 = 0.2 = 20% → ⚠️ bất thường.
      </div>

      {/* Last Update Info */}
      {lastUpdate && (
        <div style={{
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          textAlign: 'center',
          color: '#0c5460'
        }}>
          <strong>🕒 Last Updated:</strong> {lastUpdate.toLocaleString()}
          <br />
          <em>Auto-refreshes every 30 seconds</em>
        </div>
      )}

      {/* ⚠️ Cảnh báo bất thường nếu có */}
      {anomalies.length > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffeeba'
        }}>
          <strong>⚠️ Cảnh báo tỷ giá bất thường:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {anomalies.map((a, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <strong>{a.currency}:</strong> {a.oldValue} → {a.newValue} 
                <span style={{ 
                  color: a.isIncrease ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {' '}({a.isIncrease ? '+' : '-'}{a.changePercent}%)
                </span>
              </li>
            ))}
          </ul>
          <div style={{ fontSize: '12px', color: '#856404', marginTop: '10px' }}>
            <em>* Anomalies auto-clear after 10 seconds</em>
          </div>
        </div>
      )}

      {/* Bảng tỷ giá */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ 
              borderBottom: '2px solid #007bff', 
              padding: '10px', 
              textAlign: 'left', 
              background: '#007bff', 
              color: 'white' 
            }}>
              Currency
            </th>
            <th style={{ 
              borderBottom: '2px solid #007bff', 
              padding: '10px', 
              textAlign: 'left', 
              background: '#007bff', 
              color: 'white' 
            }}>
              Rate (USD)
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rates).map(([code, value]) => (
            <tr key={code} style={{ 
              backgroundColor: anomalies.some(a => a.currency === code) ? '#fff3cd' : 'transparent'
            }}>
              <td style={{ 
                borderBottom: '1px solid #eee', 
                padding: '10px',
                fontWeight: anomalies.some(a => a.currency === code) ? 'bold' : 'normal'
              }}>
                {code}
                {anomalies.some(a => a.currency === code) && ' ⚠️'}
              </td>
              <td style={{ 
                borderBottom: '1px solid #eee', 
                padding: '10px',
                fontWeight: anomalies.some(a => a.currency === code) ? 'bold' : 'normal'
              }}>
                {formatRate(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Status Info */}
      <div style={{
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '20px',
        fontSize: '14px',
        color: '#155724'
      }}>
        <strong>📊 Status:</strong> Monitoring {Object.keys(rates).length} major currencies
        <br />
        <strong>🎯 Threshold:</strong> {(ANOMALY_THRESHOLD * 100)}% change detection
        <br />
        <strong>🔄 Refresh:</strong> Every 30 seconds automatically
        <br />
        <strong>📡 Source:</strong> exchangerate-api.com (Free API)
      </div>
    </div>
  );
}