import React, { useState, useEffect } from 'react';

const currencyCountries = {
  AED: "United Arab Emirates", AFN: "Afghanistan", ALL: "Albania", AMD: "Armenia",
  ANG: "Netherlands Antilles", AOA: "Angola", ARS: "Argentina", AUD: "Australia",
  AWG: "Aruba", AZN: "Azerbaijan", BAM: "Bosnia and Herzegovina", BBD: "Barbados",
  BDT: "Bangladesh", BGN: "Bulgaria", BHD: "Bahrain", BIF: "Burundi", BMD: "Bermuda",
  BND: "Brunei", BOB: "Bolivia", BRL: "Brazil", BSD: "Bahamas", BTN: "Bhutan",
  BWP: "Botswana", BYN: "Belarus", BZD: "Belize", CAD: "Canada", CDF: "Congo",
  CHF: "Switzerland", CLP: "Chile", CNY: "China", COP: "Colombia", CRC: "Costa Rica",
  CUP: "Cuba", CVE: "Cabo Verde", CZK: "Czech Republic", DJF: "Djibouti",
  DKK: "Denmark", DOP: "Dominican Republic", DZD: "Algeria", EGP: "Egypt",
  ERN: "Eritrea", ETB: "Ethiopia", EUR: "European Union", FJD: "Fiji",
  FKP: "Falkland Islands", GBP: "United Kingdom", GEL: "Georgia", GHS: "Ghana",
  GIP: "Gibraltar", GMD: "Gambia", GNF: "Guinea", GTQ: "Guatemala", GYD: "Guyana",
  HKD: "Hong Kong", HNL: "Honduras", HRK: "Croatia", HTG: "Haiti", HUF: "Hungary",
  IDR: "Indonesia", ILS: "Israel", INR: "India", IQD: "Iraq", IRR: "Iran", ISK: "Iceland",
  JMD: "Jamaica", JOD: "Jordan", JPY: "Japan", KES: "Kenya", KGS: "Kyrgyzstan",
  KHR: "Cambodia", KMF: "Comoros", KRW: "South Korea", KWD: "Kuwait", KYD: "Cayman Islands",
  KZT: "Kazakhstan", LAK: "Laos", LBP: "Lebanon", LKR: "Sri Lanka", LRD: "Liberia",
  LSL: "Lesotho", LYD: "Libya", MAD: "Morocco", MDL: "Moldova", MGA: "Madagascar",
  MKD: "North Macedonia", MMK: "Myanmar", MNT: "Mongolia", MOP: "Macau", MUR: "Mauritius",
  MVR: "Maldives", MWK: "Malawi", MXN: "Mexico", MYR: "Malaysia", MZN: "Mozambique",
  NAD: "Namibia", NGN: "Nigeria", NIO: "Nicaragua", NOK: "Norway", NPR: "Nepal",
  NZD: "New Zealand", OMR: "Oman", PAB: "Panama", PEN: "Peru", PGK: "Papua New Guinea",
  PHP: "Philippines", PKR: "Pakistan", PLN: "Poland", PYG: "Paraguay", QAR: "Qatar",
  RON: "Romania", RSD: "Serbia", RUB: "Russia", RWF: "Rwanda", SAR: "Saudi Arabia",
  SBD: "Solomon Islands", SCR: "Seychelles", SDG: "Sudan", SEK: "Sweden",
  SGD: "Singapore", SHP: "Saint Helena", SLE: "Sierra Leone", SLL: "Sierra Leone",
  SOS: "Somalia", SRD: "Suriname", SSP: "South Sudan", STD: "São Tomé and Príncipe",
  SYP: "Syria", SZL: "Eswatini", THB: "Thailand", TJS: "Tajikistan", TMT: "Turkmenistan",
  TND: "Tunisia", TOP: "Tonga", TRY: "Turkey", TTD: "Trinidad and Tobago", TWD: "Taiwan",
  TZS: "Tanzania", UAH: "Ukraine", UGX: "Uganda", USD: "United States", UYU: "Uruguay",
  UZS: "Uzbekistan", VES: "Venezuela", VND: "Vietnam", VUV: "Vanuatu", WST: "Samoa",
  XAF: "Central African States", XCD: "Eastern Caribbean", XOF: "West African States",
  XPF: "French Polynesia", YER: "Yemen", ZAR: "South Africa", ZMW: "Zambia", ZWL: "Zimbabwe"
};

// Demo data for fallback
const demoRates = {
  EUR: 0.85, GBP: 0.73, JPY: 110.12, AUD: 1.35, CAD: 1.25,
  CHF: 0.92, CNY: 6.45, SEK: 8.85, NZD: 1.42, MXN: 20.15,
  SGD: 1.35, HKD: 7.85, NOK: 8.45, KRW: 1180.50, TRY: 8.25,
  RUB: 73.50, INR: 74.25, BRL: 5.20, ZAR: 14.85, VND: 23050,
  THB: 32.50, PLN: 4.15, CZK: 21.80, DKK: 6.35, HUF: 310.25
};

