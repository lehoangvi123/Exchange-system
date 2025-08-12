import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import '../css/Report.css';

const Report = () => {
  const [marketData, setMarketData] = useState([]);
  const [currentRates, setCurrentRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch crypto prices as alternative data source
  const [cryptoData, setCryptoData] = useState({});
  
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

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
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

  const formatChange = (change) => {
    if (!change) return 'N/A';
    const sign = change > 0 ? '+' : '';
    const className = change > 0 ? 'change-positive' : 'change-negative';
    return <span className={className}>{sign}{change.toFixed(2)}%</span>;
  };

  return (
    <div className="report-container">
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
          <img 
            src="/image/currency-icon.png" 
            alt="Currency" 
            className="section-icon"
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <h3 className="card-title">💱 Tỷ giá ngoại tệ (Live)</h3>
        </div>
        
        <div className="currency-grid">
          <div className="currency-item">
            <img 
              src="/image/eur-flag.png" 
              alt="EUR" 
              className="flag-icon"
              onError={(e) => {e.target.innerHTML = '💶'}}
            />
            <div className="currency-info">
              <strong>EUR/USD:</strong> {currentRates.eurusd || 'Loading...'}
            </div>
          </div>
          
          <div className="currency-item">
            <img 
              src="/image/jpy-flag.png" 
              alt="JPY" 
              className="flag-icon"
              onError={(e) => {e.target.innerHTML = '💴'}}
            />
            <div className="currency-info">
              <strong>USD/JPY:</strong> {currentRates.usdjpy || 'Loading...'}
            </div>
          </div>
          
          <div className="currency-item">
            <img 
              src="/image/gbp-flag.png" 
              alt="GBP" 
              className="flag-icon"
              onError={(e) => {e.target.innerHTML = '💷'}}
            />
            <div className="currency-info">
              <strong>GBP/USD:</strong> {currentRates.gbpusd || 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="report-card">
        <div className="card-header">
          <img 
            src="/image/chart-icon.png" 
            alt="Chart" 
            className="section-icon"
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <h3 className="card-title">📈 Biểu đồ EUR/USD theo giờ</h3>
        </div>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={marketData}>
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                formatter={(value) => [value, 'EUR/USD']}
                labelFormatter={(label) => `Thời gian: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="eurusd"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crypto Section */}
      {Object.keys(cryptoData).length > 0 && (
        <div className="report-card">
          <div className="card-header">
            <img 
              src="/image/crypto-icon.png" 
              alt="Crypto" 
              className="section-icon"
              onError={(e) => {e.target.style.display = 'none'}}
            />
            <h3 className="card-title">₿ Thị trường tiền mã hóa (Live)</h3>
          </div>
          
          <div className="crypto-grid">
            {cryptoData.bitcoin && (
              <div className="crypto-item bitcoin">
                <img 
                  src="/image/bitcoin-logo.png" 
                  alt="Bitcoin" 
                  className="crypto-icon"
                  onError={(e) => {e.target.innerHTML = '₿'}}
                />
                <div className="crypto-info">
                  <div className="crypto-name">Bitcoin</div>
                  <div className="crypto-price">${cryptoData.bitcoin.usd?.toLocaleString()}</div>
                  <div className="crypto-change">{formatChange(cryptoData.bitcoin.usd_24h_change)}</div>
                </div>
              </div>
            )}
            
            {cryptoData.ethereum && (
              <div className="crypto-item ethereum">
                <img 
                  src="/image/ethereum-logo.png" 
                  alt="Ethereum" 
                  className="crypto-icon"
                  onError={(e) => {e.target.innerHTML = '⧫'}}
                />
                <div className="crypto-info">
                  <div className="crypto-name">Ethereum</div>
                  <div className="crypto-price">${cryptoData.ethereum.usd?.toLocaleString()}</div>
                  <div className="crypto-change">{formatChange(cryptoData.ethereum.usd_24h_change)}</div>
                </div>
              </div>
            )}
            
            {cryptoData.ripple && (
              <div className="crypto-item ripple">
                <img 
                  src="/image/ripple-logo.png" 
                  alt="Ripple" 
                  className="crypto-icon"
                  onError={(e) => {e.target.innerHTML = '◆'}}
                />
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
          <img 
            src="/image/info-icon.png" 
            alt="Info" 
            className="section-icon"
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <h3 className="card-title">🛎️ Thông tin thị trường</h3>
        </div>
        
        <div className="info-section">
          <p className="info-item">• Dữ liệu tỷ giá được cập nhật từ exchangerate-api.com</p>
          <p className="info-item">• Giá tiền mã hóa từ CoinGecko API (cập nhật 24h)</p>
          <p className="info-item">• Biểu đồ EUR/USD mô phỏng biến động trong ngày</p>
          <p className="update-time">
            Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;