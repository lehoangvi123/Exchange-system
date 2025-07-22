import React, { useState } from 'react';

const LogConversionForm = () => {
  const [form, setForm] = useState({
    from: 'USD',
    to: 'VND',
    amount: 100,
    userId: ''
  });

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/rates/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: form.from,
          to: form.to,
          amount: parseFloat(form.amount),
          userId: form.userId || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
        setMessage('✅ Giao dịch đã được ghi lại thành công!');
      } else {
        setMessage(`❌ Lỗi: ${data.message || 'Không thể ghi log'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Lỗi khi gửi yêu cầu');
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '450px',
      margin: '30px auto',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      backgroundColor: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    heading: {
      fontSize: '20px',
      marginBottom: '15px',
      fontWeight: 'bold',
      color: '#111827'
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      color: '#374151',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '8px 10px',
      marginBottom: '15px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s ease'
    },
    message: {
      marginTop: '15px',
      fontSize: '14px'
    },
    result: {
      fontWeight: 'bold',
      marginTop: '10px',
      color: '#10b981'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>🔁 Giao dịch quy đổi</h3>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          Từ (from):
          <input type="text" name="from" value={form.from} onChange={handleChange} style={styles.input} required />
        </label>
        <label style={styles.label}>
          Đến (to):
          <input type="text" name="to" value={form.to} onChange={handleChange} style={styles.input} required />
        </label>
        <label style={styles.label}>
          Số lượng (amount):
          <input type="number" name="amount" value={form.amount} onChange={handleChange} style={styles.input} required />
        </label>
        <label style={styles.label}>
          User ID (tùy chọn):
          <input type="text" name="userId" value={form.userId} onChange={handleChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.button}>Gửi giao dịch</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      {result && (
        <p style={styles.result}>💰 Kết quả chuyển đổi: <strong>{result}</strong></p>
      )}
    </div>
  );
};

export default LogConversionForm;
