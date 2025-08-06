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
  const intervalRef = useRef(null);
  const previousRatesRef = useRef(null);

  useEffect(() => {
    startAutoTracking();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startAutoTracking = () => {
    setIsRunning(true);
    
    // Fetch ngay lập tức
    fetchRealRates();
    
    // Fetch mỗi 60 giây (API này update mỗi ngày, nhưng ta fetch thường xuyên để demo)
    intervalRef.current = setInterval(fetchRealRates, 10000);
  };

  const stopTracking = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fetchRealRates = async () => {
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

      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      // Lấy tỷ giá thật từ API
      const rates = apiData.rates;
      
      // Tính toán các cặp tiền tệ cần thiết
      const newPoint = {
        time,
        timestamp: now.getTime(),
        
        // Major pairs (base USD = 1)
        USD: 1,
        EUR: parseFloat((1 / rates.EUR).toFixed(6)), // EUR/USD
        GBP: parseFloat((1 / rates.GBP).toFixed(6)), // GBP/USD
        JPY: parseFloat(rates.JPY.toFixed(2)), // USD/JPY
        CNY: parseFloat(rates.CNY.toFixed(4)), // USD/CNY
        
        // VND pairs
        USD_VND: parseFloat(rates.VND.toFixed(0)), // USD/VND
        EUR_VND: parseFloat((rates.VND / rates.EUR).toFixed(0)), // EUR/VND
        GBP_VND: parseFloat((rates.VND / rates.GBP).toFixed(0)), // GBP/VND
        
        // Additional useful rates
        AUD: parseFloat((1 / rates.AUD).toFixed(6)), // AUD/USD
        CAD: parseFloat((1 / rates.CAD).toFixed(6)), // CAD/USD
        CHF: parseFloat((1 / rates.CHF).toFixed(6)), // CHF/USD
        
        // Store raw API data for reference
        apiTimestamp: apiData.date,
        apiRates: rates
      };

      // Store previous rates for change calculation
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
        // Giữ tối đa 50 điểm để tránh quá tải
        return newData.slice(-50);
      });

      setLastFetchTime(now);
      setIsLoading(false);
      
      console.log(`📊 Real rates fetched at ${time} - USD/VND: ${newPoint.USD_VND}, EUR/VND: ${newPoint.EUR_VND}`);
      
    } catch (err) {
      console.error('❌ API fetch failed:', err);
      setError(err.message);
      setIsLoading(false);
      
      // Fallback: continue với mock data nếu API fail
      generateFallbackData();
    }
  };

  // Fallback function khi API không hoạt động
  const generateFallbackData = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    // Base fallback rates (gần với thực tế)
    const baseRates = {
      EUR: 0.9234,
      GBP: 0.7891,
      JPY: 149.85,
      VND: 24650,
      CNY: 7.2456
    };

    // Thêm variation nhỏ
    const variation = () => (Math.random() - 0.5) * 0.001; // ±0.05%

    const fallbackPoint = {
      time,
      timestamp: now.getTime(),
      USD: 1,
      EUR: parseFloat((baseRates.EUR + variation()).toFixed(6)),
      GBP: parseFloat((baseRates.GBP + variation()).toFixed(6)),
      JPY: parseFloat((baseRates.JPY + variation() * 50).toFixed(2)),
      CNY: parseFloat((baseRates.CNY + variation()).toFixed(4)),
      USD_VND: parseFloat((baseRates.VND + variation() * 100).toFixed(0)),
      EUR_VND: parseFloat((baseRates.VND * baseRates.EUR + variation() * 100).toFixed(0)),
      GBP_VND: parseFloat((baseRates.VND * baseRates.GBP + variation() * 100).toFixed(0)),
      isFallback: true
    };

    setData(prev => {
      const newData = [...prev, fallbackPoint];
      return newData.slice(-50);
    });
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
          {data?.isFallback && (
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#f59e0b', fontStyle: 'italic' }}>
              ⚠️ Fallback Data (API unavailable)
            </p>
          )}
          {data?.apiTimestamp && (
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
              📊 API Date: {data.apiTimestamp}
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
      backgroundColor: isRunning ? '#f0fdf4' : '#fef2f2',
      padding: '10px 16px',
      borderRadius: '10px',
      border: `1px solid ${isRunning ? '#bbf7d0' : '#fecaca'}`
    },
    pulsingDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: isRunning ? '#10b981' : '#ef4444',
      animation: isRunning ? 'pulse 2s infinite' : 'none'
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
          domain={['dataMin - 0.02', 'dataMax + 0.02']}
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
          domain={['dataMin - 200', 'dataMax + 200']}
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
            🌐 Tỷ giá thời gian thực
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
                  color: isRunning ? '#059669' : '#dc2626', 
                  fontWeight: '600',
                  fontSize: '13px'
                }}>
                  {isRunning ? '🟢 LIVE' : '🔴 STOPPED'} • 60s
                </span>
              </div>

              {!isRunning ? (
                <button
                  onClick={startAutoTracking}
                  style={{...styles.controlButton, ...styles.startButton}}
                >
                  ▶️ Start
                </button>
              ) : (
                <button
                  onClick={stopTracking}
                  style={{...styles.controlButton, ...styles.stopButton}}
                >
                  ⏸️ Stop
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={styles.chartDescription}>
          {selectedChart === 'major' ? (
            <>
              📊 <strong>Major Currency Pairs:</strong> EUR/USD, GBP/USD, USD/CNY - 
              Theo dõi các cặp tiền tệ chính với dữ liệu thật từ ExchangeRate-API. 
              {error && <span style={{color: '#ef4444'}}> ⚠️ API Error: {error}</span>}
            </>
          ) : (
            <>
              🇻🇳 <strong>VND Currency Pairs:</strong> USD/VND, EUR/VND, GBP/VND - 
              Tỷ giá VND thời gian thực quan trọng cho thị trường Việt Nam.
              {error && <span style={{color: '#ef4444'}}> ⚠️ Using fallback data</span>}
            </>
          )}
        </div>

        <div style={styles.chartContainer}>
          {isLoading ? (
            <div style={styles.loadingState}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🌐</div>
              <div>Đang tải dữ liệu từ API...</div>
              <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>
                api.exchangerate-api.com
              </div>
            </div>
          ) : error && data.length === 0 ? (
            <div style={styles.errorState}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>❌</div>
              <div><strong>API Connection Failed</strong></div>
              <div style={{fontSize: '14px', marginTop: '8px', maxWidth: '400px'}}>
                {error}
              </div>
              <button 
                onClick={fetchRealRates}
                style={{...styles.controlButton, ...styles.startButton, marginTop: '16px'}}
              >
                🔄 Retry
              </button>
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
              <strong>🌐 Data Source</strong><br/>
              API: exchangerate-api.com<br/>
              Fetch: Every 60 seconds<br/>
              {lastFetchTime && <>Last: {lastFetchTime.toLocaleTimeString('vi-VN')}</>}
            </div>

            <div style={styles.infoCard}>
              <strong>💰 Current Rates</strong><br/>
              {selectedChart === 'major' ? (
                <>
                  EUR/USD: {data[data.length - 1]?.EUR?.toFixed(4)}<br/>
                  GBP/USD: {data[data.length - 1]?.GBP?.toFixed(4)}<br/>
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
          </div>
        )}
      </div>
    </>
  );
}