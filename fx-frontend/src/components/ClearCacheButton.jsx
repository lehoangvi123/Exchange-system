import React from 'react';

export default function ClearCacheButton() {
  const handleClear = () => {
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

  return (
    <button onClick={handleClear}>
      🧹 Xoá Cache USD → VND
    </button>
  );
}
