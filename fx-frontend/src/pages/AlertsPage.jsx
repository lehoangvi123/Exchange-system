import React, { useState, useEffect, useRef } from 'react';

// 🛎️ Alert Creation Component
const CreateAlert = ({ onAlertCreated }) => {
  const [formData, setFormData] = useState({
    currencyPair: 'USD/VND',
    alertType: 'above',
    targetRate: '',
    email: '',
    enabled: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const currencyPairs = [
    'USD/VND', 'EUR/VND', 'GBP/VND', 'JPY/VND',
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetRate || !formData.email) {
      setMessage('❌ Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate API call to create alert
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAlert = {
        id: Date.now(),
        ...formData,
        targetRate: parseFloat(formData.targetRate),
        createdAt: new Date(),
        status: 'active',
        lastChecked: null,
        triggered: false
      };

      onAlertCreated(newAlert);
      setMessage('✅ Cảnh báo đã được tạo thành công!');
      setFormData({ ...formData, targetRate: '', email: '' });
      
    } catch (error) {
      setMessage('❌ Lỗi tạo cảnh báo: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>🛎️ Tạo Cảnh Báo Tỷ Giá</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cặp tiền tệ</label>
            <select
              value={formData.currencyPair}
              onChange={(e) => setFormData({...formData, currencyPair: e.target.value})}
              style={styles.select}
            >
              {currencyPairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Loại cảnh báo</label>
            <select
              value={formData.alertType}
              onChange={(e) => setFormData({...formData, alertType: e.target.value})}
              style={styles.select}
            >
              <option value="above">Trên mức</option>
              <option value="below">Dưới mức</option>
              <option value="equal">Bằng mức</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tỷ giá mục tiêu</label>
            <input
              type="number"
              step="0.0001"
              value={formData.targetRate}
              onChange={(e) => setFormData({...formData, targetRate: e.target.value})}
              placeholder="VD: 26200"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email thông báo</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
              style={styles.checkbox}
            />
            Kích hoạt cảnh báo ngay
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.primaryButton,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? '⏳ Đang tạo...' : '➕ Tạo Cảnh Báo'}
        </button>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
            color: message.includes('✅') ? '#166534' : '#dc2626',
            borderColor: message.includes('✅') ? '#bbf7d0' : '#fecaca'
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

// 📊 Live Rates Dashboard
const LiveRatesDashboard = ({ currentRates, lastUpdate, error }) => {
  const majorPairs = [
    { pair: 'USD/VND', rate: currentRates?.VND, format: 'VND' },
    { pair: 'EUR/VND', rate: currentRates?.VND && currentRates?.EUR ? currentRates.VND / currentRates.EUR : null, format: 'VND' },
    { pair: 'EUR/USD', rate: currentRates?.EUR ? 1 / currentRates.EUR : null, format: 'USD' },
    { pair: 'GBP/USD', rate: currentRates?.GBP ? 1 / currentRates.GBP : null, format: 'USD' },
    { pair: 'USD/JPY', rate: currentRates?.JPY, format: 'JPY' },
    { pair: 'AUD/USD', rate: currentRates?.AUD ? 1 / currentRates.AUD : null, format: 'USD' }
  ];

  const formatRate = (rate, format) => {
    if (!rate) return 'N/A';
    
    switch (format) {
      case 'VND':
        return Math.round(rate).toLocaleString('vi-VN');
      case 'JPY':
        return rate.toFixed(2);
      case 'USD':
        return rate.toFixed(4);
      default:
        return rate.toFixed(4);
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>📊 Tỷ Giá Hiện Tại</h2>
        <div style={styles.updateStatus}>
          {error ? (
            <span style={{color: '#dc2626'}}>❌ {error}</span>
          ) : (
            <span style={{color: '#059669'}}>
              🟢 Cập nhật: {lastUpdate?.toLocaleTimeString('vi-VN')}
            </span>
          )}
        </div>
      </div>
      
      <div style={styles.ratesGrid}>
        {majorPairs.map(({ pair, rate, format }) => (
          <div key={pair} style={styles.rateCard}>
            <div style={styles.ratePair}>{pair}</div>
            <div style={styles.rateValue}>
              {formatRate(rate, format)}
            </div>
            <div style={styles.rateUnit}>
              {format === 'VND' ? 'VND' : format === 'JPY' ? 'JPY' : 'USD'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎯 Alerts Management 
const AlertsManagement = ({ alerts, onDeleteAlert, onToggleAlert }) => {
  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'above': return '📈';
      case 'below': return '📉';
      case 'equal': return '🎯';
      default: return '🔔';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#059669';
      case 'triggered': return '#dc2626';
      case 'disabled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>🎯 Quản Lý Cảnh Báo</h2>
      
      {alerts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔔</div>
          <p>Chưa có cảnh báo nào được tạo</p>
          <p style={{fontSize: '0.9rem', color: '#6b7280'}}>
            Tạo cảnh báo đầu tiên để theo dõi tỷ giá
          </p>
        </div>
      ) : (
        <div style={styles.alertsList}>
          {alerts.map(alert => (
            <div key={alert.id} style={styles.alertCard}>
              <div style={styles.alertHeader}>
                <div style={styles.alertIcon}>
                  {getAlertIcon(alert.alertType)}
                </div>
                <div style={styles.alertInfo}>
                  <div style={styles.alertPair}>{alert.currencyPair}</div>
                  <div style={styles.alertCondition}>
                    {alert.alertType === 'above' ? 'Trên' : 
                     alert.alertType === 'below' ? 'Dưới' : 'Bằng'} {alert.targetRate.toLocaleString()}
                  </div>
                </div>
                <div style={styles.alertStatus}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: getStatusColor(alert.status) + '20',
                    color: getStatusColor(alert.status)
                  }}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={styles.alertDetails}>
                <div style={styles.alertMeta}>
                  <span>📧 {alert.email}</span>
                  <span>📅 {alert.createdAt.toLocaleDateString('vi-VN')}</span>
                </div>
                
                <div style={styles.alertActions}>
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: alert.enabled ? '#fbbf24' : '#10b981'
                    }}
                  >
                    {alert.enabled ? '⏸️ Tạm dừng' : '▶️ Kích hoạt'}
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: '#dc2626'
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 🧰 API Cache Tools
const CacheTools = ({ onCacheAction }) => {
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchCacheStats();
  }, []);

  const fetchCacheStats = async () => {
    try {
      // Simulate cache stats
      const stats = {
        totalEntries: 15,
        hitRate: 89.5,
        missRate: 10.5,
        averageResponseTime: 45,
        lastCleared: new Date(Date.now() - 2 * 60 * 60 * 1000),
        cacheSize: '2.3MB'
      };
      setCacheStats(stats);
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    }
  };

  const handleCacheAction = async (action) => {
    setLoading({...loading, [action]: true});
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      let message = '';
      switch (action) {
        case 'clear':
          message = '✅ Đã xóa toàn bộ cache';
          break;
        case 'refresh':
          message = '✅ Đã làm mới cache với dữ liệu mới';
          break;
        case 'optimize':
          message = '✅ Đã tối ưu hóa cache';
          break;
        default:
          message = '✅ Thao tác thành công';
      }
      
      onCacheAction(message);
      await fetchCacheStats();
      
    } catch (error) {
      onCacheAction('❌ Lỗi thực hiện thao tác: ' + error.message);
    } finally {
      setLoading({...loading, [action]: false});
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>🧰 Quản Lý Cache API</h2>
      
      {cacheStats && (
        <div style={styles.cacheStatsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>{cacheStats.totalEntries}</div>
            <div style={styles.statLabel}>Cache Entries</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statValue}>{cacheStats.hitRate}%</div>
            <div style={styles.statLabel}>Hit Rate</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚡</div>
            <div style={styles.statValue}>{cacheStats.averageResponseTime}ms</div>
            <div style={styles.statLabel}>Avg Response</div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💾</div>
            <div style={styles.statValue}>{cacheStats.cacheSize}</div>
            <div style={styles.statLabel}>Cache Size</div>
          </div>
        </div>
      )}
      
      <div style={styles.cacheActions}>
        <button
          onClick={() => handleCacheAction('refresh')}
          disabled={loading.refresh}
          style={{...styles.cacheButton, backgroundColor: '#059669'}}
        >
          {loading.refresh ? '⏳ Đang làm mới...' : '🔄 Làm mới Cache'}
        </button>
        
        <button
          onClick={() => handleCacheAction('optimize')}
          disabled={loading.optimize}
          style={{...styles.cacheButton, backgroundColor: '#2563eb'}}
        >
          {loading.optimize ? '⏳ Đang tối ưu...' : '⚡ Tối ưu Cache'}
        </button>
        
        <button
          onClick={() => handleCacheAction('clear')}
          disabled={loading.clear}
          style={{...styles.cacheButton, backgroundColor: '#dc2626'}}
        >
          {loading.clear ? '⏳ Đang xóa...' : '🧹 Xóa Cache'}
        </button>
      </div>
    </div>
  );
};

// 📢 Main Alerts & Dashboard Page
export default function AlertsAndDashboardPage() {
  const [alerts, setAlerts] = useState([]);
  const [currentRates, setCurrentRates] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchCurrentRates();
    
    // Fetch rates every 30 seconds
    intervalRef.current = setInterval(fetchCurrentRates, 30000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Check alerts whenever rates update
    if (currentRates && alerts.length > 0) {
      checkAlerts();
    }
  }, [currentRates, alerts]);

  const fetchCurrentRates = async () => {
    try {
      setError(null);
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.rates) {
        throw new Error('Invalid API response');
      }
      
      setCurrentRates(data.rates);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError(err.message);
      
      // Fallback mock data if API fails
      const mockRates = {
        VND: 26158,
        EUR: 0.9234,
        GBP: 0.7891,
        JPY: 149.85,
        AUD: 1.4567,
        CAD: 1.3456
      };
      setCurrentRates(mockRates);
      setLastUpdate(new Date());
    }
  };

  const checkAlerts = () => {
    alerts.forEach(alert => {
      if (!alert.enabled || alert.status === 'triggered') return;
      
      const [base, target] = alert.currencyPair.split('/');
      let currentRate = null;
      
      // Calculate current rate based on pair
      if (base === 'USD' && target === 'VND') {
        currentRate = currentRates.VND;
      } else if (base === 'EUR' && target === 'VND') {
        currentRate = currentRates.VND / currentRates.EUR;
      } else if (base === 'EUR' && target === 'USD') {
        currentRate = 1 / currentRates.EUR;
      } else if (base === 'GBP' && target === 'USD') {
        currentRate = 1 / currentRates.GBP;
      } else if (base === 'USD' && target === 'JPY') {
        currentRate = currentRates.JPY;
      }
      
      if (currentRate) {
        let triggered = false;
        
        switch (alert.alertType) {
          case 'above':
            triggered = currentRate >= alert.targetRate;
            break;
          case 'below':
            triggered = currentRate <= alert.targetRate;
            break;
          case 'equal':
            triggered = Math.abs(currentRate - alert.targetRate) <= alert.targetRate * 0.001; // 0.1% tolerance
            break;
        }
        
        if (triggered) {
          triggerAlert(alert, currentRate);
        }
      }
    });
  };

  const triggerAlert = (alert, currentRate) => {
    // Update alert status
    setAlerts(prevAlerts =>
      prevAlerts.map(a =>
        a.id === alert.id
          ? { ...a, status: 'triggered', lastTriggered: new Date() }
          : a
      )
    );
    
    // Show notification
    setNotification(
      `🚨 Cảnh báo ${alert.currencyPair}: Tỷ giá hiện tại ${currentRate.toLocaleString()} ${alert.alertType === 'above' ? 'vượt' : alert.alertType === 'below' ? 'dưới' : 'đạt'} mức ${alert.targetRate.toLocaleString()}`
    );
    
    // Simulate email notification
    console.log(`📧 Sending alert email to ${alert.email}`);
  };

  const handleAlertCreated = (newAlert) => {
    setAlerts(prev => [...prev, newAlert]);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setNotification('✅ Đã xóa cảnh báo');
  };

  const handleToggleAlert = (alertId) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, enabled: !alert.enabled, status: alert.enabled ? 'disabled' : 'active' }
          : alert
      )
    );
  };

  const handleCacheAction = (message) => {
    setNotification(message);
  };

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>📢 Quản Lý Cảnh Báo & Tỷ Giá</h1>
        <p style={styles.pageSubtitle}>
          Theo dõi tỷ giá thời gian thực từ exchangerate-api.com
        </p>
      </div>

      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}

      <LiveRatesDashboard 
        currentRates={currentRates}
        lastUpdate={lastUpdate}
        error={error}
      />

      <CreateAlert onAlertCreated={handleAlertCreated} />

      <AlertsManagement 
        alerts={alerts}
        onDeleteAlert={handleDeleteAlert}
        onToggleAlert={handleToggleAlert}
      />

      <CacheTools onCacheAction={handleCacheAction} />
    </div>
  );
}

// 🎨 Comprehensive Styles
const styles = {
  container: {
    width: '1300px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#6b7280',
    margin: 0
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  updateStatus: {
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  // Form Styles
  form: {
    maxWidth: '800px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: 'white',
    outline: 'none'
  },
  checkboxGroup: {
    marginBottom: '1.5rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151'
  },
  checkbox: {
    width: '1rem',
    height: '1rem'
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: '1px solid'
  },
  // Rates Grid
  ratesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  rateCard: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  ratePair: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  rateValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.25rem'
  },
  rateUnit: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  // Alerts Management
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  alertCard: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb'
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  alertIcon: {
    fontSize: '1.5rem',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  alertInfo: {
    flex: 1
  },
  alertPair: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  alertCondition: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  alertStatus: {
    display: 'flex',
    alignItems: 'center'
  },
  alertDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem'
  },
  alertMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  alertActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  actionButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  // Cache Tools
  cacheStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.25rem'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  cacheActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  cacheButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '150px'
  },
  notification: {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    backgroundColor: 'white',
    color: '#1f2937',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    zIndex: 1000,
    maxWidth: '400px',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'slideInRight 0.3s ease-out'
  }
};

// Add CSS animation for notification
const notificationCSS = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.rate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.input:focus, .select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.primary-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cache-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.alert-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .rates-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .cache-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .alert-details {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .alert-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .cache-actions {
    flex-direction: column;
  }
  
  .notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 1rem;
  }
  
  .section {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .rates-grid {
    grid-template-columns: 1fr;
  }
  
  .cache-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .alert-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = notificationCSS;
  document.head.appendChild(style);
}