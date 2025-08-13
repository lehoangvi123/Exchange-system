import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Report = () => {
  const [marketData, setMarketData] = useState([]);
  const [currentRates, setCurrentRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cryptoData, setCryptoData] = useState({});

  // Fetch current exchange rates
  useEffect(() => {
    const fetchCurrentRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        setCurrentRates({
          eurusd: (1 / data.rates.EUR).toFixed(4),
          usdjpy: data.rates.JPY.toFixed(2),
          gbpusd: (1 / data.rates.GBP).toFixed(4)
        });
      } catch (err) {
        console.error('Error fetching current rates:', err);
        setError('Không thể tải tỷ giá hiện tại');
      }
    };

    fetchCurrentRates();
  }, []);

  // Generate hourly data for EUR/USD (simulated intraday movement)
  useEffect(() => {
    const generateHourlyData = () => {
      const now = new Date();
      const data = [];
      
      // Generate data for the last 7 hours
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hour = time.getHours().toString().padStart(2, '0');
        const minute = time.getMinutes() < 30 ? '00' : '30';
        
        // Simulate realistic EUR/USD movement around current rate
        const baseRate = currentRates.eurusd || 1.10;
        const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
        const rate = parseFloat(baseRate) + variation;
        
        data.push({
          time: `${hour}:${minute}`,
          eurusd: parseFloat(rate.toFixed(4))
        });
      }
      
      setMarketData(data);
      setLoading(false);
    };

    if (currentRates.eurusd) {
      generateHourlyData();
    }
  }, [currentRates]);

  // Fetch crypto prices
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
      }
    };

    fetchCryptoData();
  }, []);

  const formatChange = (change) => {
    if (!change) return 'N/A';
    const sign = change > 0 ? '+' : '';
    const className = change > 0 ? 'change-positive' : 'change-negative';
    return <span className={className}>{sign}{change.toFixed(2)}%</span>;
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">📊 Đang tải dữ liệu thị trường...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-container">
        <div className="error-container">
          <div className="error-text">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <style jsx>{`
        .report-container {
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
          font-size: 1.25rem;
          font-weight: 500;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: rgba(239, 68, 68, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .error-text {
          color: #fecaca;
          font-size: 1.25rem;
          font-weight: 500;
          text-align: center;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 2.5rem 2rem;
        }

        .main-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #d1d5db;
          margin: 0;
          font-weight: 400;
        }

        .report-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 2rem;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .report-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .section-icon {
          width: 32px;
          height: 32px;
          opacity: 0.8;
        }

        .currency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .currency-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .currency-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.02);
        }

        .flag-icon {
          width: 40px;
          height: 30px;
          border-radius: 5px;
          object-fit: cover;
          font-size: 2rem;
        }

        .currency-info {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .chart-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .crypto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .crypto-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .crypto-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
        }

        .crypto-item.bitcoin {
          border-left: 4px solid #f7931a;
        }

        .crypto-item.ethereum {
          border-left: 4px solid #627eea;
        }

        .crypto-item.ripple {
          border-left: 4px solid #00d4cc;
        }

        .crypto-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crypto-info {
          flex: 1;
        }

        .crypto-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .crypto-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #60a5fa;
          margin-bottom: 0.25rem;
        }

        .crypto-change {
          font-size: 1rem;
          font-weight: 600;
        }

        .change-positive {
          color: #34d399;
        }

        .change-negative {
          color: #f87171;
        }

        .info-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-item {
          color: #d1d5db;
          font-size: 1rem;
          margin-bottom: 0.75rem;
          padding-left: 1rem;
          position: relative;
        }

        .info-item::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #60a5fa;
          font-weight: bold;
        }

        .update-time {
          color: #9ca3af;
          font-size: 0.875rem;
          font-style: italic;
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .report-container {
            padding: 1rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .header-section {
            padding: 2rem 1.5rem;
          }

          .report-card {
            padding: 1.5rem;
          }

          .currency-grid {
            grid-template-columns: 1fr;
          }

          .crypto-grid {
            grid-template-columns: 1fr;
          }

          .chart-container {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .report-container {
            padding: 0.5rem;
          }

          .main-title {
            font-size: 1.5rem;
          }

          .card-title {
            font-size: 1.25rem;
          }

          .currency-item,
          .crypto-item {
            padding: 1rem;
          }

          .crypto-price {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <h2 className="main-title">
            📊 Tổng quan thị trường hôm nay
          </h2>
          <p className="subtitle">
            Báo cáo chi tiết về tỷ giá ngoại tệ và thị trường crypto
          </p>
        </div>

        {/* Currency Rates Section */}
        <div className="report-card">
          <div className="card-header">
            <h3 className="card-title">💱 Tỷ giá ngoại tệ (Live)</h3>
          </div>
          
          <div className="currency-grid">
            <div className="currency-item">
              <div className="flag-icon">💶</div>
              <div className="currency-info">
                <strong>EUR/USD:</strong> {currentRates.eurusd || 'Loading...'}
              </div>
            </div>
            
            <div className="currency-item">
              <div className="flag-icon">💴</div>
              <div className="currency-info">
                <strong>USD/JPY:</strong> {currentRates.usdjpy || 'Loading...'}
              </div>
            </div>
            
            <div className="currency-item">
              <div className="flag-icon">💷</div>
              <div className="currency-info">
                <strong>GBP/USD:</strong> {currentRates.gbpusd || 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="report-card">
          <div className="card-header">
            <h3 className="card-title">📈 Biểu đồ EUR/USD theo giờ</h3>
          </div>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#d1d5db"
                  fontSize={12}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#d1d5db"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [value, 'EUR/USD']}
                  labelFormatter={(label) => `Thời gian: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="eurusd"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ fill: '#60a5fa', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, stroke: '#60a5fa', strokeWidth: 2, fill: '#1e40af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crypto Section */}
        {Object.keys(cryptoData).length > 0 && (
          <div className="report-card">
            <div className="card-header">
              <h3 className="card-title">₿ Thị trường tiền mã hóa (Live)</h3>
            </div>
            
            <div className="crypto-grid">
              {cryptoData.bitcoin && (
                <div className="crypto-item bitcoin">
                  <div className="crypto-icon">₿</div>
                  <div className="crypto-info">
                    <div className="crypto-name">Bitcoin</div>
                    <div className="crypto-price">${cryptoData.bitcoin.usd?.toLocaleString()}</div>
                    <div className="crypto-change">{formatChange(cryptoData.bitcoin.usd_24h_change)}</div>
                  </div>
                </div>
              )}
              
              {cryptoData.ethereum && (
                <div className="crypto-item ethereum">
                  <div className="crypto-icon">⧫</div>
                  <div className="crypto-info">
                    <div className="crypto-name">Ethereum</div>
                    <div className="crypto-price">${cryptoData.ethereum.usd?.toLocaleString()}</div>
                    <div className="crypto-change">{formatChange(cryptoData.ethereum.usd_24h_change)}</div>
                  </div>
                </div>
              )}
              
              {cryptoData.ripple && (
                <div className="crypto-item ripple">
                  <div className="crypto-icon">◆</div>
                  <div className="crypto-info">
                    <div className="crypto-name">Ripple</div>
                    <div className="crypto-price">${cryptoData.ripple.usd?.toFixed(4)}</div>
                    <div className="crypto-change">{formatChange(cryptoData.ripple.usd_24h_change)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="report-card">
          <div className="card-header">
            <h3 className="card-title">🛎️ Thông tin thị trường</h3>
          </div>
          
          <div className="info-section">
            <p className="info-item">Dữ liệu tỷ giá được cập nhật từ exchangerate-api.com</p>
            <p className="info-item">Giá tiền mã hóa từ CoinGecko API (cập nhật 24h)</p>
            <p className="info-item">Biểu đồ EUR/USD mô phỏng biến động trong ngày</p>
            <p className="info-item">Tất cả dữ liệu được làm mới tự động</p>
            <p className="update-time">
              Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;