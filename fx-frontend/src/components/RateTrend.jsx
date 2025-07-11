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

  if (loading) return <p>⏳ Đang tải dữ liệu xu hướng...</p>;
  if (!trendData) return <p>⚠️ Không có dữ liệu.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Phân Tích Xu Hướng Tỷ Giá</h2>
      <p><strong>Cặp:</strong> {trendData.pair}</p>
      <p><strong>Khoảng thời gian:</strong> {trendData.period}</p>
      <p><strong>Xu hướng:</strong> {trendData.trend}</p>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData.values}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
            <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Tỷ giá" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RateTrend;
