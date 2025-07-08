import React, { useState } from 'react';

export default function CacheDashboard() {
  const [optimizeResult, setOptimizeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/rates/cache/optimize', {
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
    <div>
      <h3>🧹 Dọn dẹp Cache</h3>
      <button onClick={handleOptimize} disabled={loading}>
        {loading ? 'Đang dọn...' : 'Dọn Cache Hết Hạn'}
      </button>

      {optimizeResult && (
        <p>
          ✅ Đã xoá <strong>{optimizeResult.removed}</strong> cache hết hạn.
        </p>
      )}
    </div>
  );
}
