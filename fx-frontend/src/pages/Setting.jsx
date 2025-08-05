import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/themeContexts'; // Import ThemeContext

function Setting() {
  const { theme, changeTheme } = useTheme(); // Sử dụng ThemeContext
  
  // State cho các settings đơn giản
  const [settings, setSettings] = useState({
    theme: theme, // Sync với context
    language: 'vi'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyen.van.an@email.com',
    avatar: '👨‍💼'
  });

  // Sync settings với theme context khi theme thay đổi
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: theme
    }));
  }, [theme]);

  // Load saved settings from localStorage khi component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'vi';
    setSettings(prev => ({
      ...prev,
      language: savedLanguage
    }));
  }, []);

  // Save settings
  const saveSettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Apply theme change through context
      if (settings.theme !== theme) {
        changeTheme(settings.theme);
      }
      
      // Save language to localStorage
      localStorage.setItem('language', settings.language);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage('Cài đặt đã được lưu thành công! 🎉');
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      setMessage('Lỗi khi lưu cài đặt. Vui lòng thử lại.');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định?')) {
      const defaultSettings = {
        theme: 'light',
        language: 'vi'
      };
      
      setSettings(defaultSettings);
      changeTheme('light'); // Reset theme through context
      localStorage.setItem('language', 'vi'); // Reset language in localStorage
      
      setMessage('Đã đặt lại cài đặt về mặc định! ⚡');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const languageOptions = [
    { value: 'vi', label: '🇻🇳 Tiếng Việt' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'ja', label: '🇯🇵 日本語' },
    { value: 'ko', label: '🇰🇷 한국어' },
    { value: 'zh', label: '🇨🇳 中文' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'es', label: '🇪🇸 Español' }
  ];

  // Dynamic styles based on current theme
  const getStyles = () => {
    const isDark = theme === 'dark';
    
    return {
      container: {
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      },
      settingsCard: {
        width: '100%',
        maxWidth: '600px',
        background: isDark 
          ? 'rgba(45, 45, 45, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        borderRadius: '25px',
        boxShadow: isDark
          ? '0 25px 50px rgba(0, 0, 0, 0.5)'
          : '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(15px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
        transition: 'all 0.3s ease'
      },
      header: {
        background: isDark
          ? 'linear-gradient(135deg, #4a5568, #2d3748)'
          : 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '40px 30px',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      },
      headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      },
      headerContent: {
        position: 'relative',
        zIndex: 1
      },
      headerTitle: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        textShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px'
      },
      headerSubtitle: {
        fontSize: '1.1rem',
        opacity: 0.9,
        marginBottom: '25px'
      },
      userInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        padding: '20px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      },
      avatar: {
        fontSize: '2.5rem',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        padding: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(5px)'
      },
      userDetails: {
        textAlign: 'left'
      },
      userName: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginBottom: '5px'
      },
      userEmail: {
        fontSize: '1rem',
        opacity: 0.9
      },
      content: {
        padding: '50px 40px',
        background: isDark ? '#2d2d2d' : 'transparent',
        transition: 'background-color 0.3s ease'
      },
      section: {
        marginBottom: '40px'
      },
      sectionTitle: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: isDark ? '#ffffff' : '#2c3e50',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'center',
        justifyContent: 'center',
        transition: 'color 0.3s ease'
      },
      formGroup: {
        marginBottom: '35px'
      },
      label: {
        display: 'block',
        fontSize: '1.2rem',
        fontWeight: '600',
        color: isDark ? '#e2e8f0' : '#374151',
        marginBottom: '15px',
        textAlign: 'center',
        transition: 'color 0.3s ease'
      },
      themeContainer: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      },
      themeOption: {
        flex: 1,
        minWidth: '200px',
        padding: '25px 20px',
        border: `3px solid ${isDark ? '#4a5568' : '#e5e7eb'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        background: isDark ? '#3a3a3a' : 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      },
      themeOptionActive: {
        borderColor: '#667eea',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
          : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)'
      },
      themeIcon: {
        fontSize: '3rem',
        marginBottom: '15px',
        display: 'block'
      },
      themeLabel: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: isDark ? '#ffffff' : '#2c3e50',
        marginBottom: '8px',
        transition: 'color 0.3s ease'
      },
      themeDesc: {
        fontSize: '0.95rem',
        color: isDark ? '#a0aec0' : '#6b7280',
        lineHeight: 1.4,
        transition: 'color 0.3s ease'
      },
      select: {
        width: '100%',
        padding: '18px 20px',
        fontSize: '1.1rem',
        border: `3px solid ${isDark ? '#4a5568' : '#e5e7eb'}`,
        borderRadius: '15px',
        background: isDark ? '#3a3a3a' : 'white',
        color: isDark ? '#ffffff' : '#2c3e50',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${isDark ? 'a0aec0' : '6b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px'
      },
      selectFocus: {
        borderColor: '#667eea',
        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15)',
        outline: 'none'
      },
      message: {
        padding: '20px 25px',
        margin: '25px 40px',
        borderRadius: '15px',
        fontSize: '1.1rem',
        fontWeight: '600',
        textAlign: 'center',
        animation: 'slideIn 0.5s ease-out'
      },
      messageSuccess: {
        background: 'linear-gradient(135deg, #10b981, #34d399)',
        color: 'white',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
      },
      messageError: {
        background: 'linear-gradient(135deg, #ef4444, #f87171)',
        color: 'white',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
      },
      actions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '50px',
        paddingTop: '40px',
        borderTop: `2px solid ${isDark ? '#4a5568' : '#f3f4f6'}`,
        transition: 'border-color 0.3s ease'
      },
      button: {
        padding: '18px 35px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '160px',
        position: 'relative',
        overflow: 'hidden'
      },
      primaryButton: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)'
      },
      secondaryButton: {
        background: 'transparent',
        color: isDark ? '#a0aec0' : '#667eea',
        border: `3px solid ${isDark ? '#a0aec0' : '#667eea'}`,
        transition: 'all 0.3s ease'
      },
      buttonHover: {
        transform: 'translateY(-3px)',
        boxShadow: '0 18px 40px rgba(102, 126, 234, 0.4)'
      },
      keyframes: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `
    };
  };

  const styles = getStyles();

  return (
    <>
      <style>{styles.keyframes}</style>
      <div style={styles.container}>
        <div style={styles.settingsCard}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerBg}></div>
            <div style={styles.headerContent}>
              <h1 style={styles.headerTitle}>
                <span>⚙️</span>
                Cài đặt
              </h1>
              <p style={styles.headerSubtitle}>
                Tùy chỉnh giao diện và ngôn ngữ theo sở thích của bạn
              </p>
              {/* <div style={styles.userInfo}>
                <div style={styles.avatar}>{user.avatar}</div>
                <div style={styles.userDetails}>
                  <div style={styles.userName}>{user.name}</div>
                  <div style={styles.userEmail}>{user.email}</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              ...styles.message,
              ...(message.includes('Lỗi') ? styles.messageError : styles.messageSuccess)
            }}>
              {message}
            </div>
          )}

          {/* Content */}
          {/* <div style={styles.content}>
            
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🎨 Chọn giao diện
              </h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Chủ đề hiển thị</label>
                <div style={styles.themeContainer}>
                  <div
                    style={{
                      ...styles.themeOption,
                      ...(settings.theme === 'light' ? styles.themeOptionActive : {})
                    }}
                    onClick={() => handleChange('theme', 'light')}
                  >
                    <span style={styles.themeIcon}>☀️</span>
                    <div style={styles.themeLabel}>Giao diện sáng</div>
                    <div style={styles.themeDesc}>
                      Giao diện truyền thống với nền sáng, phù hợp sử dụng ban ngày
                    </div>
                  </div>
                  
                  <div
                    style={{
                      ...styles.themeOption,
                      ...(settings.theme === 'dark' ? styles.themeOptionActive : {})
                    }}
                    onClick={() => handleChange('theme', 'dark')}
                  >
                    <span style={styles.themeIcon}>🌙</span>
                    <div style={styles.themeLabel}>Giao diện tối</div>
                    <div style={styles.themeDesc}>
                      Giao diện tối bảo vệ mắt, phù hợp sử dụng ban đêm
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Language Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🌍 Chọn ngôn ngữ
              </h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Ngôn ngữ hiển thị</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  style={styles.select}
                  onFocus={(e) => Object.assign(e.target.style, styles.selectFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme === 'dark' ? '#4a5568' : '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                onClick={saveSettings}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    Object.assign(e.target.style, styles.buttonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {loading ? '⏳ Đang lưu...' : '💾 Lưu cài đặt'}
              </button>
              
              <button
                onClick={resetToDefaults}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = theme === 'dark' ? '#a0aec0' : '#667eea';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                🔄 Đặt lại mặc định
              </button>
            </div>
          </div>
        </div>
      {/* </div> */}
    </>
  );
}

export default Setting;