import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Mock translation function for components that use useTranslation
const useTranslation = () => {
  const t = (key) => {
    const translations = {
      'updateSettings': '⚙️ Cập nhật cài đặt',
      'email': 'Email',
      'theme': 'Giao diện',
      'language': 'Ngôn ngữ',
      'notifications': 'Thông báo',
      'light': 'Sáng',
      'dark': 'Tối',
      'submit': 'Cập nhật',
      'success': '✅ Cập nhật thành công!'
    };
    return translations[key] || key;
  };
  
  return { t };
};

const CombinedUserForms = () => {
  const [activeTab, setActiveTab] = useState('save');

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    backgroundColor: isActive ? '#3b82f6' : '#e5e7eb',
    color: isActive ? 'white' : '#374151',
    transition: 'all 0.3s ease',
    marginRight: '4px'
  });

  const containerStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  const tabContainerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px 20px 0 20px',
    borderBottom: '1px solid #e5e7eb'
  };

  const contentStyle = {
    padding: '30px'
  };

  return (
    <div style={containerStyle}>
      {/* Tab Navigation */}
      <div style={tabContainerStyle}>
        <div style={{ display: 'flex' }}>
          <button
            style={tabStyle(activeTab === 'save')}
            onClick={() => setActiveTab('save')}
          >
            👤 Tạo User
          </button>
          <button
            style={tabStyle(activeTab === 'update')}
            onClick={() => setActiveTab('update')}
          >
            🔄 Cập nhật User
          </button>
          <button
            style={tabStyle(activeTab === 'preferences')}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Cài đặt
          </button>
          <button
            style={tabStyle(activeTab === 'warmup')}
            onClick={() => setActiveTab('warmup')}
          >
            🔥 Warmup Cache
          </button>
          <button
            style={tabStyle(activeTab === 'crossrate')}
            onClick={() => setActiveTab('crossrate')}
          >
            🌐 Cross Rate
          </button>
          <button
            style={tabStyle(activeTab === 'exchange')}
            onClick={() => setActiveTab('exchange')}
          >
            💱 Exchange Display
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={contentStyle}>
        {activeTab === 'save' && <SaveUserForm />}
        {activeTab === 'update' && <UpdateUserForm />}
        {activeTab === 'preferences' && <UpdatePreferences />}
        {activeTab === 'warmup' && <WarmupButton />}
        {activeTab === 'crossrate' && <CrossRateConverter />}
        {activeTab === 'exchange' && <ExchangeRateDisplay />}
      </div>
    </div>
  );
};

