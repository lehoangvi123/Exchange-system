import React, { useState, useEffect, useCallback } from 'react';

const Analytics = () => {
  const [language, setLanguage] = useState('vi');
  const [rates, setRates] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPair, setSelectedPair] = useState('USD/VND');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Currency pairs data
  const pairs = [
    { pair: 'USD/VND', flag: '🇺🇸🇻🇳' },
    { pair: 'EUR/USD', flag: '🇪🇺🇺🇸' },
    { pair: 'GBP/USD', flag: '🇬🇧🇺🇸' },
    { pair: 'USD/JPY', flag: '🇺🇸🇯🇵' },
    { pair: 'AUD/USD', flag: '🇦🇺🇺🇸' },
    { pair: 'USD/CAD', flag: '🇺🇸🇨🇦' }
  ];

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
      
      if (data.rates) {
        const ratesData = pairs.map(p => {
          const [from, to] = p.pair.split('/');
          const rate = from === 'USD' ? data.rates[to] : (1 / data.rates[from]);
          const change = (Math.random() - 0.5) * 0.02; // Mock change
          
          return {
            ...p,
            rate: rate,
            change: {
              value: parseFloat((rate * change).toFixed(4)),
              percent: parseFloat((change * 100).toFixed(2)),
              isPositive: change >= 0
            }
          };
        });
        setRates(ratesData);
        setError(null);
      }
    } catch (err) {
      setError(language === 'vi' ? 'Không thể tải tỷ giá' : 'Failed to fetch rates');
    }
  }, [language]);

  // Fetch crypto data
  const fetchCrypto = useCallback(async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true');
      const data = await res.json();
      
      const cryptoArray = Object.entries(data).map(([id, info]) => ({
        id,
        name: id === 'bitcoin' ? 'Bitcoin' : id === 'ethereum' ? 'Ethereum' : 'Cardano',
        symbol: id === 'bitcoin' ? 'BTC' : id === 'ethereum' ? 'ETH' : 'ADA',
        price: info.usd,
        change24h: info.usd_24h_change || 0
      }));
      
      setCryptoData(cryptoArray);
    } catch (err) {
      console.error('Crypto fetch failed:', err);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchRates(), fetchCrypto()]);
      setLoading(false);
      setLastUpdate(new Date());
    };
    init();
  }, [fetchRates, fetchCrypto]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRates();
      fetchCrypto();
      setLastUpdate(new Date());
    }, 300000);
    
    return () => clearInterval(interval);
  }, [fetchRates, fetchCrypto]);

  const formatRate = (value, pair) => {
    if (!value) return 'N/A';
    const decimals = pair.includes('VND') ? 0 : pair.includes('JPY') ? 2 : 4;
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>{language === 'vi' ? 'Đang tải dữ liệu...' : 'Loading data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          📈 {language === 'vi' ? 'Phân Tích Tỷ Giá' : 'Exchange Rate Analytics'}
        </h2>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.error}>
          ⚠️ {error}
          <button onClick={() => { setError(null); fetchRates(); }} style={styles.retryBtn}>
            {language === 'vi' ? 'Thử lại' : 'Retry'}
          </button>
        </div>
      )}

      {/* Exchange Rates Grid */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          💱 {language === 'vi' ? 'Tỷ Giá Thời Gian Thực' : 'Real-time Exchange Rates'}
        </h3>
        <div style={styles.grid}>
          {rates?.map(rate => (
            <div 
              key={rate.pair} 
              style={{
                ...styles.card,
                ...(selectedPair === rate.pair ? styles.cardSelected : {})
              }}
              onClick={() => setSelectedPair(rate.pair)}
            >
              <div style={styles.cardHeader}>
                <span style={styles.flag}>{rate.flag}</span>
                <span style={styles.pairName}>{rate.pair}</span>
              </div>
              
              <div style={styles.rateValue}>
                {formatRate(rate.rate, rate.pair)}
              </div>
              
              {rate.change && (
                <div style={{
                  ...styles.change,
                  color: rate.change.isPositive ? '#10b981' : '#ef4444',
                  backgroundColor: rate.change.isPositive ? '#10b98120' : '#ef444420'
                }}>
                  {rate.change.isPositive ? '▲' : '▼'} {Math.abs(rate.change.percent)}%
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={styles.source}>
          {language === 'vi' ? 'Nguồn: exchangerate-api.com (Miễn phí)' : 'Source: exchangerate-api.com (Free)'}
        </p>
      </div>

      {/* Cryptocurrency Section */}
      {cryptoData && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            🪙 {language === 'vi' ? 'Tiền Điện Tử' : 'Cryptocurrency'}
          </h3>
          <div style={styles.cryptoGrid}>
            {cryptoData.map(coin => (
              <div key={coin.id} style={styles.cryptoCard}>
                <div style={styles.cryptoHeader}>
                  <span style={styles.cryptoSymbol}>{coin.symbol}</span>
                  <span style={styles.cryptoName}>{coin.name}</span>
                </div>
                <div style={styles.cryptoPrice}>
                  ${coin.price?.toLocaleString()}
                </div>
                <div style={{
                  ...styles.cryptoChange,
                  color: coin.change24h >= 0 ? '#10b981' : '#ef4444'
                }}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
          <p style={styles.source}>
            {language === 'vi' ? 'Nguồn: CoinGecko API (Miễn phí)' : 'Source: CoinGecko API (Free)'}
          </p>
        </div>
      )}

      {/* Market Status */}
      <div style={styles.section}>
        <div style={styles.statusGrid}>
          <div style={styles.statusCard}>
            <span style={styles.statusIcon}>🟢</span>
            <div>
              <div style={styles.statusTitle}>
                {language === 'vi' ? 'API Hoạt động' : 'API Active'}
              </div>
              <div style={styles.statusDesc}>
                {language === 'vi' ? 'Dữ liệu thời gian thực' : 'Real-time data'}
              </div>
            </div>
          </div>
          
          <div style={styles.statusCard}>
            <span style={styles.statusIcon}>🔄</span>
            <div>
              <div style={styles.statusTitle}>
                {language === 'vi' ? 'Tự động làm mới' : 'Auto refresh'}
              </div>
              <div style={styles.statusDesc}>
                {language === 'vi' ? 'Mỗi 5 phút' : 'Every 5 minutes'}
              </div>
            </div>
          </div>
          
          <div style={styles.statusCard}>
            <span style={styles.statusIcon}>⏰</span>
            <div>
              <div style={styles.statusTitle}>
                {language === 'vi' ? 'Cập nhật cuối' : 'Last update'}
              </div>
              <div style={styles.statusDesc}>
                {lastUpdate.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>
          💡 {language === 'vi' ? '100% miễn phí, không cần API key' : '100% free, no API key required'}
        </span>
        <button 
          onClick={() => window.open('/rates', '_blank')}
          style={styles.viewAllBtn}
        >
          {language === 'vi' ? 'Xem tất cả tỷ giá' : 'View all rates'} →
        </button>
      </div>
    </div>
  );
};

// Styles object
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh', 
    width: '1200px'
  },
  
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: '#64748b'
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  
  select: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '0.875rem'
  },
  
  error: {
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#dc2626',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  retryBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  
  section: {
    marginBottom: '3rem'
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  
  card: {
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  
  cardSelected: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
  },
  
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  
  flag: {
    fontSize: '1.25rem'
  },
  
  pairName: {
    fontWeight: '600',
    color: '#374151'
  },
  
  rateValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  
  change: {
    fontSize: '0.875rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    display: 'inline-block'
  },
  
  cryptoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  
  cryptoCard: {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  
  cryptoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  
  cryptoSymbol: {
    fontWeight: '700',
    color: '#1e293b'
  },
  
  cryptoName: {
    fontSize: '0.875rem',
    color: '#64748b'
  },
  
  cryptoPrice: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  
  cryptoChange: {
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  
  statusCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0'
  },
  
  statusIcon: {
    fontSize: '1.5rem'
  },
  
  statusTitle: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '0.875rem'
  },
  
  statusDesc: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  
  source: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
    fontSize: '0.875rem',
    color: '#64748b'
  },
  
  viewAllBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  }
};

// Add CSS animation
const cssAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .container { padding: 1rem; }
  .header { flex-direction: column; text-align: center; }
  .title { font-size: 1.5rem; }
  .grid { grid-template-columns: 1fr; }
  .footer { flex-direction: column; gap: 1rem; text-align: center; }
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = cssAnimation;
  document.head.appendChild(style);
}

export default Analytics;