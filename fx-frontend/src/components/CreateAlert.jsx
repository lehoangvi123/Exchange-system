import React, { useState } from 'react';
import axios from 'axios';

const CreateAlert = () => {
  const [form, setForm] = useState({
    userId: '',
    from: '',
    to: '',
    targetRate: '',
    direction: 'above'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/alerts', form);
      if (res.data.success) {
        setMessage('✅ Cảnh báo đã được tạo thành công!');
      } else {
        setMessage('❌ Không thể tạo cảnh báo.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi:', err.message);
      setMessage('❌ Lỗi kết nối tới server.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📢 Tạo Cảnh Báo Tỷ Giá</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div>
          <label>User ID:</label>
          <input type="text" name="userId" value={form.userId} onChange={handleChange} required />
        </div>

        <div>
          <label>Từ (From):</label>
          <input type="text" name="from" value={form.from} onChange={handleChange} required />
        </div>

        <div>
          <label>Đến (To):</label>
          <input type="text" name="to" value={form.to} onChange={handleChange} required />
        </div>

        <div>
          <label>Ngưỡng tỷ giá (Target Rate):</label>
          <input type="number" name="targetRate" value={form.targetRate} onChange={handleChange} required />
        </div>

        <div>
          <label>Loại cảnh báo:</label>
          <select name="direction" value={form.direction} onChange={handleChange}>
            <option value="above">Tỷ giá cao hơn</option>
            <option value="below">Tỷ giá thấp hơn</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Tạo cảnh báo</button>
      </form>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default CreateAlert;
