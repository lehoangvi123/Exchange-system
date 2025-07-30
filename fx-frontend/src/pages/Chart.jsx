// 📁 components/RateChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function RateChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(fetchRates, 43200000); // 12 tiếng
    fetchRates();
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rates/current');
      const time = new Date().toLocaleTimeString();

      const smoothed = res.data.rates;
      const original = res.data.original;

      const newPoint = {
        time,
        USD: original['USD'],
        USD_smooth: smoothed['USD'],
        EUR: original['EUR'],
        EUR_smooth: smoothed['EUR'],
        JPY: original['JPY'],
        JPY_smooth: smoothed['JPY']
      };

      setData(prev => [...prev.slice(-19), newPoint]); // giữ 20 điểm gần nhất
    } catch (err) {
      console.error('Fetch rate failed', err);
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '900px',
      height: 440,
      margin: '40px auto',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#1e293b',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📈 Tỷ giá thời gian thực</h3>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />

          {/* USD */}
          <Line dataKey="USD" stroke="#1f77b4" name="USD Raw" dot={false} />
          <Line dataKey="USD_smooth" stroke="#1f77b4" strokeDasharray="5 5" name="USD Smoothed" dot={false} />

          {/* EUR */}
          <Line dataKey="EUR" stroke="#2ca02c" name="EUR Raw" dot={false} />
          <Line dataKey="EUR_smooth" stroke="#2ca02c" strokeDasharray="5 5" name="EUR Smoothed" dot={false} />

          {/* JPY */}
          <Line dataKey="JPY" stroke="#ff7f0e" name="JPY Raw" dot={false} />
          <Line dataKey="JPY_smooth" stroke="#ff7f0e" strokeDasharray="5 5" name="JPY Smoothed" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div> 

    
  );
}
