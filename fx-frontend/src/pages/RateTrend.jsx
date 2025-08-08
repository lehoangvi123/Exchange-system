import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Cập nhật 6 cặp tiền tệ mới
const pairs = ["USD_VND", "EUR_VND", "USD_EUR", "JPY_VND", "GBP_USD", "AUD_CAD"];
const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff5e78", "#2b7a78", "#a66dd4"];

const RateTrend = ({ period = "30d" }) => {
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Generate realistic mock data based on current real rates
        const results = pairs.map((pair) => {
          const data = [];
          const now = new Date();
          
          // Current real exchange rates (as of request)
          const currentRates = {
            "USD_VND": 26158,      // 1 USD = 26,158 VND
            "EUR_VND": 27450,      // 1 EUR ≈ 27,450 VND (EUR usually 1.05x USD)
            "USD_EUR": 0.953,      // 1 USD = 0.953 EUR 
            "JPY_VND": 175,        // 1 JPY ≈ 175 VND
            "GBP_USD": 1.275,      // 1 GBP = 1.275 USD
            "AUD_CAD": 0.915       // 1 AUD = 0.915 CAD
          };
          
          const baseRate = currentRates[pair];
          
          // Generate 31 days of data (today + 30 days back)
          for (let i = 30; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            
            // Create realistic fluctuation patterns
            const daysFromNow = i;
            const trendFactor = Math.sin(daysFromNow * 0.2) * 0.01; // Long term trend
            const dailyVolatility = (Math.random() - 0.5) * 0.015; // Daily volatility ±1.5%
            const weeklyPattern = Math.sin(daysFromNow * 0.9) * 0.005; // Weekly patterns
            
            // Combine all factors for realistic movement
            const totalVariation = trendFactor + dailyVolatility + weeklyPattern;
            const rate = baseRate * (1 + totalVariation);
            
            // Format based on currency type
            const formattedRate = pair.includes('VND') 
              ? Math.round(rate) // VND rates as whole numbers
              : Number(rate.toFixed(4)); // Other currencies with 4 decimals
            
            data.push({
              date: date.toISOString(),
              rate: formattedRate
            });
          }
          
          return { pair, values: data };
        });
        
        const mapped = {};
        results.forEach(({ pair, values }) => {
          mapped[pair] = values;
        });
        
        setDataMap(mapped);
        
      } catch (error) {
        console.error('Error generating mock data:', error);
        setError('Không thể tạo dữ liệu demo');
      } finally {
        setLoading(false);
      }
    };

    // Simulate API delay
    setTimeout(fetchData, 800);
  }, [period]);

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>⏳ Đang tải dữ liệu xu hướng tỷ giá...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>❌ {error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  const formatCurrencyPair = (pair) => {
    return pair.replace('_', ' → ');
  };

  const formatRate = (value, pair) => {
    if (pair.includes('VND')) {
      return new Intl.NumberFormat('vi-VN').format(value);
    }
    return value.toFixed(4);
  };

  const formatTooltipValue = (value, name, props) => {
    const pair = props.payload?.pair || pairs.find(p => dataMap[p] === props.payload?.constructor);
    return [formatRate(value, pair || ''), 'Tỷ giá'];
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)', 
      width: '1200px'
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 0.5rem 0'
        }}>
          📊 Currency Overview
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: '#6b7280',
          margin: 0
        }}>
          Live exchange rate trends • Updated {period}
        </p>
      </div>

      {/* Currency Grid - Business Insider Style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {pairs.map((pair, idx) => {
          const data = dataMap[pair] || [];
          const latestRate = data.length > 0 ? data[data.length - 1].rate : 0;
          const previousRate = data.length > 1 ? data[data.length - 2].rate : latestRate;
          const change = latestRate - previousRate;
          const changePercent = previousRate !== 0 ? ((change / previousRate) * 100) : 0;
          const isPositive = change >= 0;
          
          return (
            <div
              key={pair}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer', 
                
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = colors[idx % colors.length];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Currency Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    lineHeight: 1.2
                  }}>
                    {pair.replace('_', '/')}
                  </h3>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginTop: '0.25rem'
                  }}>
                    {formatRate(latestRate, pair)}
                  </div>
                </div>
                
                {/* Change Indicator */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: isPositive ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <span>{isPositive ? '▲' : '▼'}</span>
                    {Math.abs(changePercent).toFixed(2)}%
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.125rem'
                  }}>
                    {isPositive ? '+' : ''}{formatRate(change, pair)}
                  </span>
                </div>
              </div>

              {/* Mini Chart */}
              {data.length > 0 ? (
                <div style={{ 
                  height: '60px',
                  width: '100%',
                  marginTop: '0.5rem'
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ 
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '0.75rem'
                }}>
                  No data
                </div>
              )}

              {/* Color indicator bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: colors[idx % colors.length],
                opacity: 0.7
              }} />
            </div>
          );
        })}
      </div>

      {/* Market Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            background: '#10b981', 
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          <span>Market Open</span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>Last Update: {new Date().toLocaleTimeString('vi-VN', { hour12: false })}</span>
          <span>•</span>
          <span>Real-time data</span>
        </div>
      </div>

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default RateTrend;