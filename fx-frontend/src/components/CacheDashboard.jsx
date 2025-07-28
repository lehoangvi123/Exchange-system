import React, { useState } from 'react';

export default function CacheDashboard() {
  const [optimizeResult, setOptimizeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = () => {
    setLoading(true);
    fetch('https://backend-1-8b9z.onrender.com/api/rates/cache/optimize', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        setOptimizeResult(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi tối ưu cache:', err);
        setLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧹 Dọn dẹp Cache Hệ Thống</h2>
      <p style={styles.subtext}>Tự động xoá các cache đã hết hạn để hệ thống nhẹ và nhanh hơn.</p>

      <button
        onClick={handleOptimize}
        disabled={loading}
        style={{
          ...styles.button,
          backgroundColor: loading ? '#999' : '#2f855a',
          cursor: loading ? 'not-allowed' : 'pointer'
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
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#f7fafc',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
  },
  heading: {
    fontSize: '24px',
    color: '#2d3748',
    marginBottom: '10px'
  },
  subtext: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '20px'
  },
  button: {
    backgroundColor: '#2f855a',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  resultBox: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#2f855a',
    backgroundColor: '#e6fffa',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #b2f5ea'
  }
};
