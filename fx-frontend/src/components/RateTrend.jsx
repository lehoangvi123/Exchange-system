import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const RateTrend = ({ pair = "USD_VND", period = "30d" }) => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/rates/trend/${pair}/${period}`)
      .then(res => {
        if (res.data.success) {
          setTrendData(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Lỗi khi lấy xu hướng:", err);
        setLoading(false);
      });
  }, [pair, period]);

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>⏳ Đang tải dữ liệu xu hướng...</p>;
  if (!trendData) return <p style={{ textAlign: 'center', color: 'red' }}>⚠️ Không có dữ liệu.</p>;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '900px',
        margin: '40px auto',
        backgroundColor: '#fefefe',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ marginBottom: '10px', textAlign: 'center', color: '#333' }}>
        📊 Phân Tích Xu Hướng Tỷ Giá
      </h2>

      <div style={{ marginBottom: '12px', fontSize: '15px', color: '#444', lineHeight: '1.5' }}>
        <p><strong>Cặp:</strong> {trendData.pair}</p>
        <p><strong>Khoảng thời gian:</strong> {trendData.period}</p>
        <p><strong>Xu hướng:</strong> <span style={{ color: trendData.trend === 'Tăng' ? 'green' : trendData.trend === 'Giảm' ? 'red' : 'gray' }}>{trendData.trend}</span></p>
      </div>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData.values}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(str) => new Date(str).toLocaleDateString()}
              style={{ fontSize: '12px' }}
            />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#8884d8"
              strokeWidth={2}
              name="Tỷ giá"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RateTrend;
