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
      const response = await fetch('http://localhost:5000/api/rates/save', {
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

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>💱 Nhập tỷ giá và lưu</h3>
      <form onSubmit={handleSubmit}>
        <label>
          AUD:
          <input type="number" name="AUD" value={rates.AUD} onChange={handleChange} step="0.0001" required />
        </label>
        <br />
        <label>
          BGN:
          <input type="number" name="BGN" value={rates.BGN} onChange={handleChange} step="0.0001" required />
        </label>
        <br />
        <label>
          BRL:
          <input type="number" name="BRL" value={rates.BRL} onChange={handleChange} step="0.0001" required />
        </label>
        <br />
        <button type="submit">Lưu tỷ giá</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default SaveRateForm;
