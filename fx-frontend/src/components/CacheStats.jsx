import React, { useEffect, useState } from 'react';

export default function CacheStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('https://backend-1-8b9z.onrender.com/api/rates/cache/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(console.error);
  }, []);

  if (!stats) {
    return (
      <p style={{
        textAlign: 'center',
        padding: '20px',
        fontSize: '16px',
        color: '#666'
      }}>
        🔄 Đang tải thống kê cache...
      </p>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '900px',
      margin: '40px auto',
      backgroundColor: '#fefefe',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        📊 Thống kê Cache
      </h2>

      <div style={{ fontSize: '15px', color: '#444', marginBottom: '20px' }}>
        <p><strong>Tổng cộng:</strong> {stats.total}</p>
        <p><strong>Hoạt động:</strong> <span style={{ color: 'green' }}>{stats.active}</span></p>
        <p><strong>Hết hạn:</strong> <span style={{ color: 'red' }}>{stats.expired}</span></p>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th style={thStyle}>Cặp tiền tệ</th>
            <th style={thStyle}>Tỷ giá</th>
            <th style={thStyle}>Hết hạn lúc</th>
            <th style={thStyle}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {stats.entries.map((entry, index) => (
            <tr key={index} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{entry.currencyPair}</td>
              <td style={tdStyle}>{Number(entry.rate).toFixed(6)}</td>
              <td style={tdStyle}>{new Date(entry.expiry).toLocaleString()}</td>
              <td style={{
                ...tdStyle,
                fontWeight: 'bold',
                color: entry.status === 'active' ? 'green' : 'red'
              }}>
                {entry.status.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '10px',
  borderBottom: '2px solid #ccc',
  textAlign: 'center',
  color: '#555'
};

const tdStyle = {
  padding: '8px',
  color: '#333'
};
