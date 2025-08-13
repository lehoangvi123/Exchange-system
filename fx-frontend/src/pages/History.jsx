import React, { useEffect, useState } from 'react';
import '../css/History.css';
export default function HistoryChart({ period = '24h' }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch current rates và tạo mock history data
    const fetchHistoryData = async () => {
      try {
        // Fetch current exchange rates
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          // Tạo mock historical data dựa trên current rates
          // Vì API này không có historical data miễn phí, ta sẽ tạo data giả lập
          const mockHistory = generateMockHistory(data, period);
          setHistory(mockHistory);
        } else {
          throw new Error('Không thể lấy dữ liệu tỷ giá');
        }
      } catch (err) {
        console.error('❌ Lỗi khi fetch history:', err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [period]);

  // Hàm tạo mock historical data
  const generateMockHistory = (currentData, period) => {
    const history = [];
    const now = new Date();
    let intervals, stepMinutes;

    // Xác định số lượng data points và khoảng cách dựa trên period
    switch (period) {
      case '1h':
        intervals = 12; // 12 points trong 1 giờ (mỗi 5 phút)
        stepMinutes = 5;
        break;
      case '24h':
        intervals = 24; // 24 points trong 24 giờ (mỗi giờ)
        stepMinutes = 60;
        break;
      case '7d':
        intervals = 14; // 14 points trong 7 ngày (mỗi 12 giờ)
        stepMinutes = 720;
        break;
      case '30d':
        intervals = 30; // 30 points trong 30 ngày (mỗi ngày)
        stepMinutes = 1440;
        break;
      default:
        intervals = 24;
        stepMinutes = 60;
    }

    // Tạo historical data với biến động nhỏ
    for (let i = intervals - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * stepMinutes * 60 * 1000));
      const rates = {};
      
      // Tạo rates với biến động nhỏ ngẫu nhiên (±2%)
      Object.entries(currentData.rates).forEach(([currency, rate]) => {
        const variation = 0.98 + (Math.random() * 0.04); // 0.98 to 1.02
        rates[currency] = rate * variation;
      });

      history.push({
        timestamp: timestamp.toISOString(),
        base: currentData.base,
        rates: rates
      });
    }

    return history;
  };

  const styles = {
    container: {
      padding: '32px',
     
      margin: '40px auto',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      boxShadow: `
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1)
      `,
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden', 
      width: '1200px'        
    },
    
    // Gradient background overlay
    backgroundOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '120px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 0.05,
      borderRadius: '20px 20px 0 0',
      zIndex: 0
    },

    header: {
      position: 'relative',
      zIndex: 1,
      marginBottom: '32px',
      textAlign: 'center'
    },

    heading: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '8px',
      letterSpacing: '-0.025em'
    },

    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '500'
    },

    periodBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '12px',
      border: '1px solid #e2e8f0'
    },

    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      position: 'relative',
      zIndex: 1
    },

    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    },

    loadingText: {
      color: '#64748b',
      fontSize: '16px',
      fontWeight: '500'
    },

    errorContainer: {
      textAlign: 'center',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 1
    },

    errorIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },

    errorTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#dc2626',
      marginBottom: '8px'
    },

    errorText: {
      color: '#6b7280',
      fontSize: '14px',
      lineHeight: '1.6'
    },

    retryButton: {
      marginTop: '16px',
      padding: '8px 16px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },

    list: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      position: 'relative',
      zIndex: 1
    },

    item: {
      backgroundColor: '#ffffff',
      padding: '20px 24px',
      marginBottom: '16px',
      borderRadius: '16px',
      fontSize: '15px',
      color: '#1e293b',
      boxShadow: `
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06)
      `,
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },

    itemHover: {
      transform: 'translateY(-2px)',
      boxShadow: `
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04)
      `,
      borderColor: '#e2e8f0'
    },

    itemActive: {
      borderColor: '#667eea',
      boxShadow: `
        0 0 0 2px rgba(102, 126, 234, 0.1),
        0 20px 25px -5px rgba(0, 0, 0, 0.1)
      `
    },

    timeSection: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      fontWeight: '600',
      color: '#475569',
      justifyContent: 'space-between'
    },

    timeIcon: {
      fontSize: '18px',
      marginRight: '8px'
    },

    ratesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginTop: '16px'
    },

    rateCard: {
      backgroundColor: '#f8fafc',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    },

    rateCardHover: {
      backgroundColor: '#f1f5f9',
      transform: 'scale(1.02)'
    },

    currencyCode: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#667eea',
      letterSpacing: '0.025em',
      marginBottom: '4px'
    },

    rateValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      fontVariantNumeric: 'tabular-nums'
    },

    empty: {
      textAlign: 'center',
      padding: '80px 20px',
      position: 'relative',
      zIndex: 1
    },

    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px',
      opacity: 0.3
    },

    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px'
    },

    emptyText: {
      color: '#94a3b8',
      fontSize: '16px',
      lineHeight: '1.6'
    },

    statsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      marginBottom: '24px',
      border: '1px solid #e2e8f0',
      position: 'relative',
      zIndex: 1
    },

    statItem: {
      textAlign: 'center'
    },

    statValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b'
    },

    statLabel: {
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '500',
      marginTop: '4px'
    },

    apiInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 20px',
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '12px',
      marginBottom: '24px',
      color: '#0c4a6e',
      fontSize: '14px',
      fontWeight: '500',
      position: 'relative',
      zIndex: 1
    },

    // Decorative elements
    floatingElement: {
      position: 'absolute',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea22, #764ba222)',
      top: '20px',
      right: '20px',
      zIndex: 0,
      animation: 'float 6s ease-in-out infinite'
    },

    floatingElement2: {
      position: 'absolute',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #764ba222, #667eea22)',
      bottom: '40px',
      left: '40px',
      zIndex: 0,
      animation: 'float 8s ease-in-out infinite reverse'
    }
  };

  // Animation keyframes trong style tag
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .fade-in-up:nth-child(1) { animation-delay: 0.1s; }
    .fade-in-up:nth-child(2) { animation-delay: 0.2s; }
    .fade-in-up:nth-child(3) { animation-delay: 0.3s; }
    .fade-in-up:nth-child(4) { animation-delay: 0.4s; }
    .fade-in-up:nth-child(5) { animation-delay: 0.5s; }
  `;

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect again
    const fetchHistoryData = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          const mockHistory = generateMockHistory(data, period);
          setHistory(mockHistory);
        } else {
          throw new Error('Không thể lấy dữ liệu tỷ giá');
        }
      } catch (err) {
        console.error('❌ Lỗi khi fetch history:', err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoryData();
  };

  return (
    <> 
    <div className='history-container'>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Decorative background elements */}
        <div style={styles.backgroundOverlay}></div>
        <div style={styles.floatingElement}></div>
        <div style={styles.floatingElement2}></div>

        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.heading}>📈 Lịch sử tỷ giá</h3>
          <p style={styles.subtitle}>Theo dõi biến động tỷ giá theo thời gian</p>
          <div style={styles.periodBadge}>
            Khoảng thời gian: {period}
          </div>
        </div>

        {/* API Info */}
        <div style={styles.apiInfo}>
          🌐 Dữ liệu từ ExchangeRate-API.com • Cập nhật real-time • USD làm base currency
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Đang tải dữ liệu từ API...</div>
          </div>
        ) : error ? (
          /* Error State */
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <div style={styles.errorTitle}>Lỗi khi tải dữ liệu</div>
            <div style={styles.errorText}>
              {error}<br/>
              Vui lòng kiểm tra kết nối internet và thử lại.
            </div>
            <button 
              style={styles.retryButton}
              onClick={handleRetry}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5b68d4';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#667eea';
              }}
            >
              🔄 Thử lại
            </button>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            {history.length > 0 && (
              <div style={styles.statsBar}>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{history.length}</div>
                  <div style={styles.statLabel}>Điểm dữ liệu</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>
                    {history[0] ? Object.keys(history[0].rates).length : 0}
                  </div>
                  <div style={styles.statLabel}>Loại tiền tệ</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>USD</div>
                  <div style={styles.statLabel}>Base currency</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>
                    {new Date().toLocaleDateString('vi-VN')}
                  </div>
                  <div style={styles.statLabel}>Cập nhật</div>
                </div>
              </div>
            )}

            {/* Content */}
            {history.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>📊</div>
                <div style={styles.emptyTitle}>Chưa có dữ liệu</div>
                <div style={styles.emptyText}>
                  Không có dữ liệu lịch sử cho khoảng thời gian "{period}".<br/>
                  Vui lòng thử lại sau hoặc chọn khoảng thời gian khác.
                </div>
              </div>
            ) : (
              <>
                {/* Show only latest 10 records info */}
                {history.length > 10 && (
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    padding: '12px 20px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '12px',
                    color: '#92400e',
                    fontSize: '14px',
                    fontWeight: '500',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    📋 Hiển thị 10 điểm dữ liệu gần nhất từ tổng số {history.length} điểm
                  </div>
                )}

                <ul style={styles.list}>
                  {history
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 10)
                    .map((item, index) => (
                      <li 
                        key={index} 
                        className="fade-in-up"
                        style={{
                          ...styles.item,
                          ...(selectedItem === index ? styles.itemActive : {})
                        }}
                        onMouseEnter={(e) => {
                          Object.assign(e.currentTarget.style, styles.itemHover);
                        }}
                        onMouseLeave={(e) => {
                          if (selectedItem !== index) {
                            Object.assign(e.currentTarget.style, styles.item);
                          }
                        }}
                        onClick={() => setSelectedItem(selectedItem === index ? null : index)}
                      >
                        {/* Time Section */}
                        <div style={styles.timeSection}>
                          <div>
                            <span style={styles.timeIcon}>🕓</span>
                            {new Date(item.timestamp).toLocaleString('vi-VN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {index === 0 && (
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              MỚI NHẤT
                            </span>
                          )}
                        </div>

                        {/* Rates Grid */}
                        <div style={styles.ratesGrid}>
                          {Object.entries(item.rates)
                            .slice(0, selectedItem === index ? undefined : 8)
                            .map(([currency, value]) => (
                              <div 
                                key={currency} 
                                style={styles.rateCard}
                                onMouseEnter={(e) => {
                                  Object.assign(e.currentTarget.style, {
                                    ...styles.rateCard,
                                    ...styles.rateCardHover
                                  });
                                }}
                                onMouseLeave={(e) => {
                                  Object.assign(e.currentTarget.style, styles.rateCard);
                                }}
                              >
                                <div style={styles.currencyCode}>{currency}</div>
                                <div style={styles.rateValue}>
                                  {Number(value).toLocaleString('vi-VN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 4
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Expand indicator */}
                        {Object.keys(item.rates).length > 8 && (
                          <div style={{
                            textAlign: 'center',
                            marginTop: '16px',
                            padding: '8px',
                            color: '#667eea',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            backgroundColor: '#f8fafc',
                            border: '1px dashed #e2e8f0'
                          }}>
                            {selectedItem === index 
                              ? '▲ Thu gọn' 
                              : `▼ Xem thêm ${Object.keys(item.rates).length - 8} loại tiền tệ`
                            }
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </>
        )}
      </div> 
      </div>
    </>
  );
}