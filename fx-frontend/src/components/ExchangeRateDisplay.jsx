// 📁 components/ExchangeRateDisplay.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://backend-1-8b9z.onrender.com');

export default function ExchangeRateDisplay() {
  const [rates, setRates] = useState({});
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    socket.on('rateUpdate', (data) => {
      console.log("Received rateUpdate: ", data);
      setRates(data);
    });

    socket.on('rateAnomalies', (data) => {
      setAnomalies(data);
    });

    return () => {
      socket.off('rateUpdate');
      socket.off('rateAnomalies');
    };
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>💱 Defective Abnormal Exchange Rates</h2>

      {/* 🔍 Lý thuyết phát hiện tỷ giá bất thường */}
      <div style={{
        backgroundColor: '#e8f4fd',
        border: '1px solid #b6d8f2',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        lineHeight: '1.6',
      }}>
        <strong>💡 Lý thuyết phát hiện tỷ giá bất thường:</strong><br />
        1️⃣ Lưu tỷ giá trước đó (<code>oldRate</code>) và tỷ giá hiện tại (<code>newRate</code>)<br />
        2️⃣ Tính phần trăm thay đổi theo công thức:<br />
        <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
          change = |newRate - oldRate| / oldRate
        </code><br />
        3️⃣ Nếu <code>change &gt; threshold</code> (ví dụ <strong>10%</strong>), thì được xem là <strong>bất thường</strong>.<br />
        <em>Ví dụ:</em> oldRate = 10, newRate = 12 → change = (12 - 10)/10 = 0.2 = 20% → ⚠️ bất thường.
      </div>

      {/* ⚠️ Cảnh báo bất thường nếu có */}
      {anomalies.length > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffeeba'
        }}>
          <strong>⚠️ Cảnh báo tỷ giá bất thường:</strong>
          <ul>
            {anomalies.map((a, index) => (
              <li key={index}>
                {a.currency}: {a.oldValue} → {a.newValue} ({a.changePercent}%)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bảng tỷ giá */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #007bff', padding: '10px', textAlign: 'left', background: '#007bff', color: 'white' }}>Currency</th>
            <th style={{ borderBottom: '2px solid #007bff', padding: '10px', textAlign: 'left', background: '#007bff', color: 'white' }}>Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rates).map(([code, value]) => (
            <tr key={code}>
              <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{code}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
