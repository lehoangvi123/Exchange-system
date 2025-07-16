import React, { useState } from 'react';

const SaveUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // ✅ Thêm password
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
          password, // ✅ Gửi password lên server
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

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h3>👤 Lưu thông tin người dùng</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Tên:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </label>
        <br />
        <label>
          Mật khẩu:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </label>
        <br />
        <label>
          Tiền tệ ưa thích (ngăn cách bằng dấu phẩy, ví dụ: USD,VND,EUR):
          <input
            type="text"
            value={preferredCurrencies}
            onChange={e => setPreferredCurrencies(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </label>
        <br />
        <button type="submit" style={{ padding: '8px 16px' }}>💾 Lưu người dùng</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default SaveUserForm;
