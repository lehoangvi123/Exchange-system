import React, { useState, useEffect } from 'react';

const SaveRateForm = () => {
  const [rates, setRates] = useState([
    { currency: 'AUD', value: '', name: 'Australian Dollar' },
    { currency: 'BGN', value: '', name: 'Bulgarian Lev' },
    { currency: 'BRL', value: '', name: 'Brazilian Real' }
  ]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load saved rates từ localStorage khi component mount
  useEffect(() => {
    const savedRates = localStorage.getItem('exchangeRates');
    const savedTime = localStorage.getItem('lastSavedTime');
    
    if (savedRates) {
      try {
        const parsedRates = JSON.parse(savedRates);
        setRates(parsedRates);
      } catch (error) {
        console.error('Error parsing saved rates:', error);
      }
    }
    
    if (savedTime) {
      setLastSaved(new Date(savedTime));
    }
  }, []);

  // Danh sách currencies có thể thêm
  const availableCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'PHP', name: 'Philippine Peso' }
  ];

  const handleRateChange = (index, value) => {
    const newRates = [...rates];
    newRates[index].value = value;
    setRates(newRates);
  };

  const addCurrency = () => {
    // Tìm currency chưa được thêm
    const usedCurrencies = rates.map(rate => rate.currency);
    const availableToAdd = availableCurrencies.filter(
      curr => !usedCurrencies.includes(curr.code)
    );

    if (availableToAdd.length > 0) {
      const newCurrency = availableToAdd[0];
      setRates([...rates, { 
        currency: newCurrency.code, 
        value: '', 
        name: newCurrency.name 
      }]);
    }
  };

  const removeCurrency = (index) => {
    if (rates.length > 1) {
      const newRates = rates.filter((_, i) => i !== index);
      setRates(newRates);
    }
  };

  const changeCurrency = (index, newCurrencyCode) => {
    const newRates = [...rates];
    const selectedCurrency = availableCurrencies.find(curr => curr.code === newCurrencyCode);
    newRates[index] = {
      ...newRates[index],
      currency: newCurrencyCode,
      name: selectedCurrency?.name || newCurrencyCode
    };
    setRates(newRates);
  };

  const validateRates = () => {
    for (let rate of rates) {
      if (!rate.value || parseFloat(rate.value) <= 0) {
        return { valid: false, message: `Vui lòng nhập giá trị hợp lệ cho ${rate.currency}` };
      }
    }
    
    // Kiểm tra duplicate currencies
    const currencies = rates.map(rate => rate.currency);
    const duplicates = currencies.filter((item, index) => currencies.indexOf(item) !== index);
    if (duplicates.length > 0) {
      return { valid: false, message: `Tiền tệ ${duplicates[0]} bị trùng lặp` };
    }
    
    return { valid: true };
  };

  const handleSubmit = async () => {
    // Validation
    const validation = validateRates();
    if (!validation.valid) {
      showMessage(validation.message, 'error');
      return;
    }

    setLoading(true);
    
    try {

      // Prepare data
      const rateData = {};
      rates.forEach(rate => {
        rateData[rate.currency] = parseFloat(rate.value);
      });

      // Save to API
      const response = await fetch('http://localhost:5000/api/rates/save', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(rateData),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Save to localStorage
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        const now = new Date();
        localStorage.setItem('lastSavedTime', now.toISOString());
        setLastSaved(now);
        
        showMessage('💾 Tỷ giá đã được lưu thành công!', 'success');
      } else {
        showMessage(`❌ Thất bại: ${data.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      showMessage('⚠️ Đã xảy ra lỗi khi gửi yêu cầu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const clearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu?')) {
      setRates(rates.map(rate => ({ ...rate, value: '' })));
    }
  };

  const getUsedCurrencies = () => {
    return rates.map(rate => rate.currency);
  };

  const getAvailableForSelect = (currentCurrency) => {
    const used = getUsedCurrencies();
    return availableCurrencies.filter(
      curr => curr.code === currentCurrency || !used.includes(curr.code)
    );
  };

  // CSS Styles Object
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '0.5rem'
    },
    headerIcon: {
      fontSize: '2rem'
    },
    mainTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0'
    },
    headerSubtitle: {
      color: '#6b7280',
      fontSize: '1rem',
      margin: '0'
    },
    lastSaved: {
      marginTop: '0.5rem',
      fontSize: '0.875rem',
      color: '#9ca3af'
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      padding: '1rem',
      borderRadius: '12px',
      fontWeight: '500'
    },
    messageSuccess: {
      backgroundColor: '#d1fae5',
      border: '1px solid #a7f3d0',
      color: '#065f46'
    },
    messageError: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      color: '#991b1b'
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    rateItem: {
      background: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s ease'
    },
    rateItemContent: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '1rem'
    },
    currencySelector: {
      flex: '1'
    },
    rateInputSection: {
      flex: '1'
    },
    fieldLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    currencySelect: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'white',
      transition: 'all 0.2s ease'
    },
    rateInputContainer: {
      position: 'relative'
    },
    currencyIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      fontSize: '1rem'
    },
    rateInput: {
      width: '100%',
      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },
    removeButton: {
      padding: '0.75rem',
      background: 'transparent',
      border: 'none',
      color: '#ef4444',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '1.25rem',
      marginTop: '1.5rem'
    },
    currencyInfo: {
      marginTop: '0.5rem',
      fontSize: '0.75rem',
      color: '#6b7280',
      fontStyle: 'italic'
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem',
      paddingTop: '1rem'
    },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem'
    },
    addBtn: {
      background: '#f3f4f6',
      color: '#374151'
    },
    clearBtn: {
      background: '#fef3c7',
      color: '#92400e'
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      padding: '1rem',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    submitButtonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed'
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite'
    },
    statsPanel: {
      marginTop: '2rem',
      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
      borderRadius: '12px',
      padding: '1.5rem'
    },
    statsContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: '#1e40af'
    },
    statsValue: {
      fontWeight: 'bold',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.headerIcon}>📈</span>
          <h3 style={styles.mainTitle}>Nhập tỷ giá và lưu</h3>
        </div>
        <p style={styles.headerSubtitle}>Cập nhật tỷ giá ngoại tệ mới nhất</p>
        
        {lastSaved && (
          <div style={styles.lastSaved}>
            Lần lưu cuối: {lastSaved.toLocaleString('vi-VN')}
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          ...styles.message,
          ...(messageType === 'success' ? styles.messageSuccess : styles.messageError)
        }}>
          <span>{messageType === 'success' ? '✅' : '❌'}</span>
          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      <div style={styles.formContainer}>
        {rates.map((rate, index) => (
          <div key={index} style={styles.rateItem}>
            <div style={styles.rateItemContent}>
              {/* Currency Selector */}
              <div style={styles.currencySelector}>
                <label style={styles.fieldLabel}>Tiền tệ</label>
                <select
                  value={rate.currency}
                  onChange={(e) => changeCurrency(index, e.target.value)}
                  style={styles.currencySelect}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  {getAvailableForSelect(rate.currency).map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Input */}
              <div style={styles.rateInputSection}>
                <label style={styles.fieldLabel}>Tỷ giá</label>
                <div style={styles.rateInputContainer}>
                  <span style={styles.currencyIcon}>💰</span>
                  <input
                    type="number"
                    value={rate.value}
                    onChange={(e) => handleRateChange(index, e.target.value)}
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    style={styles.rateInput}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  />
                </div>
              </div>

              {/* Remove Button */}
              {rates.length > 1 && (
                <button
                  onClick={() => removeCurrency(index)}
                  style={styles.removeButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#fee2e2';
                    e.target.style.color = '#dc2626';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ef4444';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Xóa tiền tệ"
                >
                  🗑️
                </button>
              )}
            </div>
            
            {/* Currency Info */}
            <div style={styles.currencyInfo}>{rate.name}</div>
          </div>
        ))}

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          {/* Add Currency */}
          {getUsedCurrencies().length < availableCurrencies.length && (
            <button
              onClick={addCurrency}
              style={{...styles.actionBtn, ...styles.addBtn}}
              onMouseEnter={(e) => {
                e.target.style.background = '#e5e7eb';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f3f4f6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>➕</span>
              Thêm tiền tệ
            </button>
          )}

          {/* Clear All */}
          <button
            onClick={clearAll}
            style={{...styles.actionBtn, ...styles.clearBtn}}
            onMouseEnter={(e) => {
              e.target.style.background = '#fde68a';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fef3c7';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span>🔄</span>
            Xóa tất cả
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.submitButton,
            ...(loading ? styles.submitButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {loading ? (
            <>
              <span style={styles.loadingSpinner}>⏳</span>
              Đang lưu...
            </>
          ) : (
            <>
              <span>💾</span>
              Lưu tỷ giá ({rates.length} loại tiền tệ)
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsPanel}>
        <div style={styles.statsContent}>
          <div style={styles.statsRow}>
            <span>📊 Tổng số tiền tệ:</span>
            <span style={styles.statsValue}>{rates.length}</span>
          </div>
          <div style={styles.statsRow}>
            <span>✏️ Đã nhập giá trị:</span>
            <span style={styles.statsValue}>
              {rates.filter(rate => rate.value).length}/{rates.length}
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .rate-item-content {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          .action-buttons {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SaveRateForm;