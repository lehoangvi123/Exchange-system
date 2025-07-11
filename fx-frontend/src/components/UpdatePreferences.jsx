import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // <- thêm cái này

const UpdatePreferences = () => {
  const { t } = useTranslation(); // ✅ gọi bên trong component

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
      const res = await axios.put(`http://localhost:5000/api/users/preferences`, {
        email: form.email,
        preferences: {
          theme: form.theme,
          language: form.language,
          notifications: form.notifications     
        }
      });

      if (res.data.success) {
        setMessage(t('success'));
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
      <h3>{t('updateSettings')}</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <label>{t('email')}:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>{t('theme')}:</label>
        <select name="theme" value={form.theme} onChange={handleChange}>
          <option value="light">{t('light')}</option>
          <option value="dark">{t('dark')}</option>
        </select>

        <label>{t('language')}:</label>
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
          {t('notifications')}
        </label>

        <button type="submit" style={{ marginTop: '10px' }}>{t('submit')}</button>
      </form>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
  );
};



export default UpdatePreferences;
