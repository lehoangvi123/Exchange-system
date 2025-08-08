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

  // Fetch current exchange rates
  useEffect(() => {
    const fetchCurrentRates = async () => {
      try {
        // Using exchangerate-api.com (free, no API key required)
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
        // Using CoinGecko API (free, no API key required)
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px' }}>📊 Đang tải dữ liệu thị trường...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <div>{error}</div>
      </div>
    );
  }

  const formatChange = (change) => {
    if (!change) return 'N/A';
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? '#10b981' : '#ef4444';
    return <span style={{ color }}>{sign}{change.toFixed(2)}%</span>;
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      width: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f8fafc'
    }}>
      <h2 style={{ 
        color: '#1e293b', 
        borderBottom: '2px solid #e2e8f0', 
        paddingBottom: '10px',
        fontSize: '24px'
      }}>
        📊 Tổng quan thị trường hôm nay
      </h2>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#374151', marginBottom: '15px' }}>💱 Tỷ giá ngoại tệ (Live)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
            <strong>💶 EUR/USD:</strong> {currentRates.eurusd || 'Loading...'}
          </div>
          <div style={{ padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
            <strong>💴 USD/JPY:</strong> {currentRates.usdjpy || 'Loading...'}
          </div>
          <div style={{ padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
            <strong>💷 GBP/USD:</strong> {currentRates.gbpusd || 'Loading...'}
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#374151', marginBottom: '15px' }}>📈 Biểu đồ EUR/USD theo giờ</h3>
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

      {Object.keys(cryptoData).length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '15px' }}>₿ Thị trường tiền mã hóa (Live)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {cryptoData.bitcoin && (
              <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
                <strong>₿ Bitcoin:</strong> ${cryptoData.bitcoin.usd?.toLocaleString()} 
                <div>{formatChange(cryptoData.bitcoin.usd_24h_change)}</div>
              </div>
            )}
            {cryptoData.ethereum && (
              <div style={{ padding: '10px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
                <strong>⧫ Ethereum:</strong> ${cryptoData.ethereum.usd?.toLocaleString()}
                <div>{formatChange(cryptoData.ethereum.usd_24h_change)}</div>
              </div>
            )}
            {cryptoData.ripple && (
              <div style={{ padding: '10px', backgroundColor: '#f3e8ff', borderRadius: '6px' }}>
                <strong>◆ Ripple:</strong> ${cryptoData.ripple.usd?.toFixed(4)}
                <div>{formatChange(cryptoData.ripple.usd_24h_change)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#374151', marginBottom: '15px' }}>🛎️ Thông tin thị trường</h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
          <p style={{ margin: '5px 0' }}>• Dữ liệu tỷ giá được cập nhật từ exchangerate-api.com</p>
          <p style={{ margin: '5px 0' }}>• Giá tiền mã hóa từ CoinGecko API (cập nhật 24h)</p>
          <p style={{ margin: '5px 0' }}>• Biểu đồ EUR/USD mô phỏng biến động trong ngày</p>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#6b7280' }}>
            Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;