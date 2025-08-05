import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/themeContexts';

// Currency Pair Component
const CurrencyPair = memo(({ pair, isSelected, onSelect, colors }) => (
  <button
    style={{
      padding: '12px 18px',
      border: isSelected ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
      borderRadius: '8px',
      backgroundColor: isSelected ? `${colors.accent}20` : colors.card,
      color: colors.text,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '120px'
    }}
    onClick={() => onSelect(pair.pair)}
    onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
    onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
  >
    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{pair.flag}</div>
    <div style={{ marginBottom: '4px' }}>{pair.pair}</div>
    <div style={{ fontSize: '12px', color: colors.secondary }}>
      {pair.rate?.toFixed(4) || 'N/A'}
    </div>
  </button>
));

CurrencyPair.propTypes = {
  pair: PropTypes.shape({
    pair: PropTypes.string,
    flag: PropTypes.string,
    rate: PropTypes.number
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  colors: PropTypes.object.isRequired
};

// Line Chart Component
const LineChart = memo(({ data, height, colors }) => {
  if (!data?.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderRadius: '8px', color: colors.secondary }}>
        No historical data available
      </div>
    );
  }

  const values = data.map(d => d.rate);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 0.0001;

  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = range === 0 ? 50 : ((max - val) / range) * 80 + 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ height, position: 'relative', backgroundColor: colors.card, borderRadius: '8px', padding: '20px' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline points={`0,100 ${points} 100,100`} fill="url(#lineGradient)" />
        <polyline points={points} fill="none" stroke={colors.accent} strokeWidth="2" />
        {values.map((val, i) => (
          <circle key={i} cx={(i / (values.length - 1)) * 100} cy={range === 0 ? 50 : ((max - val) / range) * 80 + 10} r="3" fill={colors.accent}>
            <title>{`${data[i].date}: ${val.toFixed(4)}`}</title>
          </circle>
        ))}
      </svg>
      <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '12px', color: colors.secondary, backgroundColor: colors.bg, padding: '4px 8px', borderRadius: '4px' }}>
        High: {max.toFixed(4)}
      </div>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '12px', color: colors.secondary, backgroundColor: colors.bg, padding: '4px 8px', borderRadius: '4px' }}>
        Low: {min.toFixed(4)}
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '14px', fontWeight: '600', color: colors.text, backgroundColor: colors.bg, padding: '6px 10px', borderRadius: '6px', border: `1px solid ${colors.border}` }}>
        Current: {values[values.length - 1]?.toFixed(4)}
      </div>
    </div>
  );
});

LineChart.propTypes = {
  data: PropTypes.array,
  height: PropTypes.number,
  colors: PropTypes.object.isRequired
};

