import React, { useEffect, useState } from 'react';
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

import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [rate, setRate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();
  const navigate = useNavigate();

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

  // Hiển thị Register hoặc Login nếu chưa đăng nhập
  if (!isAuthenticated) {
    if (location.pathname === '/login') {
      return <Login onLoginSuccess={() => {
        setIsAuthenticated(true);
        navigate('/');
      }} />;
    } else {
      return <Register onRegisterSuccess={() => {
        setIsAuthenticated(true);
        navigate('/');
      }} />;
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
            <div className="auth-buttons">
              <button
                className="login-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsAuthenticated(false);
                  navigate('/login');
                }}
              >
                🔁 Đăng xuất
              </button>
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
                <CurrencyConverter />
                <CrossRateConverter />
                <RatesFromSources />
                <RateChart />
                <ExchangeRateDisplay />
                <TechnicalIndicators />
                <MarketSummary />
                <ClearCacheButton />
                <CacheDashboard />
                <SaveRateForm />
                <RateTrend pair="AUD_BGN" period="30d" />
                <CacheStats />
                <WarmupButton />
                <SaveUserForm />
                <UpdateUserForm />
                <ArchiveRateForm />
                <ClearExpiredCacheButton />
                <UpdatePreferences />
                <HistoryChart period="24h" />
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
              <h4>Product</h4>
              <a href="/">Dashboard</a>
              <a href="/alerts">Alerts</a>
              <a href="/setting">Settings</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/support">Support</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
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
