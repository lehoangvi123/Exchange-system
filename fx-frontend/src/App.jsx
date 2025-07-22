import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Setting from './pages/Setting';
import AlertsPage from './pages/AlertsPage';

// Components
import RateTable from './components/RateTable';
import CurrencyConverter from './components/CurrencyConverter';
import CrossRateConverter from './components/CrossRateConverter';
import RatesFromSources from './components/RateFromSources';
import RateChart from './components/RateChart';
import ExchangeRateDisplay from './components/ExchangeRateDisplay';
import TechnicalIndicators from './components/TechnicalIndicator';
import MarketSummary from './components/MarketSummary';
import HistoryChart from './components/HistoryChart';
import ClearCacheButton from './components/ClearCacheButton';
import WarmupButton from './components/WarmUpButton';
import CacheStats from './components/CacheStats';
import CacheDashboard from './components/CacheDashboard';
import ClearExpiredCacheButton from './components/ClearExpiredCacheButton';
import SaveRateForm from './components/SaveRateForm';
import UpdateUserForm from './components/UpdateUserForm';
import SaveUserForm from './components/SaveUserForm';
import LogConversionForm from './components/LogConversionForm';
import ArchiveRateForm from './components/ArchiveRateForm';
import RateTrend from './components/RateTrend';
import UpdatePreferences from './components/UpdatePreferences'; 
import Profile from './pages/Profile'; 
import Terms from './pages/Terms'; 
import Disclaimer from './pages/Disclamer';

import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// User Info Button Component
const UserInfoButton = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
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
      {/* Nút thông tin người dùng */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 
                   transition-all duration-200 rounded-lg px-4 py-2 text-white
                   border border-blue-500 hover:border-blue-600"
      >
 
  <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
    <span className="text-sm font-bold text-white">
      {user?.name?.charAt(0)?.toUpperCase() || 'User profile'}
    </span>
  </div>
  <span className="text-sm text-white font-semibold"> 
    {user?.name || user?.email}
  </span>


        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium">{user?.name || user?.email}</span>
          <span className="text-xs opacity-80">{user?.email}</span>
        </div>
        <svg 
          className={`w-6 h-6 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border 
                        border-gray-200 py-2 z-50">
          
          {/* Thông tin người dùng */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 
                            rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || ''}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || ''}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
           {/* Thông tin cá nhân */}
<Link
  to="/profile"
  onClick={() => setIsDropdownOpen(false)}
  className="link-button"
>
  <svg className="custom-icon text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
  <span>Thông tin cá nhân</span>
</Link>

{/* Cài đặt */}
<Link
  to="/setting"
  onClick={() => setIsDropdownOpen(false)}
  className="link-button"
>
  <svg className="custom-icon text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c...z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  <span>Cài đặt</span>
</Link>


{/* Đăng xuất */}
<button
  onClick={handleLogout}
  className="logout-btn w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 
           hover:bg-red-50 transition-colors"
>
  <svg className="custom-icon text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1..." />
  </svg>
  <span>Đăng xuất</span>
</button>

          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [rate, setRate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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
        // Giải mã token để lấy thông tin user (hoặc gọi API)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.id,
            email: payload.email,
            name: payload.name || payload.email
          });
        } catch (error) {
          console.error('Error decoding token:', error);
          // Fallback: gọi API để lấy thông tin user
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
            // Token có thể hết hạn, đăng xuất
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

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  // Hiển thị Register hoặc Login nếu chưa đăng nhập
  if (!isAuthenticated) {
    if (location.pathname === '/login') {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    } else {
      return <Register onRegisterSuccess={handleRegisterSuccess} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💱</span>
            <h4 className="text-2xl font-extrabold text-blue-700">FX Rate Dashboard</h4>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="space-x-4">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/about">About</Link>        
              <Link className="nav-link" to="/alerts">Alert</Link>
              <Link className="nav-link" to="/contact">Contact</Link>   
              <Link className="nav-link" to="/setting">Setting</Link>    
            </nav>
            <div className="auth-buttons ml-auto space-x-4">
              {user && (
                <UserInfoButton user={user} onLogout={handleLogout} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */} 
    
      <main className="container mx-auto flex-1 p-6">
        <Routes>
          <Route path="/" element={
            rate && Object.keys(rate).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                <RateTable rates={rate} /> 
                <br />
                <CurrencyConverter /> 
                <br />
                <CrossRateConverter /> 
                <br />
                <RatesFromSources /> 
                <br />
                <RateChart />   
                <br />
                <ExchangeRateDisplay /> 
                <br />
                <TechnicalIndicators /> 
                <br />
                <MarketSummary />
                <br />
                <ClearCacheButton />
                <br />
                <CacheDashboard />
                <br />
                <SaveRateForm /> 
                <br />
                <RateTrend pair="AUD_BGN" period="30d" /> 
                <br />
                <CacheStats /> 
                <br />
                <WarmupButton /> 
                <br />
                <SaveUserForm /> 
                <br />
                <UpdateUserForm /> 
                <br />
                <ArchiveRateForm /> 
                <br />
                <ClearExpiredCacheButton /> 
                <br />
                <UpdatePreferences /> 
                <br />
                <HistoryChart period="24h" /> 
                <br />
                <LogConversionForm /> 
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-500 animate-pulse">Loading exchange rates...</p>
              </div>
            )
          } />
          <Route path="/about" element={<About />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/setting" element={<Setting />} /> 
           <Route path="/profile" element={<Profile />} /> 
           <Route path="/terms" element={<Terms />} /> 
           <Route path="/disclamer" element={<Disclaimer />} />

        </Routes>
      </main>

      {/* Footer */}
     <footer className="pro-footer">
        <div className="pro-footer-container">
          <div className="pro-footer-brand">
            <h2>💱 FX Rate Dashboard</h2>
            <p>Real-time currency exchange & insights</p>
          </div>
          <div className="pro-footer-links">
            <div>
              <h4>Company</h4>
              <a href="/about">About Us</a>
              <a href="/careers">Careers</a>
              <a href="/contact">Contact</a>
              <a href="/press">Press</a>
            </div>
            <div>
              <h4>Resources</h4>
              <a href="https://www.postman.com/api-platform/api-documentation/">API Documentation</a>
              <a href="https://forextaker.com/understanding-exchange-rates-a-comprehensive-guide/">Help Guide</a>
              <a href="https://acemoneytransfer.com/blog/exchange-rates-101-get-answers-to-10-common-questions">FAQ</a>
              <a href="https://ebury.com/e-blog/blog/ebury_post/fx-101-understanding-exchange-rate-regimes/">Blog</a>
            </div>
            <div>
              <h4>Support</h4>
              <a href="https://help.xe.com/hc/en-gb">Help Center</a>
              <a href="https://support.microsoft.com/en-us/contactus">Contact Support</a>
              <a href="https://clickup.com/blog/how-to-write-a-bug-report/">Report Issue</a>
              <a href="https://portal.office.com/servicestatus/">Service Status</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="https://www.termsfeed.com/live/159dd57d-3d00-4060-b937-2c50e86903f9">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/disclaimer">Disclaimer</a>
            </div>
          </div>
        </div>
        <div className="pro-footer-bottom">
          <p>© 2025 FX Rate Dashboard. All rights reserved.</p>
        </div>
      </footer>      
    </div>     
    
  );
}

export default App;