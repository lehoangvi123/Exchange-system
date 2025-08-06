// 📁 components/RateChart.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function RateChart() {
  const [data, setData] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedChart, setSelectedChart] = useState('vnd');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [baseRates, setBaseRates] = useState(null);
  const intervalRef = useRef(null);
  const previousRatesRef = useRef(null);
  const trendDirectionRef = useRef({});

  useEffect(() => {
    // Khởi tạo base rates mặc định ngay lập tức
    initializeDefaultRates();
    
    // Sau đó fetch API để cập nhật base rates chính xác hơn
    fetchBaseRatesFromAPI();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Khởi tạo base rates mặc định để chart chạy ngay
  const initializeDefaultRates = () => {
    const defaultRates = {
      EUR: 0.9234,
      GBP: 0.7891,
      JPY: 149.85,
      VND: 24650,
      CNY: 7.2456,
      AUD: 0.6543,
      CAD: 0.7321,
      CHF: 0.8765
    };

    setBaseRates(defaultRates);
    
    // Initialize trend directions
    trendDirectionRef.current = {
      EUR: Math.random() > 0.5 ? 1 : -1,
      GBP: Math.random() > 0.5 ? 1 : -1,
      VND: Math.random() > 0.5 ? 1 : -1,
      JPY: Math.random() > 0.5 ? 1 : -1,
      CNY: Math.random() > 0.5 ? 1 : -1
    };

    setIsLoading(false);
    
    // Bắt đầu chạy ngay với default rates
    setTimeout(() => {
      startAutoTracking();
    }, 500); // Delay nhỏ để component render xong
    
    console.log('🚀 Chart initialized with default rates and started immediately');
  };

  // Fetch base rates từ API để cập nhật (không block UI)
  const fetchBaseRatesFromAPI = async () => {
    try {
      setError(null);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      if (!apiData || !apiData.rates) {
        throw new Error('Invalid API response format');
      }

      const rates = apiData.rates;
      
      // Cập nhật base rates với data thật từ API
      const newBaseRates = {
        EUR: parseFloat((1 / rates.EUR).toFixed(6)),
        GBP: parseFloat((1 / rates.GBP).toFixed(6)),
        JPY: parseFloat(rates.JPY.toFixed(2)),
        CNY: parseFloat(rates.CNY.toFixed(4)),
        VND: parseFloat(rates.VND.toFixed(0)),
        AUD: parseFloat((1 / rates.AUD).toFixed(6)),
        CAD: parseFloat((1 / rates.CAD).toFixed(6)),
        CHF: parseFloat((1 / rates.CHF).toFixed(6))
      };

      // Cập nhật base rates mà không dừng chart
      setBaseRates(newBaseRates);
      
      console.log('📊 Base rates updated from API:', newBaseRates);
      
    } catch (err) {
      console.error('❌ API fetch failed, continuing with current rates:', err);
      setError(`API Error: ${err.message} (using fallback rates)`);
      
      // Không làm gì cả, tiếp tục với rates hiện tại
    }
  };

  const startAutoTracking = () => {
    // Generate ngay lập tức
    generateRealisticData();
    
    // Generate mỗi 10 giây để thấy movement rõ hơn
    intervalRef.current = setInterval(generateRealisticData, 10000);
  };

  const stopTracking = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Tạo realistic market variations
  const getMarketVolatility = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Weekend có volatility thấp hơn
    if (day === 0 || day === 6) {
      return 0.0003; // ±0.03%
    }
    
    // Market hours có volatility cao hơn
    if ((hour >= 8 && hour <= 17) || (hour >= 20 && hour <= 23)) {
      return 0.0008; // ±0.08%
    }
    
    // Off-hours có volatility trung bình
    return 0.0005; // ±0.05%
  };

  const generateTrendingVariation = (currency, baseValue) => {
    const volatility = getMarketVolatility();
    
    // Random walk với trend
    let trend = trendDirectionRef.current[currency] || 1;
    
    // 15% chance để đổi hướng trend
    if (Math.random() < 0.15) {
      trend = -trend;
      trendDirectionRef.current[currency] = trend;
    }
    
    // Tạo variation với bias theo trend
    const randomComponent = (Math.random() - 0.5) * volatility;
    const trendComponent = trend * volatility * 0.3; // 30% bias theo trend
    
    const totalVariation = randomComponent + trendComponent;
    
    return baseValue * (1 + totalVariation);
  };

  const generateRealisticData = () => {
    if (!baseRates) return;

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    // Generate realistic variations cho từng currency
    const EUR = generateTrendingVariation('EUR', baseRates.EUR);
    const GBP = generateTrendingVariation('GBP', baseRates.GBP);
    const JPY = generateTrendingVariation('JPY', baseRates.JPY);
    const CNY = generateTrendingVariation('CNY', baseRates.CNY);
    const VND = generateTrendingVariation('VND', baseRates.VND);

    const newPoint = {
      time,
      timestamp: now.getTime(),
      
      // Major pairs
      USD: 1,
      EUR: parseFloat(EUR.toFixed(6)),
      GBP: parseFloat(GBP.toFixed(6)),
      JPY: parseFloat(JPY.toFixed(2)),
      CNY: parseFloat(CNY.toFixed(4)),
      
      // VND pairs
      USD_VND: parseFloat(VND.toFixed(0)),
      EUR_VND: parseFloat((VND / EUR).toFixed(0)),
      GBP_VND: parseFloat((VND / GBP).toFixed(0)),
      
      // Additional pairs
      AUD: parseFloat(generateTrendingVariation('AUD', baseRates.AUD).toFixed(6)),
      CAD: parseFloat(generateTrendingVariation('CAD', baseRates.CAD).toFixed(6)),
      CHF: parseFloat(generateTrendingVariation('CHF', baseRates.CHF).toFixed(6)),
      
      // Market info
      volatility: getMarketVolatility(),
      isRealistic: true
    };

    // Calculate changes from previous
    if (previousRatesRef.current) {
      newPoint.changes = {
        EUR: ((newPoint.EUR - previousRatesRef.current.EUR) / previousRatesRef.current.EUR * 100).toFixed(4),
        GBP: ((newPoint.GBP - previousRatesRef.current.GBP) / previousRatesRef.current.GBP * 100).toFixed(4),
        USD_VND: ((newPoint.USD_VND - previousRatesRef.current.USD_VND) / previousRatesRef.current.USD_VND * 100).toFixed(4),
        EUR_VND: ((newPoint.EUR_VND - previousRatesRef.current.EUR_VND) / previousRatesRef.current.EUR_VND * 100).toFixed(4)
      };
    }
    
    previousRatesRef.current = newPoint;

    setData(prev => {
      const newData = [...prev, newPoint];
      return newData.slice(-50); // Keep last 50 points
    });

    setLastFetchTime(now);
    
    // Update base rates slightly để tạo long-term drift
    if (Math.random() < 0.1) { // 10% chance
      const driftFactor = 1 + (Math.random() - 0.5) * 0.0002; // ±0.01% drift
      setBaseRates(prev => ({
        ...prev,
        EUR: prev.EUR * driftFactor,
        GBP: prev.GBP * driftFactor,
        VND: prev.VND * (1 + (Math.random() - 0.5) * 0.00005) // VND drift ít hơn
      }));
    }
    
    console.log(`📊 Realistic data generated at ${time} - USD/VND: ${newPoint.USD_VND}, Vol: ${(getMarketVolatility() * 100).toFixed(3)}%`);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          fontSize: '13px',
          minWidth: '200px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#1f2937', fontSize: '14px' }}>
            ⏰ {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '6px 0', 
              color: entry.color,
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{entry.name}:</span>
              <span>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
            </p>
          ))}
          {data?.volatility && (
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#10b981' }}>
              📈 Volatility: {(data.volatility * 100).toFixed(3)}%
            </p>
          )}
          {data?.isRealistic && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6366f1', fontStyle: 'italic' }}>
              🎯 Realistic Simulation
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '40px auto',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      border: '1px solid #e5e7eb'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    },
    chartToggle: {
      display: 'flex',
      gap: '6px',
      backgroundColor: '#f3f4f6',
      padding: '6px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    },
    toggleButton: {
      padding: '10px 18px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent',
      color: '#6b7280'
    },
    toggleButtonActive: {
      backgroundColor: '#667eea',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-1px)'
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f0fdf4',
      padding: '10px 16px',
      borderRadius: '10px',
      border: '1px solid #bbf7d0'
    },
    pulsingDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      animation: 'pulse 2s infinite'
    },
    controlButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    startButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    stopButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    refreshButton: {
      backgroundColor: '#6366f1',
      color: 'white'
    },
    chartContainer: {
      height: '500px',
      backgroundColor: '#fafafa',
      borderRadius: '16px',
      padding: '25px',
      border: '1px solid #e5e7eb',
      marginBottom: '20px',
      position: 'relative'
    },
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '450px',
      color: '#6b7280',
      fontSize: '16px'
    },
    errorState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '450px',
      color: '#ef4444',
      fontSize: '16px',
      textAlign: 'center'
    },
    dataInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
      fontSize: '13px',
      color: '#6b7280',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '20px'
    },
    infoCard: {
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    chartDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      lineHeight: '1.5'
    }
  };

  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;

  const renderMajorChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis 
          dataKey="time" 
          tick={{fontSize: 11}}
          interval={Math.max(0, Math.floor(data.length / 6))}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{fontSize: 12}}
          domain={['dataMin - 0.005', 'dataMax + 0.005']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{paddingTop: '20px'}} />
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.7} />

        <Line 
          dataKey="EUR" 
          stroke="#10b981" 
          name="EUR/USD" 
          dot={{fill: '#10b981', r: 3}} 
          strokeWidth={3}
          connectNulls={false}
        />
        <Line 
          dataKey="GBP" 
          stroke="#3b82f6" 
          name="GBP/USD" 
          dot={{fill: '#3b82f6', r: 3}}
          strokeWidth={3}
        />
        <Line 
          dataKey="CNY" 
          stroke="#f59e0b" 
          name="USD/CNY" 
          dot={{fill: '#f59e0b', r: 3}}
          strokeWidth={2}
          opacity={0.9}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderVNDChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis 
          dataKey="time" 
          tick={{fontSize: 11}}
          interval={Math.max(0, Math.floor(data.length / 6))}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{fontSize: 12}}
          domain={['dataMin - 50', 'dataMax + 50']}
          tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
        />
        <Tooltip 
          content={<CustomTooltip />}
          formatter={(value, name) => [
            `${value.toLocaleString()} VND`, 
            name
          ]}
        />
        <Legend wrapperStyle={{paddingTop: '20px'}} />
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.7} />

        <Line 
          dataKey="USD_VND" 
          stroke="#dc2626" 
          name="USD/VND" 
          dot={{fill: '#dc2626', r: 4}} 
          strokeWidth={3}
          connectNulls={false}
        />
        <Line 
          dataKey="EUR_VND" 
          stroke="#7c3aed" 
          name="EUR/VND" 
          dot={{fill: '#7c3aed', r: 4}}
          strokeWidth={3}
        />
        <Line 
          dataKey="GBP_VND" 
          stroke="#059669" 
          name="GBP/VND" 
          dot={{fill: '#059669', r: 3}}
          strokeWidth={2}
          opacity={0.8}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            📈 Tỷ giá dao động thực tế
          </h3>
          
          <div style={styles.controls}>
            <div style={styles.chartToggle}>
              <button
                style={{
                  ...styles.toggleButton,
                  ...(selectedChart === 'vnd' ? styles.toggleButtonActive : {})
                }}
                onClick={() => setSelectedChart('vnd')}
              >
                🇻🇳 VND Pairs
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  ...(selectedChart === 'major' ? styles.toggleButtonActive : {})
                }}
                onClick={() => setSelectedChart('major')}
              >
                💰 Major Pairs
              </button>
            </div>

            <div style={styles.statusContainer}>
              <div style={styles.liveIndicator}>
                <div style={styles.pulsingDot}></div>
                <span style={{
                  color: '#059669', 
                  fontWeight: '600',
                  fontSize: '13px'
                }}>
                  🟢 AUTO LIVE • 10s
                </span>
              </div>

              <button
                onClick={fetchBaseRatesFromAPI}
                style={{...styles.controlButton, ...styles.refreshButton}}
              >
                🔄 Refresh API
              </button>
            </div>
          </div>
        </div>

        <div style={styles.chartDescription}>
          {selectedChart === 'major' ? (
            <>
              📊 <strong>Major Currency Pairs với Realistic Variations:</strong> EUR/USD, GBP/USD, USD/CNY - 
              Auto-started với default rates, được cập nhật background từ ExchangeRate-API.
              {error && <span style={{color: '#f59e0b'}}> ⚠️ {error}</span>}
            </>
          ) : (
            <>
              🇻🇳 <strong>VND Currency Pairs với Market Simulation:</strong> USD/VND, EUR/VND, GBP/VND - 
              Tự động bắt đầu ngay với mô phỏng dao động thực tế theo market hours.
              {error && <span style={{color: '#f59e0b'}}> ⚠️ {error}</span>}
            </>
          )}
        </div>

        <div style={styles.chartContainer}>
          {isLoading ? (
            <div style={styles.loadingState}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⚡</div>
              <div>Khởi tạo chart với default rates...</div>
              <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>
                API sẽ cập nhật background
              </div>
            </div>
          ) : (
            selectedChart === 'major' ? renderMajorChart() : renderVNDChart()
          )}
        </div>

        {data.length > 0 && (
          <div style={styles.dataInfo}>
            <div style={styles.infoCard}>
              <strong>📊 Chart Info</strong><br/>
              Points: {data.length}/50<br/>
              Started: {data[0]?.time}<br/>
              Latest: {data[data.length - 1]?.time}
            </div>
            
            <div style={styles.infoCard}>
              <strong>🎯 Auto Simulation</strong><br/>
              Mode: Always Running<br/>
              Update: Every 10 seconds<br/>
              Volatility: {data[data.length - 1]?.volatility ? (data[data.length - 1].volatility * 100).toFixed(3) + '%' : 'N/A'}
            </div>

            <div style={styles.infoCard}>
              <strong>💰 Current Rates</strong><br/>
              {selectedChart === 'major' ? (
                <>
                  EUR/USD: {data[data.length - 1]?.EUR?.toFixed(6)}<br/>
                  GBP/USD: {data[data.length - 1]?.GBP?.toFixed(6)}<br/>
                  USD/CNY: {data[data.length - 1]?.CNY?.toFixed(2)}
                </>
              ) : (
                <>
                  USD/VND: {data[data.length - 1]?.USD_VND?.toLocaleString()}<br/>
                  EUR/VND: {data[data.length - 1]?.EUR_VND?.toLocaleString()}<br/>
                  GBP/VND: {data[data.length - 1]?.GBP_VND?.toLocaleString()}
                </>
              )}
            </div>

            <div style={styles.infoCard}>
              <strong>📈 Market Status</strong><br/>
              {(() => {
                const hour = new Date().getHours();
                const day = new Date().getDay();
                if (day === 0 || day === 6) return '🔹 Weekend (Low Vol)';
                if ((hour >= 8 && hour <= 17) || (hour >= 20 && hour <= 23)) return '🔥 Peak Hours (High Vol)';
                return '🌙 Off Hours (Med Vol)';
              })()}<br/>
              Trends: {Object.keys(trendDirectionRef.current).length} active<br/>
              {lastFetchTime && <>API: {lastFetchTime.toLocaleTimeString('vi-VN')}</>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}