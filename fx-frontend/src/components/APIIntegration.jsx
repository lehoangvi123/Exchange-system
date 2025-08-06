// 📁 components/APIIntegration.jsx
import React, { useState } from 'react';

export default function APIIntegration() {
  const [activeTab, setActiveTab] = useState('overview');

  const endpoints = [
    {
      method: 'GET',
      url: '/api/v1/rates/current',
      description: 'Get current exchange rates for specified currency pairs',
      parameters: [
        { name: 'base', type: 'string', required: true, description: 'Base currency (e.g., USD, EUR)' },
        { name: 'symbols', type: 'string', required: false, description: 'Comma-separated target currencies (e.g., VND,EUR,GBP)' },
        { name: 'format', type: 'string', required: false, description: 'Response format: json (default) | xml' }
      ],
      example: {
        request: 'GET /api/v1/rates/current?base=USD&symbols=VND,EUR,GBP',
        response: `{
  "success": true,
  "timestamp": 1640995200,
  "base": "USD",
  "rates": {
    "VND": 24650,
    "EUR": 0.9234,
    "GBP": 0.7891
  }
}`
      }
    },
    {
      method: 'GET',
      url: '/api/v1/rates/historical',
      description: 'Get historical exchange rates for a specific date',
      parameters: [
        { name: 'date', type: 'string', required: true, description: 'Date in YYYY-MM-DD format' },
        { name: 'base', type: 'string', required: true, description: 'Base currency' },
        { name: 'symbols', type: 'string', required: false, description: 'Target currencies' }
      ],
      example: {
        request: 'GET /api/v1/rates/historical?date=2024-01-15&base=USD&symbols=VND,EUR',
        response: `{
  "success": true,
  "date": "2024-01-15",
  "base": "USD",
  "rates": {
    "VND": 24580,
    "EUR": 0.9185
  }
}`
      }
    },
    {
      method: 'GET',
      url: '/api/v1/convert',
      description: 'Convert amount from one currency to another',
      parameters: [
        { name: 'from', type: 'string', required: true, description: 'Source currency' },
        { name: 'to', type: 'string', required: true, description: 'Target currency' },
        { name: 'amount', type: 'number', required: true, description: 'Amount to convert' }
      ],
      example: {
        request: 'GET /api/v1/convert?from=USD&to=VND&amount=100',
        response: `{
  "success": true,
  "query": {
    "from": "USD",
    "to": "VND",
    "amount": 100
  },
  "result": 2465000,
  "rate": 24650
}`
      }
    },
    {
      method: 'GET',
      url: '/api/v1/rates/range',
      description: 'Get exchange rates for a date range',
      parameters: [
        { name: 'start_date', type: 'string', required: true, description: 'Start date (YYYY-MM-DD)' },
        { name: 'end_date', type: 'string', required: true, description: 'End date (YYYY-MM-DD)' },
        { name: 'base', type: 'string', required: true, description: 'Base currency' },
        { name: 'symbols', type: 'string', required: false, description: 'Target currencies' }
      ],
      example: {
        request: 'GET /api/v1/rates/range?start_date=2024-01-01&end_date=2024-01-07&base=USD&symbols=VND',
        response: `{
  "success": true,
  "base": "USD",
  "start_date": "2024-01-01",
  "end_date": "2024-01-07",
  "rates": {
    "2024-01-01": { "VND": 24620 },
    "2024-01-02": { "VND": 24635 },
    ...
  }
}`
      }
    }
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
    }
  };

  const renderOverview = () => (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🌐 API Overview</h3>
        
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Base Information</h4>
          <ul style={styles.list}>
            <li><strong>Base URL:</strong> <code style={styles.inlineCode}>https://api.fxratedashboard.com</code></li>
            <li><strong>Protocol:</strong> HTTPS only</li>
            <li><strong>Authentication:</strong> API Key required</li>
            <li><strong>Rate Limit:</strong> 1000 requests per hour</li>
            <li><strong>Response Format:</strong> JSON (XML available)</li>
          </ul>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>🔐 Authentication</h4>
          <p>All API requests require authentication using an API key in the header:</p>
          <div style={styles.codeBlock}>
            <pre>{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}</pre>
          </div>
          <p><strong>Contact admin to get your API key.</strong></p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>💱 Supported Currencies</h4>
          <div style={styles.grid}>
            <div>
              <strong>Major Currencies:</strong>
              <ul style={styles.list}>
                <li>USD - US Dollar</li>
                <li>EUR - Euro</li>
                <li>GBP - British Pound</li>
                <li>JPY - Japanese Yen</li>
                <li>CNY - Chinese Yuan</li>
              </ul>
            </div>
            <div>
              <strong>Regional Currencies:</strong>
              <ul style={styles.list}>
                <li>VND - Vietnamese Dong</li>
                <li>SGD - Singapore Dollar</li>
                <li>THB - Thai Baht</li>
                <li>MYR - Malaysian Ringgit</li>
                <li>PHP - Philippine Peso</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>📊 Endpoints Summary</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Endpoint</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><code style={styles.inlineCode}>/api/v1/rates/current</code></td>
                <td style={styles.td}><span style={styles.methodBadge}>GET</span></td>
                <td style={styles.td}>Get current exchange rates</td>
              </tr>
              <tr>
                <td style={styles.td}><code style={styles.inlineCode}>/api/v1/rates/historical</code></td>
                <td style={styles.td}><span style={styles.methodBadge}>GET</span></td>
                <td style={styles.td}>Get historical rates for specific date</td>
              </tr>
              <tr>
                <td style={styles.td}><code style={styles.inlineCode}>/api/v1/convert</code></td>
                <td style={styles.td}><span style={styles.methodBadge}>GET</span></td>
                <td style={styles.td}>Convert currency amounts</td>
              </tr>
              <tr>
                <td style={styles.td}><code style={styles.inlineCode}>/api/v1/rates/range</code></td>
                <td style={styles.td}><span style={styles.methodBadge}>GET</span></td>
                <td style={styles.td}>Get rates for date range</td>
              </tr>
            </tbody>
          </table>
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
          <h4 style={styles.cardTitle}>⚠️ Error Responses</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>HTTP Code</th>
                <th style={styles.th}>Error Type</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Example Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>400</td>
                <td style={styles.td}>Bad Request</td>
                <td style={styles.td}>Invalid parameters or malformed request</td>
                <td style={styles.td}><code style={styles.inlineCode}>{"{"}"error": "Invalid currency code"{"}"}</code></td>
              </tr>
              <tr>
                <td style={styles.td}>401</td>
                <td style={styles.td}>Unauthorized</td>
                <td style={styles.td}>Missing or invalid API key</td>
                <td style={styles.td}><code style={styles.inlineCode}>{"{"}"error": "Invalid API key"{"}"}</code></td>
              </tr>
              <tr>
                <td style={styles.td}>429</td>
                <td style={styles.td}>Rate Limit Exceeded</td>
                <td style={styles.td}>Too many requests within time window</td>
                <td style={styles.td}><code style={styles.inlineCode}>{"{"}"error": "Rate limit exceeded"{"}"}</code></td>
              </tr>
              <tr>
                <td style={styles.td}>500</td>
                <td style={styles.td}>Internal Server Error</td>
                <td style={styles.td}>Server-side error occurred</td>
                <td style={styles.td}><code style={styles.inlineCode}>{"{"}"error": "Internal server error"{"}"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>🔧 Integration Examples</h4>
          
          <h5 style={{ margin: '20px 0 10px 0' }}>cURL Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`curl -X GET "https://api.fxratedashboard.com/api/v1/rates/current?base=USD&symbols=VND,EUR,GBP" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
          </div>

          <h5 style={{ margin: '20px 0 10px 0' }}>JavaScript/Node.js Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`const response = await fetch('https://api.fxratedashboard.com/api/v1/rates/current?base=USD&symbols=VND,EUR,GBP', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</pre>
          </div>

          <h5 style={{ margin: '20px 0 10px 0' }}>Python Example</h5>
          <div style={styles.codeBlock}>
            <pre>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.fxratedashboard.com/api/v1/rates/current',
    params={'base': 'USD', 'symbols': 'VND,EUR,GBP'},
    headers=headers
)

data = response.json()
print(data)`}</pre>
          </div>
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
          🔌 API Integration
        </h1>
        <p style={styles.subtitle}>
          Comprehensive API documentation for FX Rate Dashboard
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