import React, { useState } from 'react';

const SaveRateForm = () => {
  const [rates, setRates] = useState({ AUD: '', BGN: '', BRL: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setRates({ ...rates, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-1-8b9z.onrender.com/api/rates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AUD: parseFloat(rates.AUD),
          BGN: parseFloat(rates.BGN),
          BRL: parseFloat(rates.BRL),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('💾 Tỷ giá đã được lưu thành công!');
      } else {
        setMessage(`❌ Thất bại: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ Đã xảy ra lỗi khi gửi yêu cầu');
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '24px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: '#f9fafb',
      fontFamily: 'Segoe UI, sans-serif',
    },
    heading: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      textAlign: 'center',
      color: '#1f2937',
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      fontWeight: '500',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginTop: '4px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    button: {
      marginTop: '20px',
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>💱 Nhập tỷ giá và lưu</h3>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          AUD:
          <input
            style={styles.input}
            type="number"
            name="AUD"
            value={rates.AUD}
            onChange={handleChange}
            step="0.0001"
            required
          />
        </label>
        <label style={styles.label}>
          BGN:
          <input
            style={styles.input}
            type="number"
            name="BGN"
            value={rates.BGN}
            onChange={handleChange}
            step="0.0001"
            required
          />
        </label>
        <label style={styles.label}>
          BRL:
          <input
            style={styles.input}
            type="number"
            name="BRL"
            value={rates.BRL}
            onChange={handleChange}
            step="0.0001"
            required
          />
        </label>
        <button style={styles.button} type="submit">
          💾 Lưu tỷ giá
        </button>
      </form>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

export default SaveRateForm;
