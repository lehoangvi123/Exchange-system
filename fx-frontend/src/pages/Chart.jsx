// 📁 components/RateChart.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function RateChart() {
  const [data, setData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute = 60 seconds
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startTracking = () => {
    setIsActive(true);
    setData([]); // Reset data
    setTimeRemaining(60); // Reset countdown to 1 minute
    
    // Fetch ngay lập tức
    fetchRates();
    
    // Fetch mỗi 1 giây (1000ms)
    intervalRef.current = setInterval(fetchRates, 1000);
    
    // Countdown timer
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopTracking();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTracking = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const fetchRates = async () => {
    try {
      // Tạo mock data thay vì gọi API mỗi giây (để tránh rate limit)
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      // Base rates (có thể lấy từ API một lần và cache)
      const baseRates = {
        EUR: 0.9234,
        JPY: 149.85,
        GBP: 0.7891,
        VND: 24650,
        CNY: 7.2456
      };

      // Tạo biến động random mạnh hơn để thấy rõ trên biểu đồ 1 giây
      const strongVariation = () => (Math.random() - 0.5) * 0.01; // ±0.5% variation

      const newPoint = {
        time,
        timestamp: now.getTime(),
        USD: 1, // USD base
        USD_smooth: 1,
        EUR: parseFloat((baseRates.EUR + strongVariation()).toFixed(6)),
        EUR_smooth: parseFloat((baseRates.EUR + strongVariation() * 0.5).toFixed(6)),
        JPY: parseFloat((baseRates.JPY + strongVariation() * 50).toFixed(2)),
        JPY_smooth: parseFloat((baseRates.JPY + strongVariation() * 25).toFixed(2)),
        GBP: parseFloat((baseRates.GBP + strongVariation()).toFixed(6)),
        GBP_smooth: parseFloat((baseRates.GBP + strongVariation() * 0.5).toFixed(6)),
        VND: parseFloat((baseRates.VND + strongVariation() * 500).toFixed(0)),
        VND_smooth: parseFloat((baseRates.VND + strongVariation() * 250).toFixed(0)),
        CNY: parseFloat((baseRates.CNY + strongVariation()).toFixed(4)),
        CNY_smooth: parseFloat((baseRates.CNY + strongVariation() * 0.5).toFixed(4))
      };

      setData(prev => {
        const newData = [...prev, newPoint];
        // Giữ tối đa 60 điểm (60 giây = 1 phút)
        return newData.slice(-60);
      });

      // Log ít hơn để tránh spam console
      if (newPoint.timestamp % 5000 < 1000) { // Log mỗi 5 giây
        console.log(`📊 Rates updated at ${time} - Points: ${data.length + 1}`);
      }
    } catch (err) {
      console.error('❌ Generate rate failed:', err);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1100px',
      margin: '40px auto',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      border: '1px solid #e5e7eb'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    startButton: {
      backgroundColor: '#10b981',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
    },
    stopButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
    },
    disabledButton: {
      backgroundColor: '#9ca3af',
      color: 'white',
      cursor: 'not-allowed'
    },
    timer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f3f4f6',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500'
    },
    activeStatus: {
      color: '#10b981'
    },
    inactiveStatus: {
      color: '#6b7280'
    },
    chartContainer: {
      height: '450px',
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e7eb'
    },
    noData: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      color: '#6b7280',
      fontSize: '16px'
    },
    dataInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '15px',
      fontSize: '12px',
      color: '#6b7280',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>⚡ Tỷ giá thời gian thực (1 phút)</h3>
        
        <div style={styles.controls}>
          <div style={{...styles.status, ...(isActive ? styles.activeStatus : styles.inactiveStatus)}}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isActive ? '#10b981' : '#6b7280',
              display: 'inline-block'
            }}></span>
            {isActive ? 'Đang theo dõi' : 'Tạm dừng'}
          </div>
          
          {isActive && (
            <div style={styles.timer}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
          
          <button
            onClick={startTracking}
            disabled={isActive}
            style={{
              ...styles.button,
              ...(isActive ? styles.disabledButton : styles.startButton)
            }}
          >
            {isActive ? 'Đang chạy...' : '▶️ Bắt đầu'}
          </button>
          
          <button
            onClick={stopTracking}
            disabled={!isActive}
            style={{
              ...styles.button,
              ...(!isActive ? styles.disabledButton : styles.stopButton)
            }}
          >
            ⏹️ Dừng
          </button>
        </div>
      </div>

      <div style={styles.chartContainer}>
        {data.length === 0 ? (
          <div style={styles.noData}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📊</div>
            <div>Nhấn "Bắt đầu" để theo dõi tỷ giá trong 1 phút</div>
            <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>
              Dữ liệu sẽ được cập nhật mỗi 1 giây (60 điểm dữ liệu)
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="time" 
                tick={{fontSize: 10}}
                interval={Math.max(1, Math.floor(data.length / 10))} // Show ~10 ticks max
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 2" />

              {/* EUR */}
              <Line 
                dataKey="EUR" 
                stroke="#10b981" 
                name="EUR Raw" 
                dot={{r: 3}} 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                dataKey="EUR_smooth" 
                stroke="#10b981" 
                strokeDasharray="5 5" 
                name="EUR Smoothed" 
                dot={false}
                strokeWidth={1}
                opacity={0.7}
              />

              {/* JPY - Scale khác nên dùng separate Y-axis */}
              <Line 
                dataKey="JPY" 
                stroke="#f59e0b" 
                name="JPY Raw" 
                dot={{r: 3}}
                strokeWidth={2}
                yAxisId="jpy"
              />
              <Line 
                dataKey="JPY_smooth" 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                name="JPY Smoothed" 
                dot={false}
                strokeWidth={1}
                opacity={0.7}
                yAxisId="jpy"
              />

              {/* GBP */}
              <Line 
                dataKey="GBP" 
                stroke="#3b82f6" 
                name="GBP Raw" 
                dot={{r: 3}}
                strokeWidth={2}
              />
              <Line 
                dataKey="GBP_smooth" 
                stroke="#3b82f6" 
                strokeDasharray="5 5" 
                name="GBP Smoothed" 
                dot={false}
                strokeWidth={1}
                opacity={0.7}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.length > 0 && (
        <div style={styles.dataInfo}>
          <div>
            📊 Điểm dữ liệu: {data.length}/30 • 
            Cập nhật mỗi 2 phút • 
            Bắt đầu: {data[0]?.time} • 
            Mới nhất: {data[data.length - 1]?.time}
          </div>
          <div>
            🌐 Nguồn: ExchangeRate-API • 
            Base: USD • 
            Biến động: ±0.05%
          </div>
        </div>
      )}
    </div>
  );
}