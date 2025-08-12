import React, { useState, useEffect, useCallback } from 'react';
import '../css/Analytics.css'

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
      <div className="analytics-background">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>{language === 'vi' ? 'Đang tải dữ liệu...' : 'Loading data...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-background">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h2 className="title">
            📈 {language === 'vi' ? 'Phân Tích Tỷ Giá' : 'Exchange Rate Analytics'}
          </h2>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="select"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error">
            ⚠️ {error}
            <button 
              onClick={() => { setError(null); fetchRates(); }} 
              className="retryBtn"
            >
              {language === 'vi' ? 'Thử lại' : 'Retry'}
            </button>
          </div>
        )}

        {/* Exchange Rates Grid */}
        <div className="section">
          <h3 className="sectionTitle">
            💱 {language === 'vi' ? 'Tỷ Giá Thời Gian Thực' : 'Real-time Exchange Rates'}
          </h3>
          <div className="grid">
            {rates?.map(rate => (
              <div 
                key={rate.pair} 
                className={`card ${selectedPair === rate.pair ? 'cardSelected' : ''}`}
                onClick={() => setSelectedPair(rate.pair)}
              >
                <div className="cardHeader">
                  <span className="flag">{rate.flag}</span>
                  <span className="pairName">{rate.pair}</span>
                </div>
                
                <div className="rateValue">
                  {formatRate(rate.rate, rate.pair)}
                </div>
                
                {rate.change && (
                  <div className={`change ${rate.change.isPositive ? 'change-positive' : 'change-negative'}`}>
                    {rate.change.isPositive ? '▲' : '▼'} {Math.abs(rate.change.percent)}%
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="source-container">
            <p className="source">
              {language === 'vi' ? 'Nguồn: exchangerate-api.com (Miễn phí)' : 'Source: exchangerate-api.com (Free)'}
            </p>
          </div>
        </div>

        {/* Cryptocurrency Section */}
        {cryptoData && (
          <div className="section">
            <h3 className="sectionTitle">
              🪙 {language === 'vi' ? 'Tiền Điện Tử' : 'Cryptocurrency'}
            </h3>
            <div className="cryptoGrid">
              {cryptoData.map(coin => (
                <div key={coin.id} className="cryptoCard">
                  <div className="cryptoHeader">
                    <span className="cryptoSymbol">{coin.symbol}</span>
                    <span className="cryptoName">{coin.name}</span>
                  </div>
                  <div className="cryptoPrice">
                    ${coin.price?.toLocaleString()}
                  </div>
                  <div className={`cryptoChange ${coin.change24h >= 0 ? 'crypto-positive' : 'crypto-negative'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="source-container">
              <p className="source">
                {language === 'vi' ? 'Nguồn: CoinGecko API (Miễn phí)' : 'Source: CoinGecko API (Free)'}
              </p>
            </div>
          </div>
        )}

        {/* Market Status */}
        <div className="section">
          <div className="statusGrid">
            <div className="statusCard">
              <span className="statusIcon">🟢</span>
              <div>
                <div className="statusTitle">
                  {language === 'vi' ? 'API Hoạt động' : 'API Active'}
                </div>
                <div className="statusDesc">
                  {language === 'vi' ? 'Dữ liệu thời gian thực' : 'Real-time data'}
                </div>
              </div>
            </div>
            
            <div className="statusCard">
              <span className="statusIcon">🔄</span>
              <div>
                <div className="statusTitle">
                  {language === 'vi' ? 'Tự động làm mới' : 'Auto refresh'}
                </div>
                <div className="statusDesc">
                  {language === 'vi' ? 'Mỗi 5 phút' : 'Every 5 minutes'}
                </div>
              </div>
            </div>
            
            <div className="statusCard">
              <span className="statusIcon">⏰</span>
              <div>
                <div className="statusTitle">
                  {language === 'vi' ? 'Cập nhật cuối' : 'Last update'}
                </div>
                <div className="statusDesc">
                  {lastUpdate.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <span>
            💡 {language === 'vi' ? '100% miễn phí, không cần API key' : '100% free, no API key required'}
          </span>
          <button 
            onClick={() => window.open('/rates', '_blank')}
            className="viewAllBtn"
          >
            {language === 'vi' ? 'Xem tất cả tỷ giá' : 'View all rates'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;