import React from 'react';
import { useTheme } from '../contexts/themeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      backgroundColor: isDark ? '#334155' : '#f1f5f9',
      border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      outline: 'none',
      userSelect: 'none'
    },
    icon: {
      fontSize: '16px',
      transition: 'transform 0.3s ease'
    },
    text: {
      color: isDark ? '#f1f5f9' : '#334155',
      fontWeight: '600'
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      style={styles.container}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.backgroundColor = isDark ? '#475569' : '#e2e8f0';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
      }}
      title={`Chuyển sang ${isDark ? 'giao diện sáng' : 'giao diện tối'}`}
    >
      <span style={styles.icon}>
        {isDark ? '🌙' : '☀️'}
      </span>
      <span style={styles.text}>
        {isDark ? 'Giao diện tối' : 'Giao diện sáng'}
      </span>
    </button>
  );
};

export default ThemeToggle;