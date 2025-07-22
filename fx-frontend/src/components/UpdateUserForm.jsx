import React, { useState } from 'react';

const UpdateUserForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [currencies, setCurrencies] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    const preferredCurrencies = currencies
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(c => c);

    try {
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          updates: {
            name,
            preferredCurrencies
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Cập nhật thành công!');
      } else {
        setMessage(`❌ Thất bại: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Lỗi khi gửi yêu cầu');
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '24px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#1f2937',
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      color: '#374151',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '15px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginTop: '4px',
      marginBottom: '16px',
      boxSizing: 'border-box',
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
      cursor: 'pointer',
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🔄 Cập nhật thông tin người dùng</h3>
      <form onSubmit={handleUpdate}>
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
          Tên mới:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Tiền tệ ưa thích (cách nhau bởi dấu phẩy, ví dụ: USD,VND,EUR):
          <input
            type="text"
            value={currencies}
            onChange={e => setCurrencies(e.target.value)}
            style={styles.input}
          />
        </label>

        <button type="submit" style={styles.button}>💾 Cập nhật</button>
      </form>

      <p style={styles.message}>{message}</p>
    </div>
  );
};

export default UpdateUserForm;
