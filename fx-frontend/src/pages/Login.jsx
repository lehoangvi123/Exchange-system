import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

const BACKEND_URL = 'https://backend-1-8b9z.onrender.com';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Kiểm tra nếu user đã đăng nhập, redirect về home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu đã có token, redirect về home ngay lập tức
      navigate('/home', { replace: true });
    }
  }, [navigate]);

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
    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/users/login`, formData);

      if (res.data?.token) {
        // ✅ Lưu token và thông tin user
        localStorage.setItem('token', res.data.token);
        
        // Lưu thêm thông tin user nếu có
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        setSuccess('✅ Đăng nhập thành công!');

        // ✅ Gọi callback nếu có
        if (onLoginSuccess) {
          onLoginSuccess(res.data);
        }

        // ✅ Redirect về trang Home sau 500ms
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 500);

      } else {
        setError('❌ Không nhận được token từ máy chủ');
      }

    } catch (err) {
      const msg = err.response?.data?.message || 
                  err.response?.data?.error || 
                  '❌ Đăng nhập thất bại. Vui lòng thử lại!';
      setError(msg);
      console.error('Lỗi đăng nhập:', err);
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
            </button>
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