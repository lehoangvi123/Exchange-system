import React, { useState, useEffect } from 'react';

// Modern Currency Converter Component
function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('VND');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('convert');
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Currency data với flags
  const allCurrencies = [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound', symbol: '£' },
    { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
    { code: 'VND', flag: '🇻🇳', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'KRW', flag: '🇰🇷', name: 'South Korean Won', symbol: '₩' },
    { code: 'THB', flag: '🇹🇭', name: 'Thai Baht', symbol: '฿' },
    { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso', symbol: '₱' },
    { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'TWD', flag: '🇹🇼', name: 'Taiwan Dollar', symbol: 'NT$' },
    { code: 'NZD', flag: '🇳🇿', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SEK', flag: '🇸🇪', name: 'Swedish Krona', symbol: 'kr' }
  ];

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'VND', 'CNY'];

  // Fetch exchange rates
  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 300000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.currency-dropdown')) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data && data.rates) {
        setExchangeRates(data.rates);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      setError('Không thể tải tỷ giá');
    }
  };

  const handleConvert = () => {
    if (!from || !to || !amount || !exchangeRates) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const fromRate = from === 'USD' ? 1 : exchangeRates[from];
      const toRate = to === 'USD' ? 1 : exchangeRates[to];
      
      if (!fromRate || !toRate) {
        throw new Error('Currency not supported');
      }

      // Convert via USD as base
      const usdAmount = parseFloat(amount) / fromRate;
      const result = usdAmount * toRate;

      setConvertedAmount({
        amount: parseFloat(amount),
        from,
        to,
        result,
        rate: toRate / fromRate
      });
    } catch (err) {
      setError(err.message || 'Chuyển đổi thất bại');
      setConvertedAmount(null);
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
    setConvertedAmount(null);
  };

  const CurrencySelector = ({ 
    value, 
    onChange, 
    search, 
    setSearch, 
    showDropdown, 
    setShowDropdown, 
    placeholder,
    label 
  }) => {
    const selectedCurrency = allCurrencies.find(c => c.code === value);
    const filteredCurrencies = allCurrencies.filter(currency =>
      currency.code.toLowerCase().includes(search.toLowerCase()) ||
      currency.name.toLowerCase().includes(search.toLowerCase())
    );
    
    return (
      <div style={styles.currencyGroup}>
        <label style={styles.currencyLabel}>{label}</label>
        <div style={styles.currencySelector} className="currency-dropdown">
          <div 
            style={styles.selectedCurrency}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div style={styles.currencyDisplay}>
              <span style={styles.currencyFlag}>{selectedCurrency?.flag}</span>
              <div style={styles.currencyInfo}>
                <span style={styles.currencyCode}>{selectedCurrency?.code}</span>
                <span style={styles.currencyName}>{selectedCurrency?.name}</span>
              </div>
            </div>
            <span style={{...styles.dropdownArrow, transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              ⌄
            </span>
          </div>
          
          {showDropdown && (
            <div style={styles.dropdownMenu}>
              <input
                type="text"
                placeholder={`Search ${placeholder}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                autoFocus
              />
              
              <div style={styles.currencyList}>
                {search === '' && (
                  <div style={styles.popularSection}>
                    ⭐ Popular
                  </div>
                )}
                
                {(search === '' ? 
                  allCurrencies.filter(c => popularCurrencies.includes(c.code)) : 
                  filteredCurrencies
                ).map(currency => (
                  <div
                    key={currency.code}
                    style={{
                      ...styles.currencyOption,
                      ...(currency.code === value ? styles.selectedOption : {})
                    }}
                    onClick={() => {
                      onChange(currency.code);
                      setShowDropdown(false);
                      setSearch('');
                      setConvertedAmount(null);
                    }}
                  >
                    <span style={styles.optionFlag}>{currency.flag}</span>
                    <div style={styles.optionInfo}>
                      <span style={styles.optionCode}>{currency.code}</span>
                      <span style={styles.optionName}>{currency.name}</span>
                    </div>
                    <span style={styles.optionSymbol}>{currency.symbol}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    
    // Tab Navigation
    tabContainer: {
      display: 'flex',
      backgroundColor: '#f8fafc',
      padding: '8px',
      gap: '4px'
    },
    tab: {
      flex: 1,
      padding: '14px 20px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#64748b',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    activeTab: {
      backgroundColor: '#ffffff',
      color: '#1e293b',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    
    // Main Content
    content: {
      padding: '32px'
    },
    
    // Amount Section
    amountSection: {
      marginBottom: '32px'
    },
    amountLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    amountInput: {
      width: '100%',
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      padding: '8px 0'
    },
    
    // Currency Selection
    currencyRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: '20px',
      alignItems: 'end',
      marginBottom: '32px'
    },
    currencyGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    currencyLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280'
    },
    currencySelector: {
      position: 'relative'
    },
    selectedCurrency: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    currencyDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    currencyFlag: {
      fontSize: '24px'
    },
    currencyInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    currencyCode: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b'
    },
    currencyName: {
      fontSize: '13px',
      color: '#64748b'
    },
    dropdownArrow: {
      fontSize: '14px',
      color: '#9ca3af',
      transition: 'transform 0.2s ease'
    },
    
    // Swap Button
    swapButton: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: '#6b7280',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    
    // Dropdown Menu
    dropdownMenu: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      overflow: 'hidden', 
      marginBottom: '150px',
    },
    searchInput: {
      width: '100%',
      padding: '16px',
      border: 'none',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px',
      outline: 'none'
    },
    currencyList: {
      maxHeight: '1000px',
      overflowY: 'auto'
    },
    popularSection: {
      padding: '12px 16px',
      backgroundColor: '#f8fafc',
      fontSize: '12px',
      fontWeight: '700',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    currencyOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderBottom: '1px solid #f8fafc'
    },
    selectedOption: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    optionFlag: {
      fontSize: '20px',
      marginRight: '12px'
    },
    optionInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    optionCode: {
      fontSize: '14px',
      fontWeight: '600'
    },
    optionName: {
      fontSize: '12px',
      opacity: 0.7
    },
    optionSymbol: {
      fontSize: '14px',
      fontWeight: '600',
      opacity: 0.6
    },
    
    // Convert Button
    convertButton: {
      width: '100%',
      padding: '18px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '24px'
    },
    convertButtonDisabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    
    // Result
    resultSection: {
      padding: '24px',
      backgroundColor: '#f0f9ff',
      borderRadius: '16px',
      textAlign: 'center'
    },
    resultAmount: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0369a1',
      marginBottom: '8px'
    },
    resultRate: {
      fontSize: '14px',
      color: '#075985',
      marginBottom: '8px'
    },
    resultTime: {
      fontSize: '12px',
      color: '#64748b'
    },
    
    // Error
    error: {
      padding: '16px',
      backgroundColor: '#fef2f2',
      borderRadius: '12px',
      color: '#dc2626',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '16px'
    },
    
    // Loading
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    
    // Last Updated
    lastUpdated: {
      fontSize: '12px',
      color: '#9ca3af',
      textAlign: 'center',
      marginBottom: '24px'
    },

    // Quick amounts
    quickAmounts: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
      flexWrap: 'wrap'
    },
    quickAmount: {
      padding: '8px 16px',
      backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#64748b'
    },
    quickAmountActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      color: 'white'
    }
  };

  const keyframes = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Tab Navigation */}
       

        {/* Main Content */}
        <div style={styles.content}>
          {lastUpdated && (
            <p style={styles.lastUpdated}>
              Last updated: {lastUpdated.toLocaleTimeString('vi-VN')}
            </p>
          )} 

           {/* Currency Selection Row */}
          <div style={styles.currencyRow}>
            <CurrencySelector
              value={from}
              onChange={setFrom}
              search={fromSearch}
              setSearch={setFromSearch}
              showDropdown={showFromDropdown}
              setShowDropdown={setShowFromDropdown}
              placeholder="from currency"
              label="From"
            />

            {/* Swap Button */}
            <button
              style={styles.swapButton}
              onClick={swapCurrencies}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.transform = 'rotate(180deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ⇄
            </button>

            <CurrencySelector
              value={to}
              onChange={setTo}
              search={toSearch}
              setSearch={setToSearch}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
              placeholder="to currency"
              label="To"
            />
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={isLoading || !exchangeRates || !amount}
            style={{
              ...styles.convertButton,
              ...(isLoading || !exchangeRates || !amount ? styles.convertButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading && exchangeRates && amount) {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && exchangeRates && amount) {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? (
              <div style={styles.loading}>
                <span style={styles.spinner}></span>
                Converting...
              </div>
            ) : (
              'Convert'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          {/* Result */}
          {convertedAmount && (
            <div style={styles.resultSection}>
              <div style={styles.resultAmount}>
                {convertedAmount.result.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })} {convertedAmount.to}
              </div>
              <div style={styles.resultRate}>
                1 {convertedAmount.from} = {convertedAmount.rate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })} {convertedAmount.to}
              </div>
              <div style={styles.resultTime}>
                Converted at {new Date().toLocaleTimeString('vi-VN')}
              </div>
            </div>
          )}

          {/* Amount Section */}
          <div style={styles.amountSection}>
            <label style={styles.amountLabel}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {setAmount(e.target.value); setConvertedAmount(null);}}
              style={styles.amountInput}
              placeholder="1.00"
              min="0"
              step="any"
            />
            
            {/* Quick Amount Buttons */}
            <div style={styles.quickAmounts}>
              {[1, 10, 100, 1000, 10000].map(value => (
                <button
                  key={value}
                  onClick={() => {setAmount(value); setConvertedAmount(null);}}
                  style={{
                    ...styles.quickAmount,
                    ...(amount == value ? styles.quickAmountActive : {})
                  }}
                >
                  {value.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

         
        </div>
      </div>
    </>
  );
}

export default CurrencyConverter;
export { CurrencyConverter };