import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css'; // bạn tự tạo file CSS riêng

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/login`, formData);

      // ✅ Lưu token
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        setSuccess('✅ Đăng nhập thành công!');

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          setTimeout(() => navigate('/'), 500);
        }
      } else {
        setError('❌ Không nhận được token từ máy chủ');
      }

    } catch (err) {
      const msg = err.response?.data?.message || '❌ Đăng nhập thất bại';
      setError(msg);
      console.error('Lỗi đăng nhập:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Bên trái */}
        <div className="login-left">
          <h2>Chào mừng trở lại!</h2>
          <p>Đăng nhập để tiếp tục theo dõi tỷ giá và nhiều tính năng hấp dẫn khác.</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="Login"
          />
        </div>

        {/* Bên phải - Form */}
        <div className="login-right">
          <h2>🔐 Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-button">Đăng nhập</button>
          </form>

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <p className="register-redirect">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
