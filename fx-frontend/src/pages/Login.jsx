import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ Ngăn form reload
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      alert('✅ Đăng nhập thành công');
      console.log('User:', res.data.user);
      console.log('Token:', res.data.token);
      // 👉 Lưu token nếu cần
      // localStorage.setItem('token', res.data.token);
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Đăng nhập thất bại';
      alert(msg);
      console.error('Lỗi đăng nhập:', err);
    }
  };

  return (
    <div>
      <h2>🔒 Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
