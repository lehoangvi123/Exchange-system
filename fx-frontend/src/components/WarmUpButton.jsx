// 📁 components/WarmupButton.js
import React from 'react';

export default function WarmupButton() {
  const handleWarmup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rates/cache/warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairs: ['AUD_CAD', 'AUD_BRL'] })
      });
      const data = await res.json();
      console.log('🔥 Cache warmed:', data);
    } catch (err) {
      console.error('❌ Lỗi gọi warmupCache:', err);
    }
  };

  return (
    <button onClick={handleWarmup}>🔥 Warmup Cache</button>
  );
}





