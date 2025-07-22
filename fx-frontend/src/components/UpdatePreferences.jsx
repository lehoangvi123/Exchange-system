import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UpdatePreferences = () => {
  const { t } = useTranslation();

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

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '40px auto',
      padding: '24px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#fefefe',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      fontFamily: 'Segoe UI, sans-serif'
    },
    heading: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#1f2937'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '15px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginBottom: '16px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '15px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginBottom: '16px',
      backgroundColor: '#fff'
    },
    checkboxWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px'
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    message: {
      marginTop: '15px',
      fontSize: '14px',
      color: 'green',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>{t('updateSettings')}</h3>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>{t('email')}:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>{t('theme')}:</label>
        <select
          name="theme"
          value={form.theme}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="light">{t('light')}</option>
          <option value="dark">{t('dark')}</option>
        </select>

        <label style={styles.label}>{t('language')}:</label>
        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>

        <div style={styles.checkboxWrapper}>
          <input
            type="checkbox"
            name="notifications"
            checked={form.notifications}
            onChange={handleChange}
          />
          <label>{t('notifications')}</label>
        </div>

        <button type="submit" style={styles.button}>{t('submit')}</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default UpdatePreferences;
