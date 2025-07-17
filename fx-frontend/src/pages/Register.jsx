import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Register.css'; // CSS riêng

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/register`, formData);

      // ✅ Nếu backend trả về token thì lưu lại
     if (res.data?.token && res.data?.user) {
     localStorage.setItem('token', res.data.token);
     localStorage.setItem('user', JSON.stringify(res.data.user)); // ✅ Thêm dòng này
   } 


      setSuccess('✅ Tạo tài khoản thành công!');

      // ✅ Gọi callback nếu có
      if (onRegisterSuccess) {
        onRegisterSuccess(); // dùng cho App.jsx
      } else {
        // Nếu không có callback thì điều hướng
        setTimeout(() => navigate('/'), 500);
      }

      console.log('Đăng ký thành công:', res.data);
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Đăng ký thất bại';
      setError(msg);
      console.error('Lỗi đăng ký:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Panel bên trái */}
        <div className="register-left">
          <h2>Chào mừng bạn!</h2>
          <p>Tạo tài khoản để sử dụng hệ thống theo dõi tỷ giá chuyên nghiệp.</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            alt="Register"
          />
        </div>

        {/* Form bên phải */}
        <div className="register-right">
          <h2>📝 Đăng ký tài khoản</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                placeholder="Tên"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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

            <button type="submit" className="register-button">Đăng ký</button>
          </form>

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <p className="login-redirect">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
