// 📁 fx-frontend/src/components/CacheStats.js

import React, { useEffect, useState } from 'react';

export default function CacheStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/rates/cache/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(console.error);
  }, []);

  if (!stats) return <p>🔄 Đang tải thống kê cache...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Thống kê Cache</h2>
      <p><strong>Tổng cộng:</strong> {stats.total}</p>
      <p><strong>Hoạt động:</strong> {stats.active}</p>
      <p><strong>Hết hạn:</strong> {stats.expired}</p>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Cặp tiền tệ</th>
            <th>Tỷ giá</th>
            <th>Hết hạn lúc</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {stats.entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.currencyPair}</td>
              <td>{Number(entry.rate).toFixed(6)}</td>
              <td>{new Date(entry.expiry).toLocaleString()}</td>
              <td style={{ color: entry.status === 'active' ? 'green' : 'red' }}>
                {entry.status.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
