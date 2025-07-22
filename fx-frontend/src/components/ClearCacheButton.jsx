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
    <div style={styles.wrapper}>
      <button onClick={handleClear} style={styles.button}>
        🧹 Xoá Cache USD → VND
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    textAlign: 'center',
    marginTop: '30px'
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
  buttonHover: {
    backgroundColor: '#2c5282'
  }
};
