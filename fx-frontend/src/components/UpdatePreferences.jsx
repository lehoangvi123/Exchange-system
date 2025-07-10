import React, { useState } from 'react';
import axios from 'axios';

const UpdatePreferences = () => {
  const [form, setForm] = useState({
    email: '',
    theme: 'light',
    language: 'en',
    notifications: true
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/users/preferences', {
        email: form.email,
        preferences: {
          theme: form.theme,
          language: form.language,
          notifications: form.notifications
        }
      });

      if (res.data.success) {
        setMessage('✅ Cập nhật cài đặt thành công!');
      } else {
        setMessage('❌ Cập nhật thất bại.');
      }
    } catch (err) {
      console.error('Lỗi:', err.message);
      setMessage('❌ Lỗi kết nối.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>⚙️ Cập nhật Cài đặt Người dùng</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Giao diện (Theme):</label>
        <select name="theme" value={form.theme} onChange={handleChange}>
          <option value="light">Sáng</option>
          <option value="dark">Tối</option>
        </select>

        <label>Ngôn ngữ (Language):</label>
        <select name="language" value={form.language} onChange={handleChange}>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={form.notifications}
            onChange={handleChange}
          />
          Nhận thông báo
        </label>

        <button type="submit" style={{ marginTop: '10px' }}>Cập nhật</button>
      </form>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default UpdatePreferences;
