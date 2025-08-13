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
      <div className="analytics-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">{language === 'vi' ? 'Đang tải dữ liệu...' : 'Loading data...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <style jsx>{`
        .analytics-container {
          min-height: 100vh;
          width: 100%;
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
            url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          padding: 2rem;
          color: white;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top: 4px solid #60a5fa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: white;
          font-size: 1.125rem;
          font-weight: 500;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1.5rem 2rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .select {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .select:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .select option {
          background: #1f2937;
          color: white;
        }

        .error {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fecaca;
        }

        .retryBtn {
          padding: 0.5rem 1rem;
          background: rgba(239, 68, 68, 0.8);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .retryBtn:hover {
          background: rgba(239, 68, 68, 1);
          transform: translateY(-1px);
        }

        .section {
          margin-bottom: 3rem;
        }

        .sectionTitle {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
          
          text-align: center;
        } 

        h3.sectionTitle{ 
          color: white; 
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        } 

        span { 
          color: white;
        }

        .card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(96, 165, 250, 0.5);
          transform: translateY(-5px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }

        .cardSelected {
          background: rgba(96, 165, 250, 0.2);
          border-color: rgba(96, 165, 250, 0.8);
          box-shadow: 0 15px 25px rgba(96, 165, 250, 0.3);
        }

        .cardHeader {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .flag {
          font-size: 1.5rem;
        }

        .pairName {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
        }

        .rateValue {
          font-size: 2rem;
          font-weight: 700;
          color: #60a5fa;
          margin-bottom: 0.75rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .change {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        .change-positive {
          color: #34d399;
        }

        .change-negative {
          color: #f87171;
        }

        .cryptoGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .cryptoCard {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .cryptoCard:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }

        .cryptoHeader {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .cryptoSymbol {
          font-size: 1.125rem;
          font-weight: 700;
          color: #fbbf24;
        }

        .cryptoName {
          font-size: 1rem;
          color: white;
          font-weight: 500;
        }

        .cryptoPrice {
          font-size: 1.5rem;
          font-weight: 700;
          color: #60a5fa;
          margin-bottom: 0.5rem;
        }

        .cryptoChange {
          font-size: 1rem;
          font-weight: 600;
        }

        .crypto-positive {
          color: #34d399;
        }

        .crypto-negative {
          color: #f87171;
        }

        .statusGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .statusCard {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .statusCard:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-3px);
        }

        .statusIcon {
          font-size: 2rem;
        }

        .statusTitle {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .statusDesc {
          color: #d1d5db;
          font-size: 0.875rem;
        }

        .source-container {
          text-align: center;
          margin-top: 1rem;
        }

        .source {
          color: #9ca3af;
          font-size: 0.875rem;
          font-style: italic;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          margin-top: 3rem;
        }

        .viewAllBtn {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        } 

        h3  { 
          color: white;
        }

        .viewAllBtn:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .analytics-container {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .title {
            font-size: 2rem;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .footer {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .analytics-container {
            padding: 0.5rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .card {
            padding: 1rem;
          }

          .rateValue {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="content-wrapper">
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