// Exchange Rate Display Component with Real-time Anomaly Detection
const ExchangeRateDisplay = () => {
  const [rates, setRates] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Connection status handlers
    newSocket.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Socket connected to exchange rate server');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      console.log('Socket disconnected from exchange rate server');
    });

    newSocket.on('connect_error', () => {
      setConnectionStatus('Connection Error');
      console.error('Socket connection error');
    });

    // Rate update handler
    newSocket.on('rateUpdate', (data) => {
      console.log("Received rateUpdate: ", data);
      setRates(data);
    });

    // Anomaly detection handler
    newSocket.on('rateAnomalies', (data) => {
      console.log("Detected rate anomalies: ", data);
      setAnomalies(data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.off('rateUpdate');
      newSocket.off('rateAnomalies');
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, []);

  const styles = {
    container: {
      maxWidth: '100%',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      textAlign: 'center',
      marginBottom: '24px',
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937',
    },
    connectionStatus: {
      textAlign: 'center',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      marginBottom: '20px',
      fontWeight: '500',
      backgroundColor: 
        connectionStatus === 'Connected' ? '#dcfce7' :
        connectionStatus === 'Connecting...' ? '#fef3c7' : '#fee2e2',
      color:
        connectionStatus === 'Connected' ? '#166534' :
        connectionStatus === 'Connecting...' ? '#92400e' : '#dc2626',
      border: `1px solid ${
        connectionStatus === 'Connected' ? '#bbf7d0' :
        connectionStatus === 'Connecting...' ? '#fde68a' : '#fecaca'
      }`
    },
    theoryBox: {
      backgroundColor: '#e0f2fe',
      border: '1px solid #0ea5e9',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    theoryTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '12px',
      fontSize: '16px',
    },
    codeExample: {
      backgroundColor: '#f1f5f9',
      padding: '4px 8px',
      borderRadius: '4px',
      fontFamily: 'Monaco, Consolas, monospace',
      fontSize: '13px',
      color: '#475569',
    },
    anomalyAlert: {
      backgroundColor: '#fefce8',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #facc15'
    },
    anomalyTitle: {
      fontWeight: '600',
      color: '#a16207',
      marginBottom: '12px',
      fontSize: '16px',
    },
    anomalyList: {
      margin: '8px 0',
      paddingLeft: '20px',
      color: '#92400e',
    },
    anomalyItem: {
      marginBottom: '6px',
      fontSize: '14px',
    },
    tableContainer: {
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
    },
    tableHeader: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      borderBottom: '2px solid #2563eb',
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '14px',
      color: '#374151',
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
      fontSize: '16px',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px',
    },
    statCard: {
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#64748b',
      textTransform: 'uppercase',
      fontWeight: '500',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>💱 Real-time Exchange Rate Monitor</h3>

      {/* Connection Status */}
      <div style={styles.connectionStatus}>
        {connectionStatus === 'Connected' && '🟢'}
        {connectionStatus === 'Connecting...' && '🟡'}
        {connectionStatus === 'Disconnected' && '🔴'}
        {connectionStatus === 'Connection Error' && '❌'}
        {' '}{connectionStatus}
      </div>

      {/* Statistics */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{Object.keys(rates).length}</div>
          <div style={styles.statLabel}>Total Currencies</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{anomalies.length}</div>
          <div style={styles.statLabel}>Active Anomalies</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {connectionStatus === 'Connected' ? 'Live' : 'Offline'}
          </div>
          <div style={styles.statLabel}>Status</div>
        </div>
      </div>

      {/* Theory Box */}
      <div style={styles.theoryBox}>
        <div style={styles.theoryTitle}>💡 Anomaly Detection Theory:</div>
        <div>
          <strong>1️⃣ Rate Tracking:</strong> Lưu tỷ giá trước đó (<code style={styles.codeExample}>oldRate</code>) và tỷ giá hiện tại (<code style={styles.codeExample}>newRate</code>)<br/>
          <strong>2️⃣ Change Calculation:</strong> Tính phần trăm thay đổi theo công thức:<br/>
          <div style={{...styles.codeExample, margin: '8px 0', padding: '8px', display: 'block'}}>
            change = |newRate - oldRate| / oldRate × 100%
          </div>
          <strong>3️⃣ Threshold Detection:</strong> Nếu <code style={styles.codeExample}>change &gt; threshold</code> (ví dụ <strong>10%</strong>), được xem là <strong>bất thường</strong><br/>
          <strong>📊 Example:</strong> oldRate = 10, newRate = 12 → change = (12-10)/10 = 20% → ⚠️ Anomaly detected
        </div>
      </div>

      {/* Anomaly Alert */}
      {anomalies.length > 0 && (
        <div style={styles.anomalyAlert}>
          <div style={styles.anomalyTitle}>⚠️ Detected Rate Anomalies:</div>
          <ul style={styles.anomalyList}>
            {anomalies.map((anomaly, index) => (
              <li key={index} style={styles.anomalyItem}>
                <strong>{anomaly.currency}:</strong> {anomaly.oldValue} → {anomaly.newValue} 
                <span style={{color: '#dc2626', fontWeight: 'bold'}}>
                  {' '}({anomaly.changePercent > 0 ? '+' : ''}{anomaly.changePercent}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exchange Rates Table */}
      {Object.keys(rates).length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Currency Code</th>
                <th style={styles.th}>Exchange Rate</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rates).map(([code, value]) => {
                const hasAnomaly = anomalies.some(a => a.currency === code);
                return (
                  <tr key={code} style={{backgroundColor: hasAnomaly ? '#fef3c7' : 'transparent'}}>
                    <td style={styles.td}>
                      <strong>{code}</strong>
                      {hasAnomaly && <span style={{color: '#f59e0b', marginLeft: '8px'}}>⚠️</span>}
                    </td>
                    <td style={styles.td}>
                      {typeof value === 'number' ? value.toFixed(6) : value}
                    </td>
                    <td style={styles.td}>
                      {hasAnomaly ? 
                        <span style={{color: '#dc2626', fontWeight: '500'}}>Anomaly</span> : 
                        <span style={{color: '#16a34a', fontWeight: '500'}}>Normal</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.noData}>
          {connectionStatus === 'Connected' ? 
            '📊 Waiting for exchange rate data...' : 
            '🔌 Please check server connection'
          }
        </div>
      )}
    </div>
  );
};

// Cross Rate Converter Component
const CrossRateConverter = () => {
  const [base, setBase] = useState('EUR');
  const [quote, setQuote] = useState('JPY');
  const [via, setVia] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/rates/convert-cross', {
        from: base,
        to: quote,
        via,
        amount
      });

      setRate(res.data.rate);
      setResult(res.data.result);
    } catch (err) {
      setRate(null);
      setResult(null);
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '100%',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      textAlign: 'center',
      marginBottom: '24px',
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937',
    },
    formula: {
      fontSize: '14px',
      backgroundColor: '#e0f2fe',
      color: '#0369a1',
      padding: '16px',
      borderRadius: '8px',
      lineHeight: '1.6',
      border: '1px solid #bae6fd',
      marginBottom: '24px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      marginTop: '8px',
      opacity: loading ? 0.7 : 1,
    },
    result: {
      marginTop: '24px',
      textAlign: 'center',
      color: '#16a34a',
      backgroundColor: '#dcfce7',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #bbf7d0',
    },
    resultTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#166534',
    },
    resultItem: {
      fontSize: '16px',
      marginBottom: '8px',
      color: '#15803d',
    },
    error: {
      marginTop: '24px',
      textAlign: 'center',
      color: '#b91c1c',
      backgroundColor: '#fee2e2',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      fontSize: '15px',
    },
    infoBox: {
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
    },
    infoTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '8px',
      fontSize: '16px',
    },
    infoText: {
      fontSize: '14px',
      color: '#0369a1',
      lineHeight: '1.5',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🌐 Cross Rate Converter</h3>

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>ℹ️ Cross Rate Formula:</div>
        <div style={styles.infoText}>
          Cross rate cho phép tính tỷ giá giữa hai tiền tệ thông qua một tiền tệ trung gian.<br/>
          <strong>Công thức:</strong> {base}/{quote} = ({base}/{via}) ÷ ({quote}/{via})
        </div>
      </div>

      <div style={styles.formula}>
        <strong>📌 Cách tính:</strong><br />
        <code>1. {base}/{via} = A</code><br />
        <code>2. {quote}/{via} = B</code><br />
        <code>3. {base}/{quote} = A ÷ B</code><br />
        → <strong>Kết quả: {amount} {base} = ? {quote}</strong>
      </div>

      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Base Currency (From):</label>
          <input
            type="text"
            placeholder="EUR"
            value={base}
            onChange={(e) => setBase(e.target.value.toUpperCase())}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Quote Currency (To):</label>
          <input
            type="text"
            placeholder="JPY"
            value={quote}
            onChange={(e) => setQuote(e.target.value.toUpperCase())}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.inputRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Via Currency (Through):</label>
          <input
            type="text"
            placeholder="USD"
            value={via}
            onChange={(e) => setVia(e.target.value.toUpperCase())}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Amount:</label>
          <input
            type="number"
            placeholder="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={styles.input}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <button 
        onClick={handleConvert} 
        style={styles.button}
        disabled={loading}
      >
        {loading ? '⏳ Converting...' : '💱 Convert Cross Rate'}
      </button>

      {rate !== null && result !== null && (
        <div style={styles.result}>
          <div style={styles.resultTitle}>💱 Cross Rate Result</div>
          <div style={styles.resultItem}>
            <strong>Exchange Rate:</strong> 1 {base} = {rate.toFixed(6)} {quote}
          </div>
          <div style={styles.resultItem}>
            <strong>Converted Amount:</strong> {amount} {base} = <strong>{result.toFixed(2)} {quote}</strong>
          </div>
          <div style={styles.resultItem}>
            <small>🔄 Via {via} currency</small>
          </div>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          ❌ <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

// Warmup Button Component
const WarmupButton = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [customPairs, setCustomPairs] = useState('AUD_CAD,AUD_BRL');

  const handleWarmup = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const pairs = customPairs
        .split(',')
        .map(pair => pair.trim())
        .filter(pair => pair);

      const res = await fetch('http://localhost:5000/api/rates/cache/warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairs })
      });
      
      const data = await res.json();
      
      if (data.success || res.ok) {
        setMessage('🔥 Cache đã được warmup thành công!');
        console.log('🔥 Cache warmed:', data);
      } else {
        setMessage(`❌ Lỗi: ${data.message || 'Không thể warmup cache'}`);
      }
    } catch (err) {
      console.error('❌ Lỗi gọi warmupCache:', err);
      setMessage('❌ Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      textAlign: 'center',
    },
    heading: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#1f2937',
    },
    description: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    inputGroup: {
      marginBottom: '24px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    button: {
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      padding: '14px 28px',
      fontSize: '18px',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      opacity: loading ? 0.7 : 1,
      transform: loading ? 'scale(0.98)' : 'scale(1)',
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: message.includes('✅') || message.includes('🔥') ? '#ecfdf5' : '#fef2f2',
      color: message.includes('✅') || message.includes('🔥') ? '#065f46' : '#dc2626',
    },
    infoBox: {
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      textAlign: 'left',
    },
    infoTitle: {
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '8px',
    },
    infoText: {
      fontSize: '14px',
      color: '#0369a1',
      lineHeight: '1.4',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>🔥 Warmup Cache System</h3>
      
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>ℹ️ Thông tin:</div>
        <div style={styles.infoText}>
          Warmup cache giúp tải trước dữ liệu tỷ giá vào bộ nhớ đệm để tăng tốc độ truy xuất. 
          Nhập các cặp tiền tệ cách nhau bởi dấu phẩy.
        </div>
      </div>

      <p style={styles.description}>
        Khởi tạo cache cho các cặp tỷ giá để cải thiện hiệu suất hệ thống
      </p>

      <div style={styles.inputGroup}>
        <label style={styles.label}>
          Cặp tiền tệ cần warmup:
        </label>
        <input
          type="text"
          value={customPairs}
          onChange={(e) => setCustomPairs(e.target.value)}
          style={styles.input}
          placeholder="VD: AUD_CAD,USD_VND,EUR_GBP"
        />
      </div>

      <button 
        onClick={handleWarmup} 
        disabled={loading}
        style={styles.button}
      >
        {loading ? '⏳ Đang warmup...' : '🔥 Warmup Cache'}
      </button>

      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
};

// Save User Form Component
const SaveUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredCurrencies, setPreferredCurrencies] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currenciesArray = preferredCurrencies
      .split(',')
      .map(code => code.trim().toUpperCase())
      .filter(code => code);

    try {
      const res = await fetch('http://localhost:5000/api/users/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          preferredCurrencies: currenciesArray
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Người dùng đã được lưu thành công!');
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setPreferredCurrencies('');
      } else {
        setMessage(`❌ Thất bại: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ Đã xảy ra lỗi khi gửi yêu cầu');
    }
  };

  const styles = {
    heading: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      textAlign: 'center',
      color: '#1f2937',
    },
    label: {
      display: 'block',
      marginBottom: '16px',
      fontWeight: '500',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginTop: '6px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    button: {
      marginTop: '24px',
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      textAlign: 'center',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
      color: message.includes('✅') ? '#065f46' : '#dc2626',
    }
  };

  return (
    <div>
      <h3 style={styles.heading}>👤 Tạo người dùng mới</h3>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          Tên:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={styles.input}
            placeholder="Nhập tên người dùng"
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="Nhập địa chỉ email"
          />
        </label>
        <label style={styles.label}>
          Mật khẩu:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Nhập mật khẩu"
          />
        </label>
        <label style={styles.label}>
          Tiền tệ ưa thích:
          <input
            type="text"
            value={preferredCurrencies}
            onChange={e => setPreferredCurrencies(e.target.value)}
            required
            style={styles.input}
            placeholder="VD: USD,VND,EUR"
          />
        </label>
        <button type="submit" style={styles.button}>
          💾 Tạo người dùng
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Update User Form Component
const UpdateUserForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [currencies, setCurrencies] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    const preferredCurrencies = currencies
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(c => c);

    try {
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          updates: {
            name,
            preferredCurrencies
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Cập nhật thành công!');
      } else {
        setMessage(`❌ Thất bại: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Lỗi khi gửi yêu cầu');
    }
  };

  const styles = {
    heading: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      textAlign: 'center',
      color: '#1f2937',
    },
    label: {
      display: 'block',
      marginBottom: '16px',
      color: '#374151',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginTop: '6px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '24px',
      transition: 'background-color 0.3s ease',
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      textAlign: 'center',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
      color: message.includes('✅') ? '#065f46' : '#dc2626',
    }
  };

  return (
    <div>
      <h3 style={styles.heading}>🔄 Cập nhật thông tin người dùng</h3>
      <form onSubmit={handleUpdate}>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="Nhập email cần cập nhật"
          />
        </label>

        <label style={styles.label}>
          Tên mới:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
            placeholder="Nhập tên mới (tùy chọn)"
          />
        </label>

        <label style={styles.label}>
          Tiền tệ ưa thích:
          <input
            type="text"
            value={currencies}
            onChange={e => setCurrencies(e.target.value)}
            style={styles.input}
            placeholder="VD: USD,VND,EUR (tùy chọn)"
          />
        </label>

        <button type="submit" style={styles.button}>💾 Cập nhật</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Update Preferences Component
const UpdatePreferences = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: '',
    theme: 'light',
    language: 'en',
    notifications: true  
  });
  const [message, setMessage] = useState('');     

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/users/preferences`, {
        email: form.email,
        preferences: {
          theme: form.theme,
          language: form.language,
          notifications: form.notifications     
        }
      });

      if (res.data.success) {
        setMessage(t('success'));
      } else {
        setMessage('❌ Cập nhật thất bại.');
      }
    } catch (err) {
      console.error('Lỗi:', err.message);
      setMessage('❌ Lỗi kết nối.');
    }
  };

  const styles = {
    heading: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      textAlign: 'center',
      color: '#1f2937'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
    },
    select: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      marginBottom: '16px',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
    },
    checkboxWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
    },
    checkboxLabel: {
      fontSize: '16px',
      color: '#374151',
      cursor: 'pointer',
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    message: {
      marginTop: '16px',
      fontSize: '15px',
      textAlign: 'center',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: message.includes('✅') ? '#ecfdf5' : '#fef2f2',
      color: message.includes('✅') ? '#065f46' : '#dc2626',
    }
  };

  return (
    <div>
      <h3 style={styles.heading}>{t('updateSettings')}</h3>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>{t('email')}:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Nhập email của bạn"
        />

        <label style={styles.label}>{t('theme')}:</label>
        <select
          name="theme"
          value={form.theme}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="light">{t('light')}</option>
          <option value="dark">{t('dark')}</option>
        </select>

        <label style={styles.label}>{t('language')}:</label>
        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>

        <div style={styles.checkboxWrapper}>
          <input
            type="checkbox"
            name="notifications"
            checked={form.notifications}
            onChange={handleChange}
            style={styles.checkbox}
          />
          <label style={styles.checkboxLabel}>{t('notifications')}</label>
        </div>

        <button type="submit" style={styles.button}>{t('submit')}</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default CombinedUserForms;