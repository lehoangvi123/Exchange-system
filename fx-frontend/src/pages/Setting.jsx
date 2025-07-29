import React, { useEffect, useState } from 'react';
import '../css/Setting.css';

function Setting() {
  // State cho các settings
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    currency: 'USD',
    notifications: {
      email: true,
      push: false,
      priceAlerts: true,
      newsUpdates: false
    },
    displayPreferences: {
      defaultPairs: ['USD/VND', 'EUR/USD', 'GBP/USD'],
      refreshInterval: 30,
      showChart: true,
      decimalPlaces: 4
    },
    privacy: {
      dataCollection: false,
      analytics: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Load settings khi component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [settings.theme]);

  // Load user settings từ backend
  const loadUserSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data.settings }));
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSimpleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        theme: 'light',
        language: 'en',
        currency: 'USD',
        notifications: {
          email: true,
          push: false,
          priceAlerts: true,
          newsUpdates: false
        },
        displayPreferences: {
          defaultPairs: ['USD/VND', 'EUR/USD', 'GBP/USD'],
          refreshInterval: 30,
          showChart: true,
          decimalPlaces: 4
        },
        privacy: {
          dataCollection: false,
          analytics: true
        }
      });
    }
  };

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'VND', label: 'Vietnamese Dong (VND)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
  ];

  const currencyPairOptions = [
    'USD/VND', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'EUR/GBP',
    'AUD/USD', 'USD/CAD', 'USD/CHF', 'EUR/JPY', 'GBP/JPY'
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
          </div>
        )}
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Theme & Language */}
      <div className="settings-section">
        <h3>Appearance & Language</h3>
        
        <div className="form-group">
          <label className="label">Theme</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="light"
                checked={settings.theme === 'light'}
                onChange={() => handleSimpleChange('theme', 'light')}
              />
              <span className="ml-1">☀️ Light</span>
            </label>
            <label>
              <input
                type="radio"
                value="dark"
                checked={settings.theme === 'dark'}
                onChange={() => handleSimpleChange('theme', 'dark')}
              />
              <span className="ml-1">🌙 Dark</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleSimpleChange('language', e.target.value)}
            className="select-input"
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label">Default Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleSimpleChange('currency', e.target.value)}
            className="select-input"
          >
            {currencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3>Notifications</h3>
        
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
            />
            <span>📧 Email Notifications</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
            />
            <span>🔔 Push Notifications</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.priceAlerts}
              onChange={(e) => handleChange('notifications', 'priceAlerts', e.target.checked)}
            />
            <span>💰 Price Alert Notifications</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.newsUpdates}
              onChange={(e) => handleChange('notifications', 'newsUpdates', e.target.checked)}
            />
            <span>📰 News Updates</span>
          </label>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="settings-section">
        <h3>Display Preferences</h3>
        
        <div className="form-group">
          <label className="label">Default Currency Pairs</label>
          <div className="checkbox-group">
            {currencyPairOptions.map(pair => (
              <label key={pair} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.displayPreferences.defaultPairs.includes(pair)}
                  onChange={(e) => {
                    const newPairs = e.target.checked
                      ? [...settings.displayPreferences.defaultPairs, pair]
                      : settings.displayPreferences.defaultPairs.filter(p => p !== pair);
                    handleChange('displayPreferences', 'defaultPairs', newPairs);
                  }}
                />
                <span>{pair}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Refresh Interval (seconds)</label>
          <select
            value={settings.displayPreferences.refreshInterval}
            onChange={(e) => handleChange('displayPreferences', 'refreshInterval', parseInt(e.target.value))}
            className="select-input"
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Decimal Places</label>
          <input
            type="number"
            min="2"
            max="8"
            value={settings.displayPreferences.decimalPlaces}
            onChange={(e) => handleChange('displayPreferences', 'decimalPlaces', parseInt(e.target.value))}
            className="number-input"
          />
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.displayPreferences.showChart}
              onChange={(e) => handleChange('displayPreferences', 'showChart', e.target.checked)}
            />
            <span>📊 Show Charts by Default</span>
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="settings-section">
        <h3>Privacy & Data</h3>
        
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.privacy.dataCollection}
              onChange={(e) => handleChange('privacy', 'dataCollection', e.target.checked)}
            />
            <span>🔒 Allow Data Collection for Personalization</span>
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.privacy.analytics}
              onChange={(e) => handleChange('privacy', 'analytics', e.target.checked)}
            />
            <span>📈 Share Anonymous Analytics</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="settings-actions">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button
          onClick={resetToDefaults}
          className="btn btn-secondary"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

export default Setting;