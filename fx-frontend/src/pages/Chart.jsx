// 📁 components/RateChart.jsx
import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function RateChart() {
  const [data, setData] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Bắt đầu tự động khi component mount
    startAutoTracking();
    
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startAutoTracking = () => {
    setIsRunning(true);
    
    // Fetch ngay lập tức
    fetchRates();
    
    // Fetch mỗi 10 giây
    intervalRef.current = setInterval(fetchRates, 10000);
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

      // Tạo biến động random mạnh hơn để thấy rõ trên biểu đồ
      const strongVariation = () => (Math.random() - 0.5) * 0.008; // ±0.4% variation

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
        // Giữ tối đa 100 điểm để có đủ dữ liệu hiển thị
        return newData.slice(-100);
      });

      // Log ít hơn để tránh spam console
      if (newPoint.timestamp % 30000 < 10000) { // Log mỗi 30 giây
        console.log(`📊 Rates updated at ${time} - Points: ${data.length + 1}`);
      }
    } catch (err) {
      console.error('❌ Generate rate failed:', err);
    }
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
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#10b981'
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f0fdf4',
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid #bbf7d0'
    },
    pulsingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      animation: 'pulse 2s infinite'
    },
    chartContainer: {
      height: '450px',
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e7eb'
    },
    loadingState: {
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
      paddingTop: '15px',
      flexWrap: 'wrap',
      gap: '10px'
    }
  };

  // CSS animation for pulsing dot
  const pulseKeyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>⚡ Tỷ giá thời gian thực</h3>
          
          <div style={styles.liveIndicator}>
            <div style={styles.pulsingDot}></div>
            <span style={{color: '#059669', fontWeight: '600'}}>
              🔴 LIVE • Cập nhật mỗi 10 giây
            </span>
          </div>
        </div>

        <div style={styles.chartContainer}>
          {data.length === 0 ? (
            <div style={styles.loadingState}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>📊</div>
              <div>Đang tải dữ liệu tỷ giá...</div>
              <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>
                Biểu đồ sẽ hiển thị trong vài giây
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="time" 
                  tick={{fontSize: 10}}
                  interval={Math.max(1, Math.floor(data.length / 8))} // Show ~8 ticks max
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
                  name="EUR/USD" 
                  dot={false} 
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
                  opacity={0.6}
                />

                {/* GBP */}
                <Line 
                  dataKey="GBP" 
                  stroke="#3b82f6" 
                  name="GBP/USD" 
                  dot={false}
                  strokeWidth={2}
                />
                <Line 
                  dataKey="GBP_smooth" 
                  stroke="#3b82f6" 
                  strokeDasharray="5 5" 
                  name="GBP Smoothed" 
                  dot={false}
                  strokeWidth={1}
                  opacity={0.6}
                />

                {/* JPY - Ẩn để tránh scale khác biệt quá lớn */}
                {/* Có thể thêm toggle để hiển thị JPY trên chart riêng */}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {data.length > 0 && (
          <div style={styles.dataInfo}>
            <div>
              📊 Điểm dữ liệu: {data.length}/100 • 
              Bắt đầu: {data[0]?.time} • 
              Mới nhất: {data[data.length - 1]?.time}
            </div>
            <div>
              🌐 Nguồn: Mock Data • 
              Base: USD • 
              Biến động: ±0.4%
            </div>
          </div>
        )}
      </div>
    </>
  );
}