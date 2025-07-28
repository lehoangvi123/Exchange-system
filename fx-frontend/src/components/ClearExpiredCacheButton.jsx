import React, { useState } from 'react';

export default function ClearExpiredCacheButton() {
  const [status, setStatus] = useState(null);

  const handleClear = async () => {
    setStatus('Đang xoá cache hết hạn...');
    try {
      const res = await fetch('https://backend-1-8b9z.onrender.com/api/rates/cache/clear-expired', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Đã xoá ${data.removed} cache hết hạn`);
      } else {
        setStatus('❌ Không thể xoá cache');
      }
    } catch (err) {
      console.error('Lỗi xoá cache:', err);
      setStatus('❌ Lỗi khi gọi API');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={handleClear}>🧹 Xoá cache hết hạn</button>
      {status && <p>{status}</p>}
    </div>
  );
}
