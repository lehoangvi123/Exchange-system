// src/pages/AlertsPage.jsx
import React from 'react';
import CreateAlert from '../components/CreateAlert';

const AlertsPage = () => {
  return (
    <div>
      <h1>📢 Quản lý Cảnh báo Tỷ giá</h1>
      <CreateAlert />
    </div>
  );
};

export default AlertsPage;
