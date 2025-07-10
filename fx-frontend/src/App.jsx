import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import RateTable from './components/RateTable';
import CurrencyConverter from './components/CurrencyConverter';
import About from './pages/About';
import Contact from './pages/Contact';
import Setting from './pages/Setting';
import './App.css'; 
import CrossRateConverter from './components/CrossRateConverter';
import RatesFromSources from './components/RateFromSources'
import RateChart from './components/RateChart';
import ExchangeRateDisplay from './components/ExchangeRateDisplay'
import TechnicalIndicators from './components/TechnicalIndicator';
import MarketSummary from './components/MarketSummary'
import HistoryChart from './components/HistoryChart'
import ClearCacheButton from './components/ClearCacheButton' 
import WarmupButton from './components/WarmUpButton'; 
import CacheStats from './components/CacheStats'; 
import CacheDashboard from './components/CacheDashboard';
import ClearExpiredCacheButton from './components/ClearExpiredCacheButton'; 
import SaveRateForm from './components/SaveRateForm';
import UpdateUserForm from './components/UpdateUserForm';
import SaveUserForm from './components/SaveUserForm';
import LogConversionForm from './components/LogConversionForm';
import ArchiveRateForm from './components/ArchiveRateForm';
// import PopularPairs from './components/PopularPairs'

import AlertsPage from './pages/AlertsPage';
import UpdatePreferences from './components/UpdatePreferences';

// Biến môi trường cho backend
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Kết nối socket
const socket = io(BACKEND_URL);

function App() {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    // Gọi API lấy tỷ giá hiện tại
    axios.get(`${BACKEND_URL}/api/rates/current`)
      .then(res => {
        if (res.data?.success && res.data.rates) {
          setRate(res.data.rates);
        } else {
          console.warn('⚠ No exchange rates returned from API.');
        }
      })
      .catch(err => console.error('❌ API error:', err));

    // Lắng nghe cập nhật real-time
    socket.on('rateUpdate', data => {
      console.log('🔄 Real-time update received:', data);
      setRate(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💱</span>
            <h4 className="text-2xl font-extrabold text-blue-700">FX Rate Dashboard</h4>
          </div>
          <nav className="space-x-4">
            <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/">Home</Link>
            <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/about">About</Link>
            <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/alerts">Alert</Link>
            <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/contact">Contact</Link>
            <Link className="text-blue-600 hover:text-blue-800 font-medium" to="/setting">Setting</Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto flex-1 p-6">
        <Routes>
          <Route path="/" element={
            rate && Object.keys(rate).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                <RateTable rates={rate} /> 
                {/* <MarketSummary /> */}
                <CurrencyConverter /> 
                <CrossRateConverter />; 
                <RatesFromSources /> 
                <RateChart /> 
                <ExchangeRateDisplay /> 
                <TechnicalIndicators /> 
                <MarketSummary />  
                <ClearCacheButton />   
                 <h1>📊 Hệ thống Tỷ Giá</h1>
                <CacheDashboard />  
                <SaveRateForm /> 
                <CacheStats />
                <WarmupButton />  
                <SaveUserForm />   
                {/* <PopularPairs /> */}
                <UpdateUserForm /> 
                <ArchiveRateForm />
                <ClearExpiredCacheButton /> 
                 <h2>Trang Cài Đặt</h2>
                <UpdatePreferences />
                   <HistoryChart period="24h" />
                  {/* <HistoryChart period="7d" /> */}        
              <LogConversionForm /> 
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-500 animate-pulse">Loading exchange rates...</p>
              </div>
            )
          } />
         
          {/* <Route path="/summary" element={<MarketSummary />} /> */} 

          <Route path="/about" element={<About />} /> 
           <Route path="/alerts" element={<AlertsPage />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4 text-sm text-gray-600">
          <p>© 2025 FX Rate Dashboard. All rights reserved.</p>
          <div className="space-x-3 mt-2 md:mt-0">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/support" className="hover:underline">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

