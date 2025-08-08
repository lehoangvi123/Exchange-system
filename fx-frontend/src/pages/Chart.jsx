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
  const [dataSource, setDataSource] = useState('loading'); // 'api', 'mock', 'hybrid'
  const intervalRef = useRef(null);
  const previousRatesRef = useRef(null);
  const fetchAttempts = useRef(0);

  // Base rates for mock data (realistic current rates)
  const baseRates = useRef({
    USD: 1,
    EUR: 0.9234,       // EUR/USD
    GBP: 0.7891,       // GBP/USD  
    JPY: 149.85,       // USD/JPY
    CNY: 7.2456,       // USD/CNY
    VND: 26158,        // USD/VND (as requested)
    AUD: 0.6789,       // AUD/USD
    CAD: 0.7234,       // CAD/USD
    CHF: 0.8945        // CHF/USD
  });

  useEffect(() => {
    // Start with mock data immediately
    generateInitialMockData();
    startAutoTracking();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const generateInitialMockData = () => {
    const initialData = [];
    const now = new Date();
    
    // Generate 10 initial data points spanning last 10 minutes
    for (let i = 9; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000); // Every minute
      const dataPoint = generateMockDataPoint(timestamp);
      initialData.push(dataPoint);
    }
    
    setData(initialData);
    setDataSource('mock');
    setIsLoading(false);
    console.log('📊 Generated initial mock data (10 points)');
  };

  const generateMockDataPoint = (timestamp = new Date()) => {
    const time = timestamp.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    // Create realistic variations
    const variation = () => (Math.random() - 0.5) * 0.002; // ±0.1% variation
    const trendFactor = Math.sin(timestamp.getTime() / 3600000) * 0.001; // Hourly trend

    const rates = baseRates.current;
    
    // Apply small realistic changes
    const mockPoint = {
      time,
      timestamp: timestamp.getTime(),
      
      // Major pairs
      USD: 1,
      EUR: parseFloat((rates.EUR * (1 + variation() + trendFactor)).toFixed(6)),
      GBP: parseFloat((rates.GBP * (1 + variation() + trendFactor)).toFixed(6)),
      JPY: parseFloat((rates.JPY * (1 + variation() + trendFactor)).toFixed(2)),
      CNY: parseFloat((rates.CNY * (1 + variation() + trendFactor)).toFixed(4)),
      
      // VND pairs
      USD_VND: Math.round(rates.VND * (1 + variation() + trendFactor)),
      EUR_VND: Math.round((rates.VND / rates.EUR) * (1 + variation() + trendFactor)),
      GBP_VND: Math.round((rates.VND / rates.GBP) * (1 + variation() + trendFactor)),
      
      // Additional pairs
      AUD: parseFloat((rates.AUD * (1 + variation())).toFixed(6)),
      CAD: parseFloat((rates.CAD * (1 + variation())).toFixed(6)),
      CHF: parseFloat((rates.CHF * (1 + variation())).toFixed(6)),
      
      dataSource: 'mock',
      isMock: true
    };

    // Update base rates gradually (market drift simulation)
    Object.keys(baseRates.current).forEach(key => {
      if (key !== 'USD') {
        baseRates.current[key] *= (1 + (Math.random() - 0.5) * 0.0001);
      }
    });

    return mockPoint;
  };

  const startAutoTracking = () => {
    setIsRunning(true);
    
    // Try to fetch real data immediately
    fetchRealRates();
    
    // Continue fetching every 10 seconds
    intervalRef.current = setInterval(() => {
      if (fetchAttempts.current < 3) {
        // Try API first few times
        fetchRealRates();
      } else {
        // After failed attempts, use hybrid approach
        fetchHybridData();
      }
    }, 10000);
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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

      // Process real API data
      const rates = apiData.rates;
      
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
        USD_VND: Math.round(rates.VND), // USD/VND
        EUR_VND: Math.round(rates.VND / rates.EUR), // EUR/VND
        GBP_VND: Math.round(rates.VND / rates.GBP), // GBP/VND
        
        // Additional useful rates
        AUD: parseFloat((1 / rates.AUD).toFixed(6)),
        CAD: parseFloat((1 / rates.CAD).toFixed(6)),
        CHF: parseFloat((1 / rates.CHF).toFixed(6)),
        
        // Metadata
        apiTimestamp: apiData.date,
        dataSource: 'api',
        isReal: true
      };

      // Update base rates with real data for better mock generation
      Object.keys(baseRates.current).forEach(key => {
        if (newPoint[key] !== undefined) {
          baseRates.current[key] = newPoint[key];
        }
      });

      setData(prev => [...prev, newPoint].slice(-50));
      setLastFetchTime(now);
      setDataSource('api');
      setIsLoading(false);
      fetchAttempts.current = 0; // Reset on success
      
      console.log(`✅ Real API data fetched at ${time} - USD/VND: ${newPoint.USD_VND}`);
      
    } catch (err) {
      fetchAttempts.current++;
      console.warn(`⚠️ API fetch failed (attempt ${fetchAttempts.current}):`, err.message);
      
      if (fetchAttempts.current >= 3) {
        setError(`API unavailable after ${fetchAttempts.current} attempts`);
        setDataSource('hybrid');
      }
      
      // Always fallback to mock data
      const mockPoint = generateMockDataPoint();
      setData(prev => [...prev, mockPoint].slice(-50));
      setLastFetchTime(new Date());
      setIsLoading(false);
    }
  };

  const fetchHybridData = () => {
    // Generate mock data but try to keep it realistic
    const mockPoint = generateMockDataPoint();
    
    // Add some indicator that this is hybrid mode
    mockPoint.dataSource = 'hybrid';
    mockPoint.isHybrid = true;
    
    setData(prev => [...prev, mockPoint].slice(-50));
    setLastFetchTime(new Date());
    
    console.log(`🔄 Hybrid data generated at ${mockPoint.time}`);
    
    // Periodically retry API
    if (Math.random() < 0.1) { // 10% chance to retry API
      fetchRealRates();
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      const sourceIcon = data?.isReal ? '🌐' : data?.isHybrid ? '🔄' : '📊';
      const sourceText = data?.isReal ? 'Real API Data' : data?.isHybrid ? 'Hybrid Data' : 'Mock Data';
      
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
          <div style={{ 
            marginTop: '8px', 
            paddingTop: '8px', 
            borderTop: '1px solid #e5e7eb',
            fontSize: '11px',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>{sourceIcon}</span>
            <span>{sourceText}</span>
          </div>
          {data?.apiTimestamp && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
              📅 API Date: {data.apiTimestamp}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getDataSourceStatus = () => {
    switch (dataSource) {
      case 'api':
        return { icon: '🌐', text: 'Real API', color: '#10b981', desc: 'Live data from exchangerate-api.com' };
      case 'hybrid':
        return { icon: '🔄', text: 'Hybrid Mode', color: '#f59e0b', desc: 'Mock data + periodic API retries' };
      case 'mock':
        return { icon: '📊', text: 'Mock Data', color: '#8b5cf6', desc: 'Simulated realistic market data' };
      default:
        return { icon: '⏳', text: 'Loading', color: '#6b7280', desc: 'Initializing data source' };
    }
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
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
    },
    dataSourceIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid #e5e7eb'
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

  const sourceStatus = getDataSourceStatus();

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
                  {isRunning ? '🟢 LIVE' : '🔴 STOPPED'} • 10s
                </span>
              </div>

              <div style={{
                ...styles.dataSourceIndicator,
                backgroundColor: sourceStatus.color + '20',
                color: sourceStatus.color,
                borderColor: sourceStatus.color + '40'
              }}>
                <span>{sourceStatus.icon}</span>
                <span>{sourceStatus.text}</span>
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
              Hybrid data combining real API and mock simulation. {sourceStatus.desc}.
              {error && <span style={{color: '#ef4444'}}> ⚠️ {error}</span>}
            </>
          ) : (
            <>
              🇻🇳 <strong>VND Currency Pairs:</strong> USD/VND (26,158), EUR/VND, GBP/VND - 
              Real-time VND rates crucial for Vietnamese markets. {sourceStatus.desc}.
              {error && <span style={{color: '#f59e0b'}}> ⚠️ Using fallback data</span>}
            </>
          )}
        </div>

        <div style={styles.chartContainer}>
          {isLoading ? (
            <div style={styles.loadingState}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🌐</div>
              <div>Khởi tạo dữ liệu...</div>
              <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>
                Mock data ready • API connecting...
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
              <strong>{sourceStatus.icon} Data Source</strong><br/>
              Mode: {sourceStatus.text}<br/>
              Fetch: Every 10 seconds<br/>
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

            <div style={styles.infoCard}>
              <strong>🔄 Data Quality</strong><br/>
              API Success: {Math.max(0, 100 - fetchAttempts.current * 25)}%<br/>
              Real Points: {data.filter(d => d.isReal).length}<br/>
              Mock Points: {data.filter(d => d.isMock || d.isHybrid).length}
            </div>
          </div>
        )}
      </div>
    </>
  );
}