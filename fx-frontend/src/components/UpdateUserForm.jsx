import React, { useState } from 'react';

const UpdateUserForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [currencies, setCurrencies] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    const preferredCurrencies = currencies.split(',').map(c => c.trim().toUpperCase());

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

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>🔄 Cập nhật thông tin người dùng</h3>
      <form onSubmit={handleUpdate}>
        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Tên mới:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Tiền tệ ưa thích (cách nhau bởi dấu phẩy, ví dụ: USD,VND,EUR):
          <input type="text" value={currencies} onChange={e => setCurrencies(e.target.value)} />
        </label>
        <br />
        <button type="submit">Cập nhật</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UpdateUserForm;
