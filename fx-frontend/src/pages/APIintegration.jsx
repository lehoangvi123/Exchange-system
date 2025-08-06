// 📁 components/APIIntegration.jsx
import React, { useState, useEffect } from 'react';

export default function APIIntegration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live data from the actual API for demonstration
  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setLiveData(data);
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    }
    setIsLoading(false);
  };

  const endpoints = [
    {
      method: 'GET',
      url: '/v4/latest/{base_currency}',
      fullUrl: 'https://api.exchangerate-api.com/v4/latest/USD',
      description: 'Get the latest exchange rates for a base currency',
      parameters: [
        { name: 'base_currency', type: 'string', required: true, description: 'Base currency code (USD, EUR, GBP, etc.)' }
      ],
      example: {
        request: 'GET https://api.exchangerate-api.com/v4/latest/USD',
        response: `{
  "base": "USD",
  "date": "2024-08-06",
  "time_last_updated": 1722931201,
  "rates": {
    "VND": 24650,
    "EUR": 0.9234,
    "GBP": 0.7891,
    "JPY": 149.85,
    "CNY": 7.2456,
    ...
  }
}`
      }
    },
    {
      method: 'GET',
      url: '/v4/latest/{base_currency}',
      fullUrl: 'https://api.exchangerate-api.com/v4/latest/EUR',
      description: 'Get rates with different base currency (EUR example)',
      parameters: [
        { name: 'base_currency', type: 'string', required: true, description: 'Any supported currency as base' }
      ],
      example: {
        request: 'GET https://api.exchangerate-api.com/v4/latest/EUR',
        response: `{
  "base": "EUR",
  "date": "2024-08-06",
  "time_last_updated": 1722931201,
  "rates": {
    "USD": 1.0829,
    "VND": 26690,
    "GBP": 0.8547,
    "JPY": 162.34,
    ...
  }
}`
      }
    }
  ];

  const supportedCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'VND', 'SGD', 'THB', 'MYR', 'PHP', 
    'IDR', 'KRW', 'INR', 'AUD', 'CAD', 'CHF', 'NZD', 'HKD', 'TWD', 'BRL',
    'MXN', 'ZAR', 'RUB', 'TRY', 'PLN', 'SEK', 'NOK', 'DKK', 'CZK', 'HUF'
  ];

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '40px auto',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '0',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px',
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '0 0 15px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    },
    subtitle: {
      fontSize: '18px',
      opacity: 0.9,
      margin: 0
    },
    tabContainer: {
      display: 'flex',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    tab: {
      padding: '15px 25px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderBottom: '3px solid transparent'
    },
    activeTab: {
      backgroundColor: 'white',
      color: '#667eea',
      borderBottomColor: '#667eea'
    },
    content: {
      padding: '40px'
    },
    section: {
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    card: {
      padding: '25px',
      backgroundColor: '#f8fafc',
      borderRadius: '15px',
      border: '1px solid #e2e8f0',
      marginBottom: '25px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 15px 0'
    },
    endpointCard: {
      padding: '25px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      marginBottom: '30px',
      backgroundColor: 'white'
    },
    methodBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    codeBlock: {
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      padding: '20px',
      borderRadius: '12px',
      fontFamily: 'Monaco, Consolas, monospace',
      fontSize: '13px',
      lineHeight: '1.6',
      overflow: 'auto',
      margin: '15px 0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      margin: '15px 0'
    },
    th: {
      padding: '12px 15px',
      backgroundColor: '#667eea',
      color: 'white',
      fontWeight: '600',
      textAlign: 'left',
      fontSize: '14px'
    },
    td: {
      padding: '12px 15px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '14px'
    },
    inlineCode: {
      backgroundColor: '#f1f5f9',
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'Monaco, Consolas, monospace',
      fontSize: '13px'
    },
    list: {
      paddingLeft: '20px',
      lineHeight: '1.8'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px'
    },
    currencyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '10px',
      margin: '15px 0'
    },
    currencyBadge: {
      padding: '8px 12px',
      backgroundColor: '#e0e7ff',
      color: '#3730a3',
      borderRadius: '6px',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '600'
    },
    liveDataCard: {
      padding: '20px',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      marginBottom: '25px'
    },
    refreshButton: {
      padding: '10px 20px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background-color 0.3s ease'
    }
  };

  const renderOverview = () => (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🌐 ExchangeRate-API Overview</h3>
        
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>📊 API Information</h4>
          <ul style={styles.list}>
            <li><strong>API Provider:</strong> ExchangeRate-API.com</li>
            <li><strong>Base URL:</strong> <code style={styles.inlineCode}>https://api.exchangerate-api.com</code></li>
            <li><strong>Protocol:</strong> HTTPS</li>
            <li><strong>Authentication:</strong> No API key required (Free tier)</li>
            <li><strong>Rate Limit:</strong> 1,500 requests/month (Free tier)</li>
            <li><strong>Response Format:</strong> JSON</li>
            <li><strong>Update Frequency:</strong> Daily (around 00:00 UTC)</li>
          </ul>
        </div>

        {liveData && (
          <div style={styles.liveDataCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#166534' }}>🟢 Live Data from API</h4>
              <button 
                style={styles.refreshButton}
                onClick={fetchLiveData}
                disabled={isLoading}
              >
                {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
            <p><strong>Base Currency:</strong> {liveData.base}</p>
            <p><strong>Last Updated:</strong> {liveData.date}</p>
            <p><strong>Sample Rates:</strong></p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {['VND', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD'].map(currency => (
                <div key={currency} style={{
                  padding: '8px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <strong>{currency}:</strong> {liveData.rates[currency]?.toLocaleString() || 'N/A'}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>💱 Supported Currencies</h4>
          <p>The API supports {supportedCurrencies.length}+ major world currencies:</p>
          <div style={styles.currencyGrid}>
            {supportedCurrencies.map(currency => (
              <div key={currency} style={styles.currencyBadge}>
                {currency}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>🔧 Key Features</h4>
          <ul style={styles.list}>
            <li><strong>Free Access:</strong> No API key required for basic usage</li>
            <li><strong>Real-time Rates:</strong> Updated daily with accurate exchange rates</li>
            <li><strong>Any Base Currency:</strong> Use any supported currency as base</li>
            <li><strong>Historical Data:</strong> Access to historical exchange rates</li>
            <li><strong>Reliable Service:</strong> 99.9% uptime guarantee</li>
            <li><strong>CORS Enabled:</strong> Can be used from browser applications</li>
          </ul>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>📈 Usage in FX Rate Dashboard</h4>
          <p>Our application uses this API to:</p>
          <ul style={styles.list}>
            <li>🔄 <strong>Fetch Base Rates:</strong> Get daily base exchange rates</li>
            <li>📊 <strong>Generate Realistic Variations:</strong> Create intraday market simulations</li>
            <li>💱 <strong>Support Multiple Currencies:</strong> VND, EUR, GBP, JPY, CNY, etc.</li>
            <li>🎯 <strong>Provide Accurate Data:</strong> Real market rates as foundation</li>
            <li>⚡ <strong>Auto-refresh:</strong> Background updates for latest rates</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📖 API Documentation</h3>

        {endpoints.map((endpoint, index) => (
          <div key={index} style={styles.endpointCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <span style={styles.methodBadge}>{endpoint.method}</span>
              <code style={{ ...styles.inlineCode, fontSize: '16px', fontWeight: '600' }}>
                {endpoint.url}
              </code>
            </div>
            
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              {endpoint.description}
            </p>

            <h5 style={{ margin: '20px 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Parameters</h5>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Parameter</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Required</th>
                  <th style={styles.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.parameters.map((param, paramIndex) => (
                  <tr key={paramIndex}>
                    <td style={styles.td}><code style={styles.inlineCode}>{param.name}</code></td>
                    <td style={styles.td}>{param.type}</td>
                    <td style={styles.td}>{param.required ? '✅ Yes' : '❌ No'}</td>
                    <td style={styles.td}>{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 style={{ margin: '20px 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Example</h5>
            <div>
              <strong>Request:</strong>
              <div style={styles.codeBlock}>
                <pre>{endpoint.example.request}</pre>
              </div>
              
              <strong>Response:</strong>
              <div style={styles.codeBlock}>
                <pre>{endpoint.example.response}</pre>
              </div>
            </div>
          </div>
        ))}

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>🔧 Integration Examples</h4>
          
          <h5 style={{ margin: '20px 0 10px 0' }}>JavaScript/Fetch Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`// Fetch USD rates
const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
const data = await response.json();

console.log('Base:', data.base);
console.log('USD to VND:', data.rates.VND);
console.log('USD to EUR:', data.rates.EUR);
console.log('Last updated:', data.date);`}</pre>
          </div>

          <h5 style={{ margin: '20px 0 10px 0' }}>jQuery Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`$.get('https://api.exchangerate-api.com/v4/latest/USD', function(data) {
    $('#usd-vnd').text(data.rates.VND);
    $('#usd-eur').text(data.rates.EUR);
    $('#last-update').text(data.date);
});`}</pre>
          </div>

          <h5 style={{ margin: '20px 0 10px 0' }}>React Hook Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`const useExchangeRates = (baseCurrency = 'USD') => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(\`https://api.exchangerate-api.com/v4/latest/\${baseCurrency}\`);
        const data = await response.json();
        setRates(data);
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      }
      setLoading(false);
    };

    fetchRates();
  }, [baseCurrency]);

  return { rates, loading };
};`}</pre>
          </div>

          <h5 style={{ margin: '20px 0 10px 0' }}>Python Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`import requests

def get_exchange_rates(base_currency='USD'):
    url = f'https://api.exchangerate-api.com/v4/latest/{base_currency}'
    response = requests.get(url)
    data = response.json()
    
    print(f"Base: {data['base']}")
    print(f"Last updated: {data['date']}")
    print(f"USD to VND: {data['rates']['VND']}")
    
    return data

# Usage
rates = get_exchange_rates('USD')`}</pre>
          </div>

          <h5 style={{ margin: '20px 0 10px 0' }}>Currency Conversion Function</h5>
          <div style={styles.codeBlock}>
            <pre>{`async function convertCurrency(amount, fromCurrency, toCurrency) {
  // Get rates with fromCurrency as base
  const response = await fetch(\`https://api.exchangerate-api.com/v4/latest/\${fromCurrency}\`);
  const data = await response.json();
  
  // Convert amount
  const rate = data.rates[toCurrency];
  const convertedAmount = amount * rate;
  
  return {
    originalAmount: amount,
    fromCurrency,
    toCurrency,
    rate,
    convertedAmount,
    date: data.date
  };
}

// Usage
const result = await convertCurrency(100, 'USD', 'VND');
console.log(\`100 USD = \${result.convertedAmount} VND\`);`}</pre>
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>⚠️ Important Notes</h4>
          <ul style={styles.list}>
            <li><strong>Rate Limits:</strong> Free tier allows 1,500 requests/month</li>
            <li><strong>Update Schedule:</strong> Rates update once daily around 00:00 UTC</li>
            <li><strong>CORS:</strong> API supports cross-origin requests from browsers</li>
            <li><strong>Reliability:</strong> No API key required, but paid plans offer higher limits</li>
            <li><strong>Historical Data:</strong> Available in paid plans only</li>
            <li><strong>Error Handling:</strong> Always check response status and handle network errors</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: '📋 API Overview', component: renderOverview },
    { id: 'docs', label: '📖 Documentation', component: renderDocumentation }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🔌 ExchangeRate-API Integration
        </h1>
        <p style={styles.subtitle}>
          Documentation for ExchangeRate-API.com - Free Exchange Rate API
        </p>
      </div>

      <div style={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tabs.find(tab => tab.id === activeTab)?.component()}
      </div>
    </div>
  );
}