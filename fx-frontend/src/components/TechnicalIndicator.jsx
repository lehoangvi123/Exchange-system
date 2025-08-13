import React, { useEffect, useState } from 'react';

const TechnicalIndicators = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState({});

  // Major currencies to analyze
  const MAJOR_CURRENCIES = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

  // Hàm định dạng số an toàn
  function formatNumber(val, digits = 2) {
    return typeof val === 'number' ? val.toFixed(digits) : 'N/A';
  }

  // Calculate Simple Moving Average
  const calculateSMA = (prices, period = 14) => {
    if (prices.length < period) return null;
    const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
    return sum / period;
  };

  // Calculate Exponential Moving Average
  const calculateEMA = (prices, period = 14) => {
    if (prices.length < period) return null;
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((acc, price) => acc + price, 0) / period;
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  };

  // Calculate RSI
  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return null;
    
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);
    
    const avgGain = gains.slice(-period).reduce((acc, gain) => acc + gain, 0) / period;
    const avgLoss = losses.slice(-period).reduce((acc, loss) => acc + loss, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // Generate mock historical data for demonstration
  const generateMockHistoricalData = (currentRate, days = 30) => {
    const prices = [];
    let price = currentRate;
    
    for (let i = 0; i < days; i++) {
      // Add some random variation (±2%)
      const variation = (Math.random() - 0.5) * 0.04;
      price = price * (1 + variation);
      prices.push(price);
    }
    
    return prices;
  };

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      // Filter to major currencies and calculate indicators
      const indicators = {};
      const historical = {};
      
      MAJOR_CURRENCIES.forEach(currency => {
        if (apiData.rates[currency]) {
          const currentRate = apiData.rates[currency];
          
          // Generate mock historical data for calculations
          const prices = generateMockHistoricalData(currentRate, 30);
          historical[currency] = prices;
          
          // Calculate technical indicators
          indicators[currency] = {
            sma: calculateSMA(prices, 14),
            ema: calculateEMA(prices, 14),
            rsi: calculateRSI(prices, 14)
          };
        }
      });
      
      setData(indicators);
      setHistoricalData(historical);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(`Failed to fetch rates: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchExchangeRates, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Lọc ra các dòng có ít nhất một chỉ số hợp lệ
  const filteredEntries = Object.entries(data).filter(([_, indicators]) =>
    typeof indicators.sma === 'number' ||
    typeof indicators.ema === 'number' ||
    typeof indicators.rsi === 'number'
  );

  // Determine RSI signal
  const getRSISignal = (rsi) => {
    if (typeof rsi !== 'number') return '';
    if (rsi > 70) return '🔴 Overbought';
    if (rsi < 30) return '🟢 Oversold';
    return '🟡 Neutral';
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '20px',
    maxWidth: '1000px',
    margin: '20px auto',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  };

  const theoryStyle = {
    marginBottom: '20px',
    background: '#f0f8ff',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #b6d8f2'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const headerStyle = {
    backgroundColor: '#2166f3',
    color: 'white',
    padding: '12px 8px',
    textAlign: 'center',
    fontWeight: 'bold'
  };

  const cellStyle = {
    padding: '10px 8px',
    textAlign: 'center',
    borderBottom: '1px solid #eee'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: '#0f172a', textAlign: 'center' }}>
          📊 <strong>Technical Indicators</strong>
        </h2>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f0f8ff',
          borderRadius: '10px'
        }}>
          <strong>⏳ Loading technical indicators...</strong>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: '#0f172a', textAlign: 'center' }}>
          📊 <strong>Technical Indicators</strong>
        </h2>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: '#fff3cd',
          borderRadius: '10px',
          border: '1px solid #ffeeba',
          color: '#856404'
        }}>
          <strong>❌ Error: {error}</strong>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#0f172a', textAlign: 'center', marginBottom: '30px' }}>
        📊 <strong>Technical Indicators</strong>
      </h2>

      {/* 🔍 Giải thích công thức các chỉ báo */}
      <div style={theoryStyle}>
        <h4 style={{ color: '#0369a1', marginBottom: '15px' }}>📘 Giải thích và Công thức:</h4>
        <ul style={{ lineHeight: '1.6', color: '#374151' }}>
          <li>
            <strong>SMA (Simple Moving Average):</strong>
            <div style={{ marginTop: '5px', fontStyle: 'italic', fontFamily: 'monospace' }}>
              SMA = (P₁ + P₂ + ... + Pₙ) / n
            </div>
            <div style={{ color: '#059669' }}>👉 Trung bình cộng của <strong>n</strong> tỷ giá gần nhất (14 periods).</div>
          </li>
          <br />
          <li>
            <strong>EMA (Exponential Moving Average):</strong>
            <div style={{ marginTop: '5px', fontStyle: 'italic', fontFamily: 'monospace' }}>
              EMA<sub>t</sub> = α × P<sub>t</sub> + (1 - α) × EMA<sub>t−1</sub>
            </div>
            <div style={{ color: '#059669' }}>👉 Với hệ số <strong>α = 2 / (n + 1)</strong>. EMA nhấn mạnh các giá trị gần hiện tại hơn.</div>
          </li>
          <br />
          <li>
            <strong>RSI (Relative Strength Index):</strong>
            <div style={{ marginTop: '5px', fontStyle: 'italic', fontFamily: 'monospace' }}>
              RSI = 100 - 100 / (1 + RS)<br />
              RS = (Average Gain) / (Average Loss)
            </div>
            <div style={{ color: '#059669' }}>👉 Chỉ số động lượng. RSI cao (&gt; 70) là <strong>quá mua</strong>, thấp (&lt; 30) là <strong>quá bán</strong>.</div>
          </li>
        </ul>
      </div>

      {/* Data Source Info */}
      <div style={{
        background: '#d1ecf1',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#0c5460'
      }}>
        <strong>📡 Data Source:</strong> Real-time rates from exchangerate-api.com
        <br />
        <strong>📊 Calculation:</strong> Based on simulated 30-day historical data with current rates
        <br />
        <strong>🔄 Updates:</strong> Auto-refresh every 5 minutes
      </div>

      {/* Bảng hiển thị chỉ báo */}
      {filteredEntries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f9fafb',
          borderRadius: '10px',
          color: '#6b7280'
        }}>
          <p>Không có dữ liệu chỉ số kỹ thuật hợp lệ để hiển thị.</p>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Currency</th>
              <th style={headerStyle}>SMA (14)</th>
              <th style={headerStyle}>EMA (14)</th>
              <th style={headerStyle}>RSI (14)</th>
              <th style={headerStyle}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(([currency, indicators], index) => (
              <tr 
                key={currency} 
                style={{ 
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#e6f3ff'}
                onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff'}
              >
                <td style={{...cellStyle, fontWeight: 'bold', color: '#1f2937'}}>{currency}</td>
                <td style={cellStyle}>{formatNumber(indicators.sma, 4)}</td>
                <td style={cellStyle}>{formatNumber(indicators.ema, 4)}</td>
                <td style={{...cellStyle, fontWeight: 'bold'}}>
                  {formatNumber(indicators.rsi, 2)}
                </td>
                <td style={{...cellStyle, fontSize: '12px'}}>
                  {getRSISignal(indicators.rsi)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={fetchExchangeRates}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#9ca3af' : '#2166f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = '#2166f3';
          }}
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default TechnicalIndicators;