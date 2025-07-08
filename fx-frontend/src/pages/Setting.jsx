import React, { useState } from 'react';

function Setting() {
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('light');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div>
        <label className="block mb-2 font-medium">Default Currency</label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="USD">USD - United States Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="JPY">JPY - Japanese Yen</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">Theme</label>
        <div className="flex space-x-4">
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

      <p className="text-gray-500 text-sm">
        (These settings are for demo only and are not saved yet.)
      </p>
    </div>
  );
}

export default Setting;
