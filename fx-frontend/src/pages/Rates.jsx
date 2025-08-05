import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

// Component hiển thị rates từ multiple sources
function RatesFromSources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSourceRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/rates/sources');
        
        if (response.data.success) {
          setSources(response.data.sources);
        } else {
          throw new Error('Failed to fetch source rates');
        }
      } catch (err) {
        console.error('❌ Error fetching source rates:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceRates();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📡 Raw Rates From All Providers</h2>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Đang tải dữ liệu từ các nguồn...</p>
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

// Component Rates chính
function Rates({ rates, loading, error }) {
  const [usdAmount, setUsdAmount] = useState(1);

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          🌍 Exchange Rates
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải dữ liệu tỷ giá...</p>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          🌍 Exchange Rates
        </h2>
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">❌</div>
          <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Kiểm tra nếu rates không tồn tại hoặc rỗng
  if (!rates || typeof rates !== 'object') {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          🌍 Exchange Rates
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Không có dữ liệu tỷ giá để hiển thị.</p>
        </div>
      </div>
    );
  }

  // Kiểm tra nếu rates là object rỗng
  const ratesEntries = Object.entries(rates);
  if (ratesEntries.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          🌍 Exchange Rates
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Không có dữ liệu tỷ giá để hiển thị.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        🌍 Exchange Rates
        <span className="text-base font-medium text-gray-600 ml-2">
          (USD convert to: {usdAmount})
        </span>
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Enter USD amount:
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={usdAmount}
          onChange={e => setUsdAmount(parseFloat(e.target.value) || 0)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-auto">
          <thead className="bg-blue-600 text-white text-sm">
            <tr>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-right">Value</th>
              <th className="p-3 text-center">Currency</th>
            </tr>
          </thead>
          <tbody>
            {ratesEntries.map(([currency, rate], index) => (
              <tr
                key={currency}
                className={`${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition`}
              >
                <td className="p-3 font-medium text-gray-700">
                  {currencyCountries[currency] || 'Unknown'}
                </td>
                <td className="p-3 text-right text-gray-800">
                  {(usdAmount * (rate || 0)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </td>
                <td className="p-3 text-center font-bold text-gray-900">{currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 italic">
        Data auto-updates from real-time API
      </p>
    </div>
  );
}

// Component chính kết hợp cả hai
function CombinedExchangeRateApp() {
  const [activeTab, setActiveTab] = useState('rates');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu từ API
  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sử dụng API miễn phí (exchangerate-api.com)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRates(data.rates);
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(err.message);
      
      // Dữ liệu demo nếu API lỗi
      setRates({
        EUR: 0.85, GBP: 0.73, JPY: 110.12, AUD: 1.35, CAD: 1.25,
        CHF: 0.92, CNY: 6.45, SEK: 8.85, NZD: 1.42, MXN: 20.15,
        SGD: 1.35, HKD: 7.85, NOK: 8.45, KRW: 1180.50, TRY: 8.25,
        RUB: 73.50, INR: 74.25, BRL: 5.20, ZAR: 14.85, VND: 23050
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchExchangeRates();
    
    // Auto refresh mỗi 60 giây (chỉ cho tab rates)
    const interval = setInterval(() => {
      if (activeTab === 'rates') {
        fetchExchangeRates();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'rates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🌍 Exchange Rates
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'sources'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📡 Raw Sources
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'rates' ? (
          <>
            <Rates rates={rates} loading={loading} error={error} />
            
            {/* Refresh button */}
            <div className="text-center mt-6">
              <button
                onClick={fetchExchangeRates}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
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

// CSS styles cho RatesFromSources component
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '26px',
    color: '#1a202c',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '16px',
  },
  noData: {
    textAlign: 'center',
    color: '#718096',
    fontSize: '16px',
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  provider: {
    marginBottom: '16px',
    fontSize: '18px',
    color: '#2b6cb0',
  },
  rateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
  },
  rateItem: {
    backgroundColor: '#edf2f7',
    padding: '10px 12px',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '14px',
  },
  currency: {
    fontWeight: '600',
    marginRight: '4px',
  },
  value: {
    color: '#4a5568',
  },
};

// CSS cho spinner animation
const spinnerCSS = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Thêm CSS vào head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}

export default CombinedExchangeRateApp;