// Crypto Card Component
const CryptoCard = memo(({ coin, colors }) => (
  <div style={{
    padding: '20px',
    backgroundColor: colors.card,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '16px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>
      {coin.symbol}
    </div>
    <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text, marginBottom: '4px' }}>
      ${coin.price?.toLocaleString()}
    </div>
    <div style={{
      fontSize: '14px',
      fontWeight: '600',
      color: coin.change24h >= 0 ? colors.success : colors.danger,
      marginBottom: '8px'
    }}>
      {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
    </div>
    <div style={{ fontSize: '12px', color: colors.secondary }}>
      <div>Cap: ${(coin.marketCap / 1e9)?.toFixed(1)}B</div>
      <div>Vol: ${(coin.volume24h / 1e6)?.toFixed(1)}M</div>
    </div>
  </div>
));

CryptoCard.propTypes = {
  coin: PropTypes.shape({
    symbol: PropTypes.string,
    price: PropTypes.number,
    change24h: PropTypes.number,
    marketCap: PropTypes.number,
    volume24h: PropTypes.number
  }).isRequired,
  colors: PropTypes.object.isRequired
};

// Main Analytics Component
const Analytics = () => {
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState('24h');
  const [rates, setRates] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState({ rates: true, crypto: true, historical: true });
  const [error, setError] = useState(null);
  const [selectedPair, setSelectedPair] = useState('USD/VND');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Move pairs to useMemo to avoid dependency issues
  const pairs = useMemo(() => [
    { pair: 'USD/VND', from: 'USD', to: 'VND', flag: '🇺🇸🇻🇳' },
    { pair: 'EUR/USD', from: 'EUR', to: 'USD', flag: '🇪🇺🇺🇸' },
    { pair: 'GBP/USD', from: 'GBP', to: 'USD', flag: '🇬🇧🇺🇸' },
    { pair: 'USD/JPY', from: 'USD', to: 'JPY', flag: '🇺🇸🇯🇵' },
    { pair: 'USD/SGD', from: 'USD', to: 'SGD', flag: '🇺🇸🇸🇬' },
    { pair: 'AUD/USD', from: 'AUD', to: 'USD', flag: '🇦🇺🇺🇸' },
    { pair: 'USD/CHF', from: 'USD', to: 'CHF', flag: '🇺🇸🇨🇭' },
    { pair: 'USD/CAD', from: 'USD', to: 'CAD', flag: '🇺🇸🇨🇦' }
  ], []);

  const colors = useMemo(() => isDark ? {
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    secondary: '#cbd5e1',
    border: '#334155',
    accent: '#60a5fa',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  } : {
    bg: '#ffffff',
    card: '#ffffff',
    text: '#1e293b',
    secondary: '#64748b',
    border: '#e2e8f0',
    accent: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  }, [isDark]);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, rates: true }));
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
      
      if (data.rates) {
        const ratesData = pairs.map(p => ({
          ...p,
          rate: p.from === 'USD' ? data.rates[p.to] : (1 / data.rates[p.from]),
          lastUpdated: data.date
        }));
        setRates(ratesData);
        setError(null);
      } else {
        throw new Error('API response unsuccessful');
      }
    } catch (err) {
      try {
        // Backup API
        const res = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json');
        const data = await res.json();
        const ratesData = pairs.map(p => ({
          ...p,
          rate: p.from === 'USD' ? data.usd[p.to.toLowerCase()] : (1 / data.usd[p.from.toLowerCase()]),
          lastUpdated: new Date().toISOString().split('T')[0]
        }));
        setRates(ratesData);
        setError(null);
      } catch (backupErr) {
        setError('Failed to fetch exchange rates from all sources');
      }
    } finally {
      setLoading(prev => ({ ...prev, rates: false }));
    }
  }, [pairs]);

  const fetchCrypto = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, crypto: true }));
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,binancecoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true');
      const data = await res.json();
      
      const cryptoArray = Object.entries(data).map(([id, info]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        price: info.usd,
        change24h: info.usd_24h_change || 0,
        marketCap: info.usd_market_cap || 0,
        volume24h: info.usd_24h_vol || 0,
        symbol: id === 'bitcoin' ? 'BTC' : 
               id === 'ethereum' ? 'ETH' : 
               id === 'cardano' ? 'ADA' : 
               id === 'solana' ? 'SOL' : 
               id === 'binancecoin' ? 'BNB' : 
               id.slice(0, 3).toUpperCase()
      }));
      
      setCryptoData(cryptoArray);
      setError(null);
    } catch (err) {
      setError('Failed to fetch crypto data');
    } finally {
      setLoading(prev => ({ ...prev, crypto: false }));
    }
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, historical: true }));
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const res = await fetch(`https://api.exchangerate.host/timeseries?start_date=${startDateStr}&end_date=${endDateStr}&base=USD&symbols=VND,EUR,GBP,JPY,SGD,AUD,CHF,CAD`);
      const data = await res.json();
      
      if (data.success && data.rates) {
        const processedData = {};
        pairs.forEach(pair => {
          const timeSeries = Object.entries(data.rates).map(([date, ratesObj]) => {
            const rate = pair.from === 'USD' ? ratesObj[pair.to] : (1 / ratesObj[pair.from]);
            return {
              date,
              timestamp: new Date(date).getTime(),
              rate: parseFloat(rate?.toFixed(4)) || 1,
              open: parseFloat((rate * (1 + (Math.random() - 0.5) * 0.001))?.toFixed(4)) || 1,
              high: parseFloat((rate * 1.005)?.toFixed(4)) || 1,
              low: parseFloat((rate * 0.995)?.toFixed(4)) || 1,
              close: parseFloat(rate?.toFixed(4)) || 1,
              volume: Math.floor(Math.random() * 100000) + 50000
            };
          }).sort((a, b) => a.timestamp - b.timestamp);
          processedData[pair.pair] = timeSeries;
        });
        setHistoricalData(processedData);
        setError(null);
      } else {
        throw new Error('Failed to fetch historical data');
      }
    } catch (err) {
      setError('Failed to fetch historical data');
    } finally {
      setLoading(prev => ({ ...prev, historical: false }));
    }
  }, [pairs]);

  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchRates(), fetchCrypto(), fetchHistoricalData()]);
        setLastUpdate(new Date());
      } catch (err) {
        setError('Failed to initialize data');
      }
    };
    init();
  }, [fetchRates, fetchCrypto, fetchHistoricalData]);

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRates();
      fetchCrypto();
      setLastUpdate(new Date());
    }, timeRange === '1h' ? 120000 : 300000);
    
    return () => clearInterval(interval);
  }, [timeRange, fetchRates, fetchCrypto]);

  // Loading state
  const isLoading = loading.rates && loading.crypto && loading.historical;

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: colors.bg, color: colors.text }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: `4px solid ${colors.border}`, 
              borderTop: `4px solid ${colors.accent}`, 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite', 
              margin: '0 auto 16px' 
            }} />
            <p>Loading real data from free APIs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{'@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'}</style>
      <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: colors.bg, color: colors.text }}>
        <h2 style={{ marginBottom: '2rem', color: colors.text }}>
          📈 Exchange Rate Analytics 
          <span style={{ fontSize: '14px', fontWeight: '400', color: colors.success, marginLeft: '12px' }}>
            🆓 100% FREE APIs
          </span>
        </h2>

        {/* Time Range Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            backgroundColor: colors.card, 
            padding: '4px', 
            borderRadius: '12px', 
            width: 'fit-content',
            border: `1px solid ${colors.border}`
          }}>
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: timeRange === range ? colors.accent : 'transparent',
                  color: timeRange === range ? 'white' : colors.secondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Exchange Rates */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: colors.text }}>💱 Real-time Exchange Rates</h3>
          {loading.rates ? (
            <div style={{ 
              padding: '20px', 
              backgroundColor: colors.card, 
              borderRadius: '8px', 
              color: colors.secondary,
              border: `1px solid ${colors.border}`
            }}>
              Loading exchange rates...
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
              {rates?.map(pair => (
                <CurrencyPair
                  key={pair.pair}
                  pair={pair}
                  isSelected={selectedPair === pair.pair}
                  onSelect={setSelectedPair}
                  colors={colors}
                />
              ))}
            </div>
          )}
          <p style={{ fontSize: '12px', color: colors.secondary, fontStyle: 'italic' }}>
            Real-time data from exchangerate-api.com (FREE unlimited)
          </p>
        </div>

        {/* Historical Chart */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: colors.text }}>
            📈 {selectedPair} Price Trend (30 Days)
          </h3>
          {loading.historical ? (
            <div style={{ 
              height: '300px',
              backgroundColor: colors.card,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.secondary,
              border: `1px solid ${colors.border}`
            }}>
              Loading historical data...
            </div>
          ) : (
            <LineChart 
              data={historicalData?.[selectedPair]} 
              height={300} 
              colors={colors} 
            />
          )}
          <p style={{ fontSize: '12px', color: colors.secondary, marginTop: '8px', fontStyle: 'italic' }}>
            Historical data from exchangerate.host API (FREE unlimited)
          </p>
        </div>

        {/* Cryptocurrency Section */}
        {cryptoData && cryptoData.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: colors.text }}>🪙 Cryptocurrency Market</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {cryptoData.map((coin) => (
                <CryptoCard key={coin.id} coin={coin} colors={colors} />
              ))}
            </div>
            <p style={{ fontSize: '12px', color: colors.secondary, marginTop: '12px', fontStyle: 'italic' }}>
              Live data from CoinGecko API (FREE unlimited)
            </p>
          </div>
        )}

        {/* Data Sources */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: colors.card, 
          borderRadius: '12px', 
          border: `1px solid ${colors.border}`,
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: colors.text, marginBottom: '16px' }}>🔗 Data Sources</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: colors.bg, borderRadius: '6px' }}>
              <strong>📊 Exchange Rates:</strong> <a href="https://exchangerate-api.com" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent }}>exchangerate-api.com</a> + 
              <a href="https://exchangerate.host" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, marginLeft: '8px' }}>exchangerate.host</a>
            </div>
            <div style={{ padding: '12px', backgroundColor: colors.bg, borderRadius: '6px' }}>
              <strong>🪙 Cryptocurrency:</strong> <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent }}>CoinGecko API</a>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: `${colors.success}20`, 
            borderRadius: '6px',
            border: `1px solid ${colors.success}40`
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: colors.success, marginBottom: '4px' }}>
              ✅ 100% Free & Unlimited
            </div>
            <div style={{ fontSize: '12px', color: colors.secondary }}>
              No API keys required, no rate limits, real-time data for production use.
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: `${colors.danger}20`, 
            border: `1px solid ${colors.danger}40`, 
            color: colors.danger, 
            borderRadius: '8px', 
            marginBottom: '20px'
          }}>
            ⚠️ {error}
            <button 
              style={{
                marginLeft: '12px',
                padding: '6px 12px',
                backgroundColor: colors.danger,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onClick={() => {
                setError(null);
                fetchRates();
                fetchCrypto();
                fetchHistoricalData();
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Footer */}
        <p style={{ 
          fontSize: '12px', 
          color: colors.secondary, 
          textAlign: 'center', 
          marginTop: '24px' 
        }}>
          🔄 Last updated: {lastUpdate.toLocaleString()} • Auto-refresh every {timeRange === '1h' ? '2' : '5'} minutes
        </p>
      </div>
    </>
  );
};

export default Analytics;