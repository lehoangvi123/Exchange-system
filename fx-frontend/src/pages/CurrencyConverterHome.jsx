import React, { useState, useEffect } from 'react';

// Currency Converter Component
function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('VND');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // All available currencies with country names and flags
  const allCurrencies = [
    { code: 'USD', flag: '🇺🇸', name: 'United States Dollar' },
    { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
    { code: 'AFN', flag: '🇦🇫', name: 'Afghan Afghani' },
    { code: 'ALL', flag: '🇦🇱', name: 'Albanian Lek' },
    { code: 'AMD', flag: '🇦🇲', name: 'Armenian Dram' },
    { code: 'ANG', flag: '🇳🇱', name: 'Netherlands Antillean Guilder' },
    { code: 'AOA', flag: '🇦🇴', name: 'Angolan Kwanza' },
    { code: 'ARS', flag: '🇦🇷', name: 'Argentine Peso' },
    { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
    { code: 'AWG', flag: '🇦🇼', name: 'Aruban Florin' },
    { code: 'AZN', flag: '🇦🇿', name: 'Azerbaijani Manat' },
    { code: 'BAM', flag: '🇧🇦', name: 'Bosnia-Herzegovina Convertible Mark' },
    { code: 'BBD', flag: '🇧🇧', name: 'Barbadian Dollar' },
    { code: 'BDT', flag: '🇧🇩', name: 'Bangladeshi Taka' },
    { code: 'BGN', flag: '🇧🇬', name: 'Bulgarian Lev' },
    { code: 'BHD', flag: '🇧🇭', name: 'Bahraini Dinar' },
    { code: 'BIF', flag: '🇧🇮', name: 'Burundian Franc' },
    { code: 'BMD', flag: '🇧🇲', name: 'Bermudan Dollar' },
    { code: 'BND', flag: '🇧🇳', name: 'Brunei Dollar' },
    { code: 'BOB', flag: '🇧🇴', name: 'Bolivian Boliviano' },
    { code: 'BRL', flag: '🇧🇷', name: 'Brazilian Real' },
    { code: 'BSD', flag: '🇧🇸', name: 'Bahamian Dollar' },
    { code: 'BTN', flag: '🇧🇹', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', flag: '🇧🇼', name: 'Botswanan Pula' },
    { code: 'BYN', flag: '🇧🇾', name: 'Belarusian Ruble' },
    { code: 'BZD', flag: '🇧🇿', name: 'Belize Dollar' },
    { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
    { code: 'CDF', flag: '🇨🇩', name: 'Congolese Franc' },
    { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc' },
    { code: 'CLP', flag: '🇨🇱', name: 'Chilean Peso' },
    { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan' },
    { code: 'COP', flag: '🇨🇴', name: 'Colombian Peso' },
    { code: 'CRC', flag: '🇨🇷', name: 'Costa Rican Colón' },
    { code: 'CUP', flag: '🇨🇺', name: 'Cuban Peso' },
    { code: 'CVE', flag: '🇨🇻', name: 'Cape Verdean Escudo' },
    { code: 'CZK', flag: '🇨🇿', name: 'Czech Republic Koruna' },
    { code: 'DJF', flag: '🇩🇯', name: 'Djiboutian Franc' },
    { code: 'DKK', flag: '🇩🇰', name: 'Danish Krone' },
    { code: 'DOP', flag: '🇩🇴', name: 'Dominican Peso' },
    { code: 'DZD', flag: '🇩🇿', name: 'Algerian Dinar' },
    { code: 'EGP', flag: '🇪🇬', name: 'Egyptian Pound' },
    { code: 'ERN', flag: '🇪🇷', name: 'Eritrean Nakfa' },
    { code: 'ETB', flag: '🇪🇹', name: 'Ethiopian Birr' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
    { code: 'FJD', flag: '🇫🇯', name: 'Fijian Dollar' },
    { code: 'FKP', flag: '🇫🇰', name: 'Falkland Islands Pound' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound Sterling' },
    { code: 'GEL', flag: '🇬🇪', name: 'Georgian Lari' },
    { code: 'GHS', flag: '🇬🇭', name: 'Ghanaian Cedi' },
    { code: 'GIP', flag: '🇬🇮', name: 'Gibraltar Pound' },
    { code: 'GMD', flag: '🇬🇲', name: 'Gambian Dalasi' },
    { code: 'GNF', flag: '🇬🇳', name: 'Guinean Franc' },
    { code: 'GTQ', flag: '🇬🇹', name: 'Guatemalan Quetzal' },
    { code: 'GYD', flag: '🇬🇾', name: 'Guyanaese Dollar' },
    { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar' },
    { code: 'HNL', flag: '🇭🇳', name: 'Honduran Lempira' },
    { code: 'HRK', flag: '🇭🇷', name: 'Croatian Kuna' },
    { code: 'HTG', flag: '🇭🇹', name: 'Haitian Gourde' },
    { code: 'HUF', flag: '🇭🇺', name: 'Hungarian Forint' },
    { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah' },
    { code: 'ILS', flag: '🇮🇱', name: 'Israeli New Sheqel' },
    { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
    { code: 'IQD', flag: '🇮🇶', name: 'Iraqi Dinar' },
    { code: 'IRR', flag: '🇮🇷', name: 'Iranian Rial' },
    { code: 'ISK', flag: '🇮🇸', name: 'Icelandic Króna' },
    { code: 'JMD', flag: '🇯🇲', name: 'Jamaican Dollar' },
    { code: 'JOD', flag: '🇯🇴', name: 'Jordanian Dinar' },
    { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
    { code: 'KES', flag: '🇰🇪', name: 'Kenyan Shilling' },
    { code: 'KGS', flag: '🇰🇬', name: 'Kyrgystani Som' },
    { code: 'KHR', flag: '🇰🇭', name: 'Cambodian Riel' },
    { code: 'KMF', flag: '🇰🇲', name: 'Comorian Franc' },
    { code: 'KRW', flag: '🇰🇷', name: 'South Korean Won' },
    { code: 'KWD', flag: '🇰🇼', name: 'Kuwaiti Dinar' },
    { code: 'KYD', flag: '🇰🇾', name: 'Cayman Islands Dollar' },
    { code: 'KZT', flag: '🇰🇿', name: 'Kazakhstani Tenge' },
    { code: 'LAK', flag: '🇱🇦', name: 'Laotian Kip' },
    { code: 'LBP', flag: '🇱🇧', name: 'Lebanese Pound' },
    { code: 'LKR', flag: '🇱🇰', name: 'Sri Lankan Rupee' },
    { code: 'LRD', flag: '🇱🇷', name: 'Liberian Dollar' },
    { code: 'LSL', flag: '🇱🇸', name: 'Lesotho Loti' },
    { code: 'LYD', flag: '🇱🇾', name: 'Libyan Dinar' },
    { code: 'MAD', flag: '🇲🇦', name: 'Moroccan Dirham' },
    { code: 'MDL', flag: '🇲🇩', name: 'Moldovan Leu' },
    { code: 'MGA', flag: '🇲🇬', name: 'Malagasy Ariary' },
    { code: 'MKD', flag: '🇲🇰', name: 'Macedonian Denar' },
    { code: 'MMK', flag: '🇲🇲', name: 'Myanma Kyat' },
    { code: 'MNT', flag: '🇲🇳', name: 'Mongolian Tugrik' },
    { code: 'MOP', flag: '🇲🇴', name: 'Macanese Pataca' },
    { code: 'MRU', flag: '🇲🇷', name: 'Mauritanian Ouguiya' },
    { code: 'MUR', flag: '🇲🇺', name: 'Mauritian Rupee' },
    { code: 'MVR', flag: '🇲🇻', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', flag: '🇲🇼', name: 'Malawian Kwacha' },
    { code: 'MXN', flag: '🇲🇽', name: 'Mexican Peso' },
    { code: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit' },
    { code: 'MZN', flag: '🇲🇿', name: 'Mozambican Metical' },
    { code: 'NAD', flag: '🇳🇦', name: 'Namibian Dollar' },
    { code: 'NGN', flag: '🇳🇬', name: 'Nigerian Naira' },
    { code: 'NIO', flag: '🇳🇮', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', flag: '🇳🇴', name: 'Norwegian Krone' },
    { code: 'NPR', flag: '🇳🇵', name: 'Nepalese Rupee' },
    { code: 'NZD', flag: '🇳🇿', name: 'New Zealand Dollar' },
    { code: 'OMR', flag: '🇴🇲', name: 'Omani Rial' },
    { code: 'PAB', flag: '🇵🇦', name: 'Panamanian Balboa' },
    { code: 'PEN', flag: '🇵🇪', name: 'Peruvian Nuevo Sol' },
    { code: 'PGK', flag: '🇵🇬', name: 'Papua New Guinean Kina' },
    { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso' },
    { code: 'PKR', flag: '🇵🇰', name: 'Pakistani Rupee' },
    { code: 'PLN', flag: '🇵🇱', name: 'Polish Zloty' },
    { code: 'PYG', flag: '🇵🇾', name: 'Paraguayan Guarani' },
    { code: 'QAR', flag: '🇶🇦', name: 'Qatari Rial' },
    { code: 'RON', flag: '🇷🇴', name: 'Romanian Leu' },
    { code: 'RSD', flag: '🇷🇸', name: 'Serbian Dinar' },
    { code: 'RUB', flag: '🇷🇺', name: 'Russian Ruble' },
    { code: 'RWF', flag: '🇷🇼', name: 'Rwandan Franc' },
    { code: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal' },
    { code: 'SBD', flag: '🇸🇧', name: 'Solomon Islands Dollar' },
    { code: 'SCR', flag: '🇸🇨', name: 'Seychellois Rupee' },
    { code: 'SDG', flag: '🇸🇩', name: 'Sudanese Pound' },
    { code: 'SEK', flag: '🇸🇪', name: 'Swedish Krona' },
    { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
    { code: 'SHP', flag: '🇸🇭', name: 'Saint Helena Pound' },
    { code: 'SLE', flag: '🇸🇱', name: 'Sierra Leonean Leone' },
    { code: 'SOS', flag: '🇸🇴', name: 'Somali Shilling' },
    { code: 'SRD', flag: '🇸🇷', name: 'Surinamese Dollar' },
    { code: 'SSP', flag: '🇸🇸', name: 'South Sudanese Pound' },
    { code: 'STN', flag: '🇸🇹', name: 'São Tomé and Príncipe Dobra' },
    { code: 'SYP', flag: '🇸🇾', name: 'Syrian Pound' },
    { code: 'SZL', flag: '🇸🇿', name: 'Swazi Lilangeni' },
    { code: 'THB', flag: '🇹🇭', name: 'Thai Baht' },
    { code: 'TJS', flag: '🇹🇯', name: 'Tajikistani Somoni' },
    { code: 'TMT', flag: '🇹🇲', name: 'Turkmenistani Manat' },
    { code: 'TND', flag: '🇹🇳', name: 'Tunisian Dinar' },
    { code: 'TOP', flag: '🇹🇴', name: 'Tongan Paʻanga' },
    { code: 'TRY', flag: '🇹🇷', name: 'Turkish Lira' },
    { code: 'TTD', flag: '🇹🇹', name: 'Trinidad and Tobago Dollar' },
    { code: 'TWD', flag: '🇹🇼', name: 'New Taiwan Dollar' },
    { code: 'TZS', flag: '🇹🇿', name: 'Tanzanian Shilling' },
    { code: 'UAH', flag: '🇺🇦', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', flag: '🇺🇬', name: 'Ugandan Shilling' },
    { code: 'UYU', flag: '🇺🇾', name: 'Uruguayan Peso' },
    { code: 'UZS', flag: '🇺🇿', name: 'Uzbekistan Som' },
    { code: 'VES', flag: '🇻🇪', name: 'Venezuelan Bolívar' },
    { code: 'VND', flag: '🇻🇳', name: 'Vietnamese Dong' },
    { code: 'VUV', flag: '🇻🇺', name: 'Vanuatu Vatu' },
    { code: 'WST', flag: '🇼🇸', name: 'Samoan Tala' },
    { code: 'XAF', flag: '🌍', name: 'CFA Franc BEAC' },
    { code: 'XCD', flag: '🌎', name: 'East Caribbean Dollar' },
    { code: 'XDR', flag: '🌐', name: 'Special Drawing Rights' },
    { code: 'XOF', flag: '🌍', name: 'CFA Franc BCEAO' },
    { code: 'XPF', flag: '🇵🇫', name: 'CFP Franc' },
    { code: 'YER', flag: '🇾🇪', name: 'Yemeni Rial' },
    { code: 'ZAR', flag: '🇿🇦', name: 'South African Rand' },
    { code: 'ZMW', flag: '🇿🇲', name: 'Zambian Kwacha' },
    { code: 'ZWL', flag: '🇿🇼', name: 'Zimbabwean Dollar' }
  ];

  // Popular currencies for quick access
  const popularCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'VND', 'CNY', 'AUD', 'CAD', 'CHF', 'SGD', 'KRW', 'THB'
  ];

  // Fetch exchange rates on component mount
  useEffect(() => {
    fetchExchangeRates();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchExchangeRates, 300000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.currency-selector')) {
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
      setError('Failed to fetch exchange rates');
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
      setError(err.message || 'Conversion failed');
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

  const handleQuickAmount = (value) => {
    setAmount(value);
    setConvertedAmount(null);
  };

  const filteredFromCurrencies = allCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
    currency.name.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToCurrencies = allCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(toSearch.toLowerCase()) ||
    currency.name.toLowerCase().includes(toSearch.toLowerCase())
  );

  const CurrencySelector = ({ 
    value, 
    onChange, 
    search, 
    setSearch, 
    showDropdown, 
    setShowDropdown, 
    filteredCurrencies,
    placeholder 
  }) => {
    const selectedCurrency = allCurrencies.find(c => c.code === value);
    
    return (
      <div style={converterStyles.selectWithSearch} className="currency-selector">
        <div 
          style={converterStyles.select}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedCurrency && (
            <>
              <span style={{marginRight: '8px'}}>{selectedCurrency.flag}</span>
              <span>{selectedCurrency.code} - {selectedCurrency.name}</span>
            </>
          )}
        </div>
        
        {showDropdown && (
          <div style={converterStyles.optionsList}>
            <input
              type="text"
              placeholder={`Search ${placeholder}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={converterStyles.searchInput}
              autoFocus
            />
            
            {search === '' && (
              <div style={converterStyles.popularSection}>
                🌟 Popular Currencies
              </div>
            )}
            
            {(search === '' ? 
              allCurrencies.filter(c => popularCurrencies.includes(c.code)) : 
              filteredCurrencies
            ).map(currency => (
              <div
                key={currency.code}
                style={{
                  ...converterStyles.option,
                  ...(currency.code === value ? converterStyles.optionSelected : {})
                }}
                onClick={() => {
                  onChange(currency.code);
                  setShowDropdown(false);
                  setSearch('');
                  setConvertedAmount(null);
                }}
                onMouseEnter={(e) => {
                  if (currency.code !== value) {
                    Object.assign(e.target.style, converterStyles.optionHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (currency.code !== value) {
                    Object.assign(e.target.style, converterStyles.option);
                  }
                }}
              >
                <span>{currency.flag}</span>
                <span><strong>{currency.code}</strong> - {currency.name}</span>
              </div>
            ))}
            
            {filteredCurrencies.length === 0 && search !== '' && (
              <div style={{...converterStyles.option, color: '#9ca3af', cursor: 'default'}}>
                No currencies found
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const converterStyles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: '25px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '50px'
    },
    input: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '18px',
      fontWeight: '600',
      textAlign: 'center',
      backgroundColor: '#f9fafb',
      transition: 'all 0.3s ease'
    },
    inputFocus: {
      borderColor: '#667eea',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      backgroundColor: '#ffffff'
    },
    swapButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '2px solid #e5e7eb',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      fontSize: '20px',
      transition: 'all 0.3s ease',
      margin: '0 auto',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    swapButtonHover: {
      borderColor: '#667eea',
      backgroundColor: '#667eea',
      color: 'white',
      transform: 'rotate(180deg)'
    },
    quickAmounts: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    quickAmountBtn: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      color: '#6b7280'
    },
    quickAmountBtnActive: {
      backgroundColor: '#667eea',
      borderColor: '#667eea',
      color: 'white'
    },
    convertButton: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
    },
    convertButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)'
    },
    convertButtonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    result: {
      marginTop: '25px',
      padding: '20px',
      backgroundColor: '#f0f9ff',
      borderRadius: '12px',
      border: '2px solid #0ea5e9',
      textAlign: 'center'
    },
    resultAmount: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0c4a6e',
      marginBottom: '8px'
    },
    resultRate: {
      fontSize: '14px',
      color: '#0369a1',
      marginBottom: '12px'
    },
    resultTime: {
      fontSize: '12px',
      color: '#64748b'
    },
    error: {
      marginTop: '15px',
      padding: '12px',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      color: '#dc2626',
      fontSize: '14px',
      textAlign: 'center'
    },
    lastUpdated: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '20px'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid #ffffff',
      borderRadius: '50%',
      borderTopColor: 'transparent',
      animation: 'spin 1s ease-in-out infinite'
    },
    selectWithSearch: {
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px 8px 0 0',
      fontSize: '14px',
      outline: 'none'
    },
    optionsList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      maxHeight: '200px',
      overflowY: 'auto',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderTop: 'none',
      borderRadius: '0 0 8px 8px',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    option: {
      padding: '10px 12px',
      cursor: 'pointer',
      fontSize: '14px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    optionHover: {
      backgroundColor: '#f3f4f6'
    },
    optionSelected: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    popularSection: {
      padding: '8px 12px',
      backgroundColor: '#f8fafc',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      borderBottom: '1px solid #e5e7eb'
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
      <div style={converterStyles.container}>
        <h2 style={converterStyles.title}>💱 Currency Converter</h2>
        
        {lastUpdated && (
          <p style={converterStyles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString('vi-VN')}
          </p>
        )}

        {/* From Currency */}
        <div style={converterStyles.inputGroup}>
          <label style={converterStyles.label}>From:</label>
          <CurrencySelector
            value={from}
            onChange={setFrom}
            search={fromSearch}
            setSearch={setFromSearch}
            showDropdown={showFromDropdown}
            setShowDropdown={setShowFromDropdown}
            filteredCurrencies={filteredFromCurrencies}
            placeholder="from currency"
          />
        </div>

        {/* Swap Button */}
        <div
          style={converterStyles.swapButton}
          onClick={swapCurrencies}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, converterStyles.swapButtonHover);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.target.style, converterStyles.swapButton);
          }}
        >
          🔄
        </div>

        {/* To Currency */}
        <div style={converterStyles.inputGroup}>
          <label style={converterStyles.label}>To:</label>
          <CurrencySelector
            value={to}
            onChange={setTo}
            search={toSearch}
            setSearch={setToSearch}
            showDropdown={showToDropdown}
            setShowDropdown={setShowToDropdown}
            filteredCurrencies={filteredToCurrencies}
            placeholder="to currency"
          />
        </div>

        {/* Amount Input */}
        <div style={converterStyles.inputGroup}>
          <label style={converterStyles.label}>Amount:</label>
          
          {/* Quick Amount Buttons */}
          <div style={converterStyles.quickAmounts}>
            {[1, 10, 100, 1000, 10000].map(value => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                style={{
                  ...converterStyles.quickAmountBtn,
                  ...(amount == value ? converterStyles.quickAmountBtnActive : {})
                }}
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => {setAmount(e.target.value); setConvertedAmount(null);}}
            style={converterStyles.input}
            onFocus={(e) => Object.assign(e.target.style, converterStyles.inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, converterStyles.input)}
            placeholder="Enter amount"
            min="0"
            step="any"
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={isLoading || !exchangeRates || !amount}
          style={{
            ...converterStyles.convertButton,
            ...(isLoading || !exchangeRates || !amount ? converterStyles.convertButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (!isLoading && exchangeRates && amount) {
              Object.assign(e.target.style, {...converterStyles.convertButton, ...converterStyles.convertButtonHover});
            }
          }}
          onMouseLeave={(e) => {
            Object.assign(e.target.style, converterStyles.convertButton);
          }}
        >
          {isLoading ? (
            <>
              <span style={converterStyles.loadingSpinner}></span>
              <span style={{marginLeft: '10px'}}>Converting...</span>
            </>
          ) : (
            '💱 Convert Now'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div style={converterStyles.error}>
            ❌ {error}
          </div>
        )}

        {/* Result */}
        {convertedAmount && (
          <div style={converterStyles.result}>
            <div style={converterStyles.resultAmount}>
              {convertedAmount.amount.toLocaleString()} {convertedAmount.from} = 
              <br />
              <strong>{convertedAmount.result.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
              })} {convertedAmount.to}</strong>
            </div>
            <div style={converterStyles.resultRate}>
              1 {convertedAmount.from} = {convertedAmount.rate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
              })} {convertedAmount.to}
            </div>
            <div style={converterStyles.resultTime}>
              💡 Converted at {new Date().toLocaleTimeString('vi-VN')}
            </div>
          </div>
        )}

        {/* Footer Info */}
        
      </div>
    </>
  );
}

// Main Dashboard Component
function FXRateDashboard() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const features = [
    {
      icon: '📊',
      title: 'Theo dõi Real-time',
      description: 'Cập nhật tỷ giá liên tục từ hơn 150 ngân hàng và sàn giao dịch'
    },
    {
      icon: '📈',
      title: 'Phân tích kỹ thuật',
      description: 'Biểu đồ chuyên nghiệp với hơn 50 chỉ báo kỹ thuật'
    },
    {
      icon: '🔔',
      title: 'Cảnh báo thông minh',
      description: 'Thông báo tức thời khi tỷ giá đạt ngưỡng mong muốn'
    },
    {
      icon: '💼',
      title: 'Quản lý danh mục',
      description: 'Theo dõi và phân tích hiệu suất đầu tư ngoại tệ'
    },
    {
      icon: '🌐',
      title: 'API mạnh mẽ',
      description: 'Tích hợp dễ dàng với hệ thống của bạn qua REST API'
    },
    {
      icon: '🛡️',
      title: 'Bảo mật cao',
      description: 'Mã hóa end-to-end và tuân thủ các tiêu chuẩn bảo mật quốc tế'
    }
  ];

  const stats = [
    { number: '2M+', label: 'Người dùng tin tưởng' },
    { number: '168', label: 'Loại tiền tệ' },
    { number: '99.9%', label: 'Uptime đảm bảo' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' }
  ];

  const technologies = [
    {
      icon: '⚡',
      name: 'React 18',
      description: 'Giao diện người dùng hiện đại với hiệu suất cao'
    },
    {
      icon: '🚀',
      name: 'Node.js',
      description: 'Backend mạnh mẽ xử lý hàng triệu giao dịch'
    },
    {
      icon: '🔥',
      name: 'Redis Cache',
      description: 'Tốc độ truy xuất dữ liệu siêu nhanh'
    },
    {
      icon: '☁️',
      name: 'AWS Cloud',
      description: 'Hạ tầng đám mây đáng tin cậy toàn cầu'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    
    // Header styles
    header: {
      padding: '20px 0',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    nav: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '24px',
      fontWeight: '800',
      color: 'white',
      textDecoration: 'none'
    },
    navLinks: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    },
    navLink: {
      color: 'rgba(255, 255, 255, 0.9)',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      padding: '8px 16px',
      borderRadius: '20px'
    },
    navLinkHover: {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    loginButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    loginButtonHover: {
      backgroundColor: 'white',
      color: '#667eea'
    },

    // Main content styles
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },

    // Hero section styles
    heroSection: {
      textAlign: 'center',
      padding: '80px 0',
      color: 'white'
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '800',
      marginBottom: '20px',
      lineHeight: '1.2'
    },
    heroIcon: {
      fontSize: '4rem',
      display: 'block',
      marginBottom: '20px'
    },
    heroSubtitle: {
      fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
      lineHeight: '1.6',
      marginBottom: '40px',
      opacity: '0.95',
      maxWidth: '700px',
      margin: '0 auto 40px'
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    primaryButton: {
      backgroundColor: 'white',
      color: '#667eea',
      padding: '15px 30px',
      borderRadius: '30px',
      textDecoration: 'none',
      fontWeight: '700',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
    },
    primaryButtonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: 'white',
      padding: '15px 30px',
      borderRadius: '30px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease'
    },
    secondaryButtonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'white'
    },

    // Currency converter section - added styling for integration
    converterSection: {
      margin: '60px 0',
      padding: '40px 0',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)'
    },
    
    // Currency converter introduction styles
    converterIntro: {
      textAlign: 'center',
      marginBottom: '40px',
      color: 'white'
    },
    converterIntroTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '15px',
      color: 'white'
    },
    converterIntroText: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '25px',
      color: 'rgba(255, 255, 255, 0.9)',
      maxWidth: '700px',
      margin: '0 auto 25px'
    },
    converterFeatures: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '30px'
    },
    converterFeature: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(5px)'
    },

    // Features section styles
    featuresSection: {
      padding: '80px 0',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '30px',
      margin: '40px 0',
      backdropFilter: 'blur(10px)'
    },
    featuresTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '20px',
      color: 'white'
    },
    featuresSubtitle: {
      fontSize: '1.2rem',
      textAlign: 'center',
      marginBottom: '50px',
      color: 'rgba(255, 255, 255, 0.9)',
      maxWidth: '600px',
      margin: '0 auto 50px'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px',
      padding: '0 20px'
    },
    featureCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '30px',
      borderRadius: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(5px)'
    },
    featureCardHover: {
      transform: 'translateY(-10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '20px',
      display: 'block'
    },
    featureTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '15px',
      color: 'white'
    },
    featureDescription: {
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.6'
    },

    // Stats section styles
    statsSection: {
      padding: '60px 0',
      textAlign: 'center'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      marginTop: '40px'
    },
    statCard: {
      color: 'white'
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '10px',
      background: 'linear-gradient(45deg, #fff, #f0f8ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    statLabel: {
      fontSize: '1.1rem',
      opacity: '0.9'
    },

    // Technology section styles
    techSection: {
      padding: '80px 0',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '30px',
      margin: '40px 0',
      backdropFilter: 'blur(10px)'
    },
    techTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '20px',
      color: 'white'
    },
    techSubtitle: {
      fontSize: '1.2rem',
      textAlign: 'center',
      marginBottom: '50px',
      color: 'rgba(255, 255, 255, 0.9)',
      maxWidth: '600px',
      margin: '0 auto 50px'
    },
    techGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      padding: '0 20px'
    },
    techCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '25px',
      borderRadius: '15px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(5px)'
    },
    techIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px',
      display: 'block'
    },
    techName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      marginBottom: '10px',
      color: 'white'
    },
    techDesc: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.95rem',
      lineHeight: '1.5'
    },

    // Footer styles
    footer: {
      padding: '60px 0 30px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      marginTop: '80px'
    },
    footerContent: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.95rem',
      lineHeight: '1.6'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
   
      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Hero Section */}
    

        {/* Currency Converter Section */}
        <section style={styles.converterSection}>
          <div style={styles.converterIntro}>
            <h3 style={styles.converterIntroTitle}>🎯 Trải nghiệm ngay công cụ quy đổi tiền tệ</h3>
            <p style={styles.converterIntroText}>
              Khám phá tính năng chuyển đổi tiền tệ thời gian thực với <strong>168 loại tiền tệ</strong> từ khắp thế giới. 
              Dữ liệu được cập nhật liên tục từ các nguồn đáng tin cậy, đảm bảo độ chính xác cao cho mọi giao dịch của bạn.
            </p>
          </div>
          <CurrencyConverter />
        </section>

   

        
      </main>

     
      
    </div>
  );
}

// Export the main component as default and CurrencyConverter as named export
export default FXRateDashboard;
export { CurrencyConverter };