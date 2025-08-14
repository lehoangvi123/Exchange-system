import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { ThemeProvider, useTheme } from './contexts/themeContexts';
import { BrowserRouter  } from 'react-router-dom';

// Pages 
import Home from './pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Setting from './pages/Setting';
import AlertsPage from './pages/AlertsPage';
import History from './pages/History'
import Chart from './pages/Chart'; 
import Rates from './pages/Rates'; 
import SaveForm from './pages/SaveForm'; 
import Converter from './pages/Converter'
import Careers from './pages/Careers'; 
// Components
import CurrencyConverter from './components/CurrencyConverter';
import CrossRateConverter from './components/CrossRateConverter';
import ExchangeRateDisplay from './components/ExchangeRateDisplay';
import TechnicalIndicators from './components/TechnicalIndicator';
import MarketSummary from './components/MarketSummary';
import SaveRateForm from './components/SaveRateForm';
import UpdateUserForm from './components/UpdateUserForm';
import SaveUserForm from './components/SaveUserForm';
import LogConversionForm from './components/LogConversionForm';
import ArchiveRateForm from './components/ArchiveRateForm';
import RateTrend from './pages/RateTrend';
import UpdatePreferences from './components/UpdatePreferences'; 
import Profile from './pages/Profile'; 
import Terms from './pages/Terms'; 
import Disclaimer from './pages/Disclamer'; 
import ThemeToggle from './components/ThemeToggle'; 
import Analytics from './pages/Analytics'; 
import Report from './pages/Report'; 
import Export from './pages/Export'; 
import APIIntegration from './pages/APIintegration'; 
import Background from './pages/background';

import './css/theme.css'
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://backend-1-8b9z.onrender.com/';

// User Info Button Component
const UserInfoButton = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="user-profile-button"
        style={{
          background: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.15)',
          color: isDark ? '#ffffff' : 'black',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="user-avatar">
          <span className="user-initials">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'User Profile'}
          </span>
        </div>
        <span className="user-name"> 
          {user?.name || user?.email}
        </span>
        <svg 
          className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : 'aa'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="user-dropdown-menu" style={{
          background: isDark 
            ? 'rgba(30, 30, 30, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
          transition: 'all 0.3s ease'
        }}>
          <div className="user-dropdown-header" style={{
            borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            transition: 'all 0.3s ease'
          }}>
            <div className="user-dropdown-avatar">
              <span className="user-dropdown-initials">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'Hi!'}
              </span>
            </div>
            <div>
              <p className="user-dropdown-name" style={{
                color: isDark ? '#ffffff' : '#1f2937',
                transition: 'all 0.3s ease'
              }}>{user?.name || 'Xin Chào Bạn Yêu Dấu!'}</p>
              <p className="user-dropdown-email" style={{
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                transition: 'all 0.3s ease'
              }}>{user?.email}</p>
            </div>
          </div>

          <div className="user-dropdown-items">
            <Link to="/profile" onClick={() => setIsDropdownOpen(false)} 
                  className="user-dropdown-item"
                  style={{
                    color: isDark ? '#ffffff' : '#374151',
                    transition: 'all 0.3s ease'
                  }}>
              <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Thông tin cá nhân</span>
            </Link>


            <Link to="/setting" onClick={() => setIsDropdownOpen(false)} 
                  className="user-dropdown-item"
                  style={{
                    color: isDark ? '#ffffff' : '#374151',
                    transition: 'all 0.3s ease'
                  }}>
              <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Cài đặt</span>
            </Link>


            <button onClick={handleLogout} 
                    className="user-dropdown-item logout-item"
                    style={{
                      color: isDark ? '#ff6b6b' : '#dc2626',
                      transition: 'all 0.3s ease'
                    }}>
              <svg className="dropdown-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h1m10-4v2.5" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation Menu Component
const NavigationMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isDark } = useTheme();

  // Navigation structure with 4 main categories
  const navigationItems = [
    {
      title: "Dashboard",
      icon: "",
      submenu: [
        { title: "Tổng quan", icon: "🏠", link: "/home", desc: "Xem tổng quan hệ thống" },
        { title: "Explore", icon: "🔍", link: "/", desc: "Khám phá tính năng" },
        { title: "Thống kê", icon: "📈", link: "/analytics", desc: "Phân tích dữ liệu" },
        { title: "Báo cáo", icon: "📋", link: "/reports", desc: "Tạo và xem báo cáo" }, 
        { title: "Xem hình nền", icon: "🏠", link: "/background", desc:"Xem hình nền trang web"}
      ]
    },
    {
      title: "Tỷ giá",
      icon: "",
      submenu: [
        { title: "Tỷ giá hiện tại", icon: "💰", link: "/rates", desc: "Xem tỷ giá thời gian thực" },
        { title: "Lịch sử tỷ giá", icon: "📊", link: "/historyRate", desc: "Dữ liệu tỷ giá theo thời gian" },
        { title: "Biểu đồ tỷ giá", icon: "📈", link: "/chart", desc: "Trực quan hóa tỷ giá" },
        { title: "Cảnh báo tỷ giá", icon: "🚨", link: "/alerts", desc: "Thiết lập thông báo" }, 
        { title: "Xu hướng tỷ giá", icon: "📈", link: "/RateTrend", desc: "Xem xu hướng các tỷ giá"}
      ]
    },
    {
      title: "Công cụ",
      icon: "",
      submenu: [
        { title: "Form dữ liệu", icon: "📝", link: "/SaveForm", desc: "Nhập và lưu dữ liệu" },
        { title: "Quy đổi tiền tệ", icon: "🔄", link: "/converter", desc: "Chuyển đổi tiền tệ nhanh" },
        { title: "Xuất dữ liệu", icon: "📤", link: "/export", desc: "Xuất CSV, Excel, PDF" },
        { title: "API Integration", icon: "🔌", link: "/api", desc: "Tích hợp API bên ngoài" }
      ]
    },
    {
      title: "Thông tin",
      icon: "",
      submenu: [
        { title: "Giới thiệu", icon: "📄", link: "/about", desc: "Thông tin về hệ thống" },
        { title: "Liên hệ", icon: "📞", link: "/contact", desc: "Liên hệ hỗ trợ" },
        { title: "Điều khoản", icon: "📋", link: "/terms", desc: "Điều khoản sử dụng" },
        { title: "Tuyên bố", icon: "⚖️", link: "/disclamer", desc: "Tuyên bố pháp lý" }
      ]
    }
  ];

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="main-navigation" style={{
      background: isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(255, 255, 255, 0.12)',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'}`,
      transition: 'all 0.3s ease'
    }}>
      {navigationItems.map((item, index) => (
        <div 
          key={index}
          className="nav-item"    
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="nav-link" style={{
            color: isDark ? '#ffffff' : 'white',
            transition: 'all 0.3s ease'
          }}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.title}</span>
            <svg className="nav-arrow" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8.5L2.5 5h7L6 8.5z"/>
            </svg>
          </div>

          {/* Dropdown Menu */}
          <div className={`nav-dropdown ${activeDropdown === index ? 'active' : ''}`} style={{
            background: isDark 
              ? 'rgba(30, 30, 30, 0.98)' 
              : 'rgba(255, 255, 255, 0.98)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
            transition: 'all 0.3s ease'
          }}>
            <div className="dropdown-header" style={{
              color: isDark ? '#ffffff' : '#2c3e50',
              borderBottom: `2px solid ${isDark ? '#374151' : '#e9ecef'}`,
              transition: 'all 0.3s ease'
            }}>
              <span className="dropdown-header-icon">{item.icon}</span>
              <span className="dropdown-header-text">{item.title}</span>
            </div>
            
            {item.submenu.map((subItem, subIndex) => (
              <Link 
                key={subIndex}
                to={subItem.link}
                className="dropdown-item"
                style={{
                  color: isDark ? '#ffffff' : '#374151',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="dropdown-item-icon">{subItem.icon}</span>
                <div className="dropdown-item-content">
                  <div className="dropdown-item-title" style={{
                    color: isDark ? '#ffffff' : '#1f2937',
                    transition: 'all 0.3s ease'
                  }}>{subItem.title}</div>
                  <div className="dropdown-item-desc" style={{
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                    transition: 'all 0.3s ease'
                  }}>{subItem.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

// App Component wrapped with ThemeProvider
function AppContent() {
  const [rate, setRate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  
  // SCROLL HEADER STATES
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // SCROLL HEADER EFFECT
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    if (isAuthenticated) {
      window.addEventListener('scroll', throttledScroll, { passive: true });
      return () => window.removeEventListener('scroll', throttledScroll);
    }
  }, [lastScrollY, isAuthenticated]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Lấy thông tin user khi đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.id,
            email: payload.email,
            name: payload.name || payload.email
          });
        } catch (error) {
          console.error('Error decoding token:', error);
          axios.get(`${BACKEND_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => {
            if (res.data?.success) {
              setUser(res.data.user);
            }
          })
          .catch(err => {
            console.error('Error fetching user info:', err);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
          });
        }
      }
    }
  }, [isAuthenticated, navigate]);

  // Realtime socket
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io(BACKEND_URL);

    axios.get(`${BACKEND_URL}/api/rates/current`)
      .then(res => {
        if (res.data?.success && res.data.rates) {
          setRate(res.data.rates);
        }
      })
      .catch(err => console.error('❌ API error:', err));

    socket.on('rateUpdate', data => {
      setRate(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

 // Trong App.jsx - Thay đổi hàm này

  // Hiển thị Register hoặc Login nếu chưa đăng nhập
  // Xóa hàm handleRegisterSuccess
// const handleRegisterSuccess = () => { ... }  ← Xóa dòng này

// Sửa phần render
if (!isAuthenticated) {
  if (location.pathname === '/login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  } else {
    // ✅ Không cần callback nữa
    return <Register />;
  }
}

  // HEADER STYLES WITH SCROLL EFFECT
  const headerStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: isDark 
      ? 'rgba(20, 20, 20, 0.95)' 
      : '#ffffffff',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: isDark 
      ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isHeaderVisible ? 1 : 0
  };

  // MAIN CONTENT PADDING FOR FIXED HEADER
  const mainStyles = {
    paddingTop: '6rem',
    minHeight: 'calc(100vh - 6rem)',
    
    transition: 'all 0.3s ease'
  };

  return (
    <>
      {/* CSS Styles */}
      <style jsx>{`
        /* Navigation Styles */
        .main-navigation {
          display: flex;
          gap: 0.5rem;
          backdrop-filter: blur(8px);
          border-radius: 16px;
          padding: 0.5rem;
        } 

        /* Trong CSS */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: ${isDark 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
          transition: all 0.3s ease;
        }

        .nav-item {
          position: relative;
          display: inline-block;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        } 

        .home-card{ 
            
        }

        .nav-link:hover {
          background: ${isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)'};
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-text {
          font-size: 0.95rem;
        }

        .nav-arrow {
          margin-left: 0.25rem;
          transition: transform 0.3s ease;
        }

        .nav-item:hover .nav-arrow {
          transform: rotate(180deg);
        }

        .nav-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 8px 32px rgba(102, 126, 234, 0.2);
          padding: 1rem;
          min-width: 300px;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
        }

        .nav-item:hover .nav-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-header {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dropdown-header-icon {
          font-size: 1.25rem;
        }

        .dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-bottom: 0.25rem;
        }

        .dropdown-item:hover {
          background: ${isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'linear-gradient(135deg, #f8fafc, #e2e8f0)'};
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dropdown-item-icon {
          font-size: 1.25rem;
          width: 24px;
          text-align: center;
          margin-top: 2px;
        }

        .dropdown-item-content {
          flex: 1;
        }

        .dropdown-item-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .dropdown-item-desc {
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* User Profile Styles */
        .user-profile-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          backdrop-filter: blur(10px);
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
        }

        .user-profile-button:hover {
          color: ${isDark ? '#60a5fa' : '#1e40af'};
          text-decoration: underline;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .user-initials {
          font-weight: bold;
          font-size: 0.875rem;
        }

        .user-name {
          font-size: 0.875rem;
          max-width: 8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-arrow {
          width: 1rem;
          height: 1rem;
          transition: transform 0.3s ease;
        }

        .dropdown-arrow.rotate-180 {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          width: 18rem;
          backdrop-filter: blur(20px);
          border-radius: 16px;
          box-shadow: 
            0 20px 64px rgba(124, 58, 237, 0.25),
            0 8px 32px rgba(0, 0, 0, 0.15);
          padding: 0.5rem;
          z-index: 1000;
          animation: dropdown-appear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes dropdown-appear {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .user-dropdown-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-dropdown-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .user-dropdown-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .user-dropdown-email {
          font-size: 0.875rem;
        }

        .user-dropdown-items {
          padding: 0.5rem;
        }

        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
        }

        .user-dropdown-item:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
        }

        .user-dropdown-item.logout-item:hover {
          background: ${isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2'};
        }

        /* Theme Toggle Container */
        .theme-toggle-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-navigation {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          
          .nav-dropdown {
            position: fixed;
            top: 140px;
            left: 1rem;
            right: 1rem;
            transform: none;
            min-width: auto;
          }
          
          .nav-item:hover .nav-dropdown {
            transform: none;
          }

          .theme-toggle-container {
            flex-direction: column;
            gap: 0.5rem;
          } 

         
        }
      `}</style>

      <div className="flex flex-col min-h-screen text-gray-800" style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
          : 'linear-gradient(to-br, #667eea 0%, #764ba2 100%)',
        color: isDark ? '#ffffff' : '#1f2937',
        transition: 'all 0.3s ease'
      }}>
        {/* HEADER WITH SCROLL EFFECT */}
        <header style={headerStyles} className="header-dashboard">
          <div className="container container-header mx-auto flex justify-between items-center p-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-3xl" style={{animation: ''}}>💱</span>
              <h4 className="text-2xl font-extrabold" style={{
                color: isDark ? '#ffffff' : 'black',
                transition: 'all 0.3s ease'
              }}>FX Rate Dashboard</h4>
            </div>

            {/* Navigation Menu */}
            <NavigationMenu />

            {/* Theme Toggle & User Profile */}
            <div className="theme-toggle-container">
              <ThemeToggle />
              {user && (
                <UserInfoButton user={user} onLogout={handleLogout} />
              )}
            </div>
          </div>
          
          {/* SCROLL INDICATOR */}
          {!isHeaderVisible && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '2px',
              background: isDark 
                ? 'linear-gradient(90deg, #e74c3c, #3498db)' 
                : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
              borderRadius: '1px',
              opacity: 0.7,
              transition: 'all 0.3s ease'
            }} />
          )}
        </header>

        {/* MAIN WITH PROPER PADDING */} 
        <main className="container container-main mx-auto flex-1 p-6" style={mainStyles}>
          <Routes>
            <Route path="/" element={
              rate && Object.keys(rate).length > 0 ? (
                <div className="home-grid">
                  <section className="welcome-section">
                    <h2 className="home-title" style={{
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}>Welcome to FX Rate Dashboard</h2>
                    <p className="home-subtitle" style={{
                      color: 'white', 
                      transition: 'all 0.3s ease'
                    }}>
                      Get real-time currency rates, insights, and analysis tools — all in one place.
                    </p>
                  </section>

                  <div className="card-grid">
                    {/* <div ><CurrencyConverter /></div> */}
                    
                    <div className="sub-card-grid" ><CrossRateConverter /></div>
                    
                    <div className="sub-card-grid" ><ExchangeRateDisplay /></div>
                    
                    <div className="sub-card-grid"><TechnicalIndicators /></div> 
                    
                   
                    
                    {/* <div><RateTrend pair="AUD_BGN" period="30d" /></div>   */}
                    
                    <div className="sub-card-grid" ><SaveRateForm /></div>
                    
                    <div className="sub-card-grid" ><LogConversionForm /></div>
                    
                    <div className="sub-card-grid" ><SaveUserForm /></div>
                    
                    {/* <div ><UpdateUserForm /></div> */}
                    
                    {/* <div ><UpdatePreferences /></div> */}
                    
                    <div className="sub-card-grid" ><ArchiveRateForm /></div>  
                    
                    
                    
                    
                    {/* <div> <Report /> </div>  */}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg animate-pulse" style={{
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                    transition: 'all 0.3s ease'
                  }}>Loading exchange rates...</p>
                </div>
              )
            } />

            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/setting" element={<Setting />} /> 
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/terms" element={<Terms />} /> 
            <Route path="/disclamer" element={<Disclaimer />} />
            <Route path="/historyRate" element={<History />} /> 
            <Route path="/chart" element={<Chart />} />  
            <Route path="/rates" element={<Rates />} />  
            <Route path="/SaveForm" element={<SaveForm />} /> 
            <Route path="/converter" element={<Converter />} />
            <Route path="/analytics" element={<Analytics />} /> 
            <Route path="/reports" element={<Report />} /> 
            <Route path="/export" element={<Export />} /> 
            <Route path="/api" element={<APIIntegration />} /> 
            <Route path="/RateTrend" element={<RateTrend />} />  
            <Route path="/background" element={<Background />} />
            {/* <Route path="/careers" element={<Careers />} /> */}
          </Routes> 
        </main>

        {/* This is the comment
         */}

        {/* SCROLL TO TOP BUTTON */}
        {!isHeaderVisible && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '3rem',
              height: '3rem',
              background: isDark 
                ? 'linear-gradient(135deg, #e74c3c, #3498db)' 
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',        
              borderRadius: '50%',
              boxShadow: isDark 
                ? '0 10px 25px rgba(231, 76, 60, 0.3)' 
                : '0 10px 25px rgba(102, 126, 234, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease',
              zIndex: 999
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = isDark 
                ? '0 15px 35px rgba(231, 76, 60, 0.4)' 
                : '0 15px 35px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isDark 
                ? '0 10px 25px rgba(231, 76, 60, 0.3)' 
                : '0 10px 25px rgba(102, 126, 234, 0.3)';
            }}
          >
            ↑
          </button>
        )}

        {/* Footer */}
        <footer className="pro-footer" style={{
          background: isDark 
            ? 'rgba(20, 20, 20, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          color: isDark ? '#ffffff' : '#1f2937',
          transition: 'all 0.3s ease'
        }}>
          <div className="pro-footer-container">
            <div className="pro-footer-brand">
              <h2>💱 FX Rate Dashboard</h2>
              <p>Real-time currency exchange & insights</p>
            </div>
            <div className="pro-footer-links">
              <div>
                <h4 style={{ color: isDark ? '#ffffff' : '#1f2937' }}>Công ty</h4>
                <a href="/about" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Về chúng tôi</a>
                <a href="https://jobs.apple.com/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Sự nghiệp</a>
                <a href="/contact" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Liên hệ với chúng tôi</a>
                <a href="https://vietstock.vn/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Điểm nhấn</a>
              </div>
              <div>
                <h4 style={{ color: isDark ? '#ffffff' : '#1f2937' }}>Tài nguyên</h4>
                <a href="https://www.postman.com/api-platform/api-documentation/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Tài liệu về API</a>
                <a href="https://forextaker.com/understanding-exchange-rates-a-comprehensive-guide/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Hướng dẫn</a>
                <a href="https://acemoneytransfer.com/blog/exchange-rates-101-get-answers-to-10-common-questions" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>FAQ</a>
                <a href="https://ebury.com/e-blog/blog/ebury_post/fx-101-understanding-exchange-rate-regimes/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Blog</a>
              </div>
              <div>
                <h4 style={{ color: isDark ? '#ffffff' : '#1f2937' }}>Hỗ trợ</h4>
                <a href="https://help.xe.com/hc/en-gb" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Trung tâm hỗ trợ</a>
                <a href="https://support.microsoft.com/en-us/contactus" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Trợ giúp và liên hệ</a>
                <a href="https://clickup.com/blog/how-to-write-a-bug-report/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Báo cáo vấn đề</a>
                <a href="https://portal.office.com/servicestatus/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Dịch vụ của chúng tôi</a>
              </div>
              <div>
                <h4 style={{ color: isDark ? '#ffffff' : '#1f2937' }}>Luật lệ</h4>
                <a href="https://www.termsfeed.com/live/159dd57d-3d00-4060-b937-2c50e86903f9" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Quyền riêng tư</a>
                <a href="/terms" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Điều khoản về dịch vụ</a>
                <a href="https://privacyterms.io/view/austMd3V-RiKa3uTO-t1cHGR/" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Tuyên bố miễn trừ trách nhiệm</a>
              </div>
            </div>
          </div>
          <div className="pro-footer-bottom">
            <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280' }}>
              © 2025 FX Rate Dashboard. All rights reserved.
            </p>
          </div>
        </footer>      
      </div>

      {/* Additional CSS for Logo Animation */}
      <style jsx>{`
        @keyframes logoRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Header container adjustments */
        .container {
  max-width: none !important;
  width: 100% !important;   
  background-color: #1e3a8a; /* Xanh navy đậm */
}
        
        /* Logo hover effect */
        .flex.items-center.space-x-2:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease;
        }
        
        /* Navigation enhancements */
        .main-navigation {
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Home card styles */
        .home-card {
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .home-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem; 
          background-color: rgba(0,0,0,0.5);
        }

        .welcome-section {
          text-align: center;
          padding: 2rem 0; 
          color: white; 
        }

        .home-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .home-subtitle {
          font-size: 1.2rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 1024px) {
          .container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .main-navigation {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .theme-toggle-container {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .nav-link {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }
          
          .nav-text {
            display: none;
          }
          
          .nav-icon {
            font-size: 1.5rem;
          }
          
          .nav-dropdown {
            min-width: 250px;
            left: 0;
            right: 0;
            margin: 0 1rem;
            transform: none;
          }
          
          .nav-item:hover .nav-dropdown {
            transform: none;
          }

          .card-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .home-title {
            font-size: 2rem;
          }

          .home-subtitle {
            font-size: 1rem;
          }
        }
        
        /* Enhanced dropdown animations */
        .nav-dropdown {
          animation: dropdownSlide 0.3s ease-out;
        }
        
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        
        /* Improved accessibility */
        .nav-link:focus,
        .dropdown-item:focus,
        .user-profile-button:focus {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 2px;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .nav-link::before,
          .logoRotate,
          .pulse,
          .slideIn,
          .dropdownSlide {
            animation: none;
          }
          
          .nav-link,
          .dropdown-item,
          .user-profile-button,
          .home-card {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

// Main App component with ThemeProvider wrapper
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;