import React, { useEffect, useState } from 'react';

export default function HistoryChart({ period }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/history/24h`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setHistory(data);
        } else {
          console.warn('❗ Không có dữ liệu');
          setHistory([]);
        }
      })
      .catch(err => console.error('❌ Lỗi khi fetch history:', err))
      .finally(() => setLoading(false));
  }, [period]);

  const styles = {
    container: {
      padding: '32px',
      maxWidth: '900px',
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
      overflow: 'hidden'
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
      color: '#475569'
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
      color: '#1e293b'
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

  return (
    <>
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

        {/* Loading State */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Đang tải dữ liệu...</div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            {history.length > 0 && (
              <div style={styles.statsBar}>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{history.length}</div>
                  <div style={styles.statLabel}>Bản ghi</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>
                    {history[0] ? Object.keys(history[0].rates).length : 0}
                  </div>
                  <div style={styles.statLabel}>Loại tiền tệ</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>
                    {history[0] ? new Date(history[0].timestamp).toLocaleDateString('vi-VN') : '-'}
                  </div>
                  <div style={styles.statLabel}>Cập nhật gần nhất</div>
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
                    📋 Hiển thị 10 bản ghi gần nhất từ tổng số {history.length} bản ghi
                  </div>
                )}

                <ul style={styles.list}>
                  {history
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by newest first
                    .slice(0, 10) // Take only first 10
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
                        {/* Time Section with "Newest" badge for first item */}
                        <div style={styles.timeSection}>
                          <span style={styles.timeIcon}>🕓</span>
                          {new Date(item.timestamp).toLocaleString('vi-VN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {index === 0 && (
                            <span style={{
                              marginLeft: '12px',
                              padding: '2px 8px',
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
                            .slice(0, selectedItem === index ? undefined : 6)
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
                                    minimumFractionDigits: 3,
                                    maximumFractionDigits: 4
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Expand indicator */}
                        {Object.keys(item.rates).length > 6 && (
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
                              : `▼ Xem thêm ${Object.keys(item.rates).length - 6} loại tiền tệ`
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
    </>
  );
}