// src/components/PopularPairs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PopularPairs = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularPairs = async () => {
      try {
        const res = await axios.get('/api/popular-pairs');
        console.log('📊 Popular pairs:', res.data); // DEBUG LOG
        setPairs(res.data); // expected: [{ pair: 'USD_VND', count: 15 }, ...]
      } catch (err) {
        console.error('❌ Lỗi khi lấy top cặp tiền:', err.message);
        setError('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPairs();
  }, []);

  if (loading) return <div>⏳ Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '1rem', background: '#f0f8ff', borderRadius: '8px' }}>
      <h3>🔝 Top 10 cặp tiền phổ biến</h3>
      {pairs.length === 0 ? (
        <p>Chưa có dữ liệu để hiển thị.</p>
      ) : (
        <ol>
          {pairs.map((item, index) => (
            <li key={index}>
              {item.pair} — <strong>{item.count}</strong> lần chuyển đổi
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default PopularPairs;