// Mock sources data for demo
const mockSources = [
  {
    provider: "ExchangeRate-API",
    rates: { EUR: 0.85, GBP: 0.73, JPY: 110.12, CAD: 1.25, AUD: 1.35 }
  },
  {
    provider: "Fixer.io",
    rates: { EUR: 0.84, GBP: 0.72, JPY: 109.85, CAD: 1.26, AUD: 1.34 }
  },
  {
    provider: "CurrencyLayer",
    rates: { EUR: 0.86, GBP: 0.74, JPY: 110.50, CAD: 1.24, AUD: 1.36 }
  }
];

// Component for displaying rates from multiple sources
function RatesFromSources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSourceRates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, use mock data
        setSources(mockSources);
        
      } catch (err) {
        console.error('❌ Error fetching source rates:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceRates();
  }, []);

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '28px',
      color: '#1a365d',
      fontWeight: '700',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f7fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3182ce',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 24px',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#fed7d7',
      borderRadius: '16px',
      border: '1px solid #feb2b2',
    },
    errorText: {
      color: '#c53030',
      fontSize: '18px',
      fontWeight: '500',
    },
    noData: {
      textAlign: 'center',
      color: '#718096',
      fontSize: '18px',
      padding: '60px',
    },
    card: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    provider: {
      marginBottom: '20px',
      fontSize: '20px',
      color: '#2b6cb0',
      fontWeight: '600',
    },
    rateGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
    },
    rateItem: {
      backgroundColor: '#f7fafc',
      padding: '12px 16px',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '15px',
      border: '1px solid #e2e8f0',
    },
    currency: {
      fontWeight: '700',
      marginRight: '6px',
      color: '#2d3748',
    },
    value: {
      color: '#4a5568',
      fontWeight: '500',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📡 Raw Rates From All Providers</h2>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: '#4a5568', fontSize: '16px' }}>
            Đang tải dữ liệu từ các nguồn...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📡 Raw Rates From All Providers</h2>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>❌ Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📡 Raw Rates From All Providers</h2>
      {sources.length === 0 ? (
        <p style={styles.noData}>Không có dữ liệu từ các nguồn.</p>
      ) : (
        sources.map((src, idx) => (
          <div key={idx} style={styles.card}>
            <h4 style={styles.provider}>🌐 Provider: {src.provider}</h4>
            <div style={styles.rateGrid}>
              {Object.entries(src.rates || {}).map(([currency, rate]) => (
                <div key={currency} style={styles.rateItem}>
                  <span style={styles.currency}>{currency}:</span>
                  <span style={styles.value}>{rate}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Main Rates component
function Rates({ rates, loading, error, usingFallback }) {
  const [usdAmount, setUsdAmount] = useState(1);

  // Display loading state
  if (loading) {
    return (
      <div className="rates-container">
        <h2 className="rates-title">
          🌍 Exchange Rates
        </h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu tỷ giá...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && !rates) {
    return (
      <div className="rates-container">
        <h2 className="rates-title">
          🌍 Exchange Rates
        </h2>
        <div className="error-state">
          <div className="error-icon">❌</div>
          <p className="error-text">Lỗi tải dữ liệu: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Check if rates exist and are valid
  if (!rates || typeof rates !== 'object') {
    return (
      <div className="rates-container">
        <h2 className="rates-title">
          🌍 Exchange Rates
        </h2>
        <div className="no-data-state">
          <p>Không có dữ liệu tỷ giá để hiển thị.</p>
        </div>
      </div>
    );
  }

  const ratesEntries = Object.entries(rates);
  if (ratesEntries.length === 0) {
    return (
      <div className="rates-container">
        <h2 className="rates-title">
          🌍 Exchange Rates
        </h2>
        <div className="no-data-state">
          <p>Không có dữ liệu tỷ giá để hiển thị.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rates-container">
      <h2 className="rates-title">
        🌍 Exchange Rates
        <span className="usd-amount-indicator">
          (USD convert to: {usdAmount})
        </span>
      </h2>

      {usingFallback && (
        <div className="fallback-notice">
          ⚠️ Using demo data - Live rates unavailable
        </div>
      )}

      <div className="input-section">
        <label className="input-label">
          Enter USD amount:
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={usdAmount}
          onChange={e => setUsdAmount(parseFloat(e.target.value) || 0)}
          className="usd-input"
        />
      </div>

      <div className="rates-table-container">
        <table className="rates-table">
          <thead className="table-header">
            <tr>
              <th className="country-header">Country</th>
              <th className="value-header">Value</th>
              <th className="currency-header">Currency</th>
            </tr>
          </thead>
          <tbody>
            {ratesEntries.map(([currency, rate], index) => (
              <tr
                key={currency}
                className={`table-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}
              >
                <td className="country-cell">
                  {currencyCountries[currency] || 'Unknown'}
                </td>
                <td className="value-cell">
                  {(usdAmount * (rate || 0)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </td>
                <td className="currency-cell">{currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main combined app component
function CombinedExchangeRateApp() {
  const [activeTab, setActiveTab] = useState('rates');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRates(data.rates);
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(err.message);
      setUsingFallback(true);
      
      // Use demo data if API fails
      setRates(demoRates);
      
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchExchangeRates();
    
    // Auto refresh every 5 minutes (only for rates tab)
    const interval = setInterval(() => {
      if (activeTab === 'rates') {
        fetchExchangeRates();
      }
    }, 300000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="app-container">
      <style jsx>{`
        .app-container {
          min-height: 100vh; 
          background-image: url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .header-nav {
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .nav-container {  
        background-color: black;
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 5rem;
        }

        .nav-buttons {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1rem 0;
        }

        .nav-button {
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
        }

        .nav-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4);
          transform: translateY(-2px);
        }

        .nav-button.inactive {
          background-color: #f8f9fa;
          color: #495057;
          border: 2px solid #e9ecef;
        }

        .nav-button.inactive:hover {
          background-color: #e9ecef;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .main-content {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .rates-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin: 0 auto;
          max-width: 1000px;
        }

        .rates-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .usd-amount-indicator {
          font-size: 1rem;
          font-weight: 500;
          color: #718096;
          margin-left: 0.5rem;
        }

        .fallback-notice {
          background: linear-gradient(90deg, #fed7d7, #fbb6ce);
          color: #c53030;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
          text-align: center;
        }

        .input-section {
          margin-bottom: 2rem;
        }

        .input-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        .usd-input {
          width: 100%;
          max-width: 300px;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .usd-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .rates-table-container {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .rates-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .table-header th {
          padding: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }

        .country-header {
          text-align: left;
        }

        .value-header {
          text-align: right;
        }

        .currency-header {
          text-align: center;
        }

        .table-row {
          transition: all 0.2s ease;
        }

        .row-even {
          background-color: #f8f9fa;
        }

        .row-odd {
          background-color: white;
        }

        .table-row:hover {
          background: linear-gradient(90deg, #e6fffa, #f0fff4) !important;
          transform: scale(1.01);
        }

        .table-row td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .country-cell {
          font-weight: 500;
          color: #2d3748;
        }

        .value-cell {
          text-align: right;
          color: #4a5568;
          font-weight: 600;
        }

        .currency-cell {
          text-align: center;
          font-weight: 700;
          color: #2d3748;
        }

        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .error-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .error-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .error-text {
          color: #c53030;
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
        }

        .retry-button {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4);
        }

        .refresh-section {
          text-align: center;
          margin-top: 2rem;
        }

        .refresh-button {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(72, 187, 120, 0.4);
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-data-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
          font-size: 1.125rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .nav-buttons {
            gap: 1rem;
            padding: 0.75rem 0;
          }
          
          .nav-button {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .rates-container {
            margin: 0 0.5rem;
            padding: 1.5rem;
          }

          .rates-title {
            font-size: 1.5rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .usd-amount-indicator {
            margin-left: 0;
          }

          .usd-input {
            max-width: none;
          }

          .table-header th {
            padding: 0.75rem 0.5rem;
            font-size: 0.75rem;
          }

          .table-row td {
            padding: 0.75rem 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .nav-buttons {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          
          .nav-button {
            width: 200px;
            text-align: center;
          }
        }
      `}</style>

      {/* Header Navigation */}
      <div className="header-nav">
        <div className="nav-container">
          <div className="nav-buttons">
            <button
              onClick={() => setActiveTab('rates')}
              className={`nav-button ${activeTab === 'rates' ? 'active' : 'inactive'}`}
            >
              🌍 Exchange Rates
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`nav-button ${activeTab === 'sources' ? 'active' : 'inactive'}`}
            >
              📡 Raw Sources
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="main-content">
        {activeTab === 'rates' ? (
          <>
            <Rates 
              rates={rates} 
              loading={loading} 
              error={error} 
              usingFallback={usingFallback}
            />
            
            {/* Refresh button */}
            <div className="refresh-section">
              <button
                onClick={fetchExchangeRates}
                disabled={loading}
                className="refresh-button"
              >
                {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
              </button>
            </div>
          </>
        ) : (
          <RatesFromSources />
        )}
      </main>
    </div>
  );
}

export default CombinedExchangeRateApp;