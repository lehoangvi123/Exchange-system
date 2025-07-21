import React, { useEffect, useState } from 'react';
import '../css/Setting.css';

function Setting() {
  const [theme, setTheme] = useState('light');

  // ⚡ Tự động gắn class "dark" vào body khi đổi theme
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      <div className="form-group">
        <label className="label">Theme</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="light"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
            />
            <span className="ml-1">Light</span>
          </label>
          <label>
            <input
              type="radio"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
            />
            <span className="ml-1">Dark</span>
          </label>
        </div>
      </div>

      <p className="note">
        (These settings are for demo only and are not saved yet.)
      </p>
    </div>
  );
}

export default Setting;
