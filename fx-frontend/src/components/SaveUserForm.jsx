import React, { useState } from 'react';

const SaveUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredCurrencies, setPreferredCurrencies] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currenciesArray = preferredCurrencies
      .split(',')
      .map(code => code.trim().toUpperCase())
      .filter(code => code);

    try {
      const res = await fetch('http://localhost:5000/api/users/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          preferredCurrencies: currenciesArray
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Người dùng đã được lưu thành công!');
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
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#059669'
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>👤 Lưu thông tin người dùng</h3>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          Tên:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Mật khẩu:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Tiền tệ ưa thích (VD: USD,VND,EUR):
          <input
            type="text"
            value={preferredCurrencies}
            onChange={e => setPreferredCurrencies(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          💾 Lưu người dùng
        </button>
      </form>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

export default SaveUserForm;
