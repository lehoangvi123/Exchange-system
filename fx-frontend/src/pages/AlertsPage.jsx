// src/pages/AlertsAndDashboardPage.jsx
import React, { useState, useEffect } from 'react';

// 👇 Dummy CreateAlert (nếu bạn đã có sẵn thì import từ component của bạn)
const CreateAlert = () => (
  <div style={{ marginBottom: '40px' }}>
    <h2>🛎️ Tạo Cảnh Báo Tỷ Giá</h2>
    <p>Component CreateAlert ở đây...</p>
  </div>
);

// 📦 CacheTools Component (ClearCache, ClearExpired, Warmup)
const CacheTools = () => {
  const [expiredStatus, setExpiredStatus] = useState(null);

  const handleClearSpecific = () => {
    fetch('http://localhost:5000/api/rates/cache/invalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'USD', to: 'VND' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`✅ Đã xoá cache: ${data.message}`);
        } else {
          alert(`❌ Lỗi: ${data.message}`);
        }
      })
      .catch(err => console.error('❌ Lỗi gọi API cache:', err));
  };

  const handleClearExpired = async () => {
    setExpiredStatus('Đang xoá cache hết hạn...');
    try {
      const res = await fetch('http://localhost:5000/api/rates/cache/clear-expired', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setExpiredStatus(`✅ Đã xoá ${data.removed} cache hết hạn`);
      } else {
        setExpiredStatus('❌ Không thể xoá cache');
      }
    } catch (err) {
      console.error('Lỗi xoá cache:', err);
      setExpiredStatus('❌ Lỗi khi gọi API');
    }
  };

  const handleWarmup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rates/cache/warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairs: ['AUD_CAD', 'AUD_BRL'] })
      });
      const data = await res.json();
      alert(`🔥 Đã warmup cache cho ${data.success ? data.warmed?.length || 0 : 0} cặp`);
    } catch (err) {
      console.error('❌ Lỗi gọi warmupCache:', err);
      alert('❌ Lỗi khi gọi API warmup');
    }
  };

  return (
    <div style={styles.section}>
      <h2>🧰 Công cụ Cache</h2>
      <button onClick={handleClearSpecific} style={styles.button}>
        🧹 Xoá Cache USD → VND
      </button>
      <button onClick={handleClearExpired} style={{ ...styles.button, marginTop: '10px' }}>
        🧹 Xoá cache hết hạn
      </button>
      {expiredStatus && <p style={styles.status}>{expiredStatus}</p>}
      <button onClick={handleWarmup} style={{ ...styles.button, marginTop: '10px' }}>
        🔥 Warmup Cache
      </button>
    </div>
  );
};

// 🧹 CacheDashboard Component (có thống kê và nút Optimize)
const CacheDashboard = () => {
  const [optimizeResult, setOptimizeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleOptimize = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/rates/cache/optimize', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        setOptimizeResult(data);
        setLoading(false);
        fetchStats();
      })
      .catch(err => {
        console.error('❌ Lỗi khi tối ưu cache:', err);
        setLoading(false);
      });
  };

  const fetchStats = () => {
    fetch('http://localhost:5000/api/rates/cache/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={styles.section}>
      <h2>📊 Thống kê Cache</h2>
      {!stats ? (
        <p>🔄 Đang tải thống kê cache...</p>
      ) : (
        <>
          <p><strong>Tổng cộng:</strong> {stats.total}</p>
          <p><strong>Hoạt động:</strong> {stats.active}</p>
          <p><strong>Hết hạn:</strong> {stats.expired}</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Cặp tiền tệ</th>
                <th style={thStyle}>Tỷ giá</th>
                <th style={thStyle}>Hết hạn lúc</th>
                <th style={thStyle}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.entries.map((entry, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{entry.currencyPair}</td>
                  <td style={tdStyle}>{Number(entry.rate).toFixed(6)}</td>
                  <td style={tdStyle}>{new Date(entry.expiry).toLocaleString()}</td>
                  <td style={{ ...tdStyle, color: entry.status === 'expired' ? 'red' : 'green' }}>
                    {entry.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button
        onClick={handleOptimize}
        disabled={loading}
        style={{
          ...styles.button,
          backgroundColor: loading ? '#999' : '#2f855a',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '20px'
        }}
      >
        {loading ? '⏳ Đang dọn...' : '🧽 Dọn Cache Hết Hạn'}
      </button>

      {optimizeResult && (
        <div style={styles.resultBox}>
          ✅ Đã xoá <strong>{optimizeResult.removed}</strong> cache hết hạn.
        </div>
      )}
    </div>
  );
};

// 📢 AlertsAndDashboardPage (trang gộp)
export default function AlertsAndDashboardPage() {
  return (
    <div style={styles.container}>
      <h1>📢 Quản lý Cảnh báo & Cache</h1>
      <CreateAlert />
      <hr />
      <CacheDashboard />
      <hr />
      <CacheTools />
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: '960px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#f7fafc',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
  },
  section: {
    marginTop: '40px',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  resultBox: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#2f855a',
    backgroundColor: '#e6fffa',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #b2f5ea'
  },
  status: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#333'
  }
};

const thStyle = {
  padding: '10px',
  borderBottom: '2px solid #ccc',
  textAlign: 'center',
  color: '#555'
};

const tdStyle = {
  padding: '8px',
  textAlign: 'center',
  color: '#333',
  borderBottom: '1px solid #eee'
};
