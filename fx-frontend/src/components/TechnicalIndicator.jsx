import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TechnicalIndicators = () => {
  const [data, setData] = useState({});

  // Hàm định dạng số an toàn
  function formatNumber(val, digits = 2) {
    return typeof val === 'number' ? val.toFixed(digits) : 'N/A';
  }

  useEffect(() => {
    axios.get('http://localhost:5000/api/rates/indicators')
      .then((res) => {
        if (res.data && res.data.success) {
          setData(res.data.indicators);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi lấy indicators:', err);
      });
  }, []);

  // Lọc ra các dòng có ít nhất một chỉ số hợp lệ
  const filteredEntries = Object.entries(data).filter(([_, indicators]) =>
    typeof indicators.sma === 'number' ||
    typeof indicators.ema === 'number' ||
    typeof indicators.rsi === 'number'
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 <strong>Technical Indicators</strong></h2>

      {/* 🔍 Giải thích công thức các chỉ báo */}
      <div style={{ marginBottom: '20px', background: '#f0f8ff', padding: '15px', borderRadius: '10px' }}>
        <h4>📘 Giải thích và Công thức:</h4>
        <ul>
          <li><strong>SMA (Simple Moving Average):</strong>
            <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
              SMA = (P₁ + P₂ + ... + Pₙ) / n
            </div>
            <div>👉 Trung bình cộng của <strong>n</strong> tỷ giá gần nhất.</div>
          </li>
          <br />
          <li><strong>EMA (Exponential Moving Average):</strong>
            <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
              EMA<sub>t</sub> = α × P<sub>t</sub> + (1 - α) × EMA<sub>t−1</sub>
            </div>
            <div>👉 Với hệ số <strong>α = 2 / (n + 1)</strong>. EMA nhấn mạnh các giá trị gần hiện tại hơn.</div>
          </li>
          <br />
          <li><strong>RSI (Relative Strength Index):</strong>
            <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
              RSI = 100 - 100 / (1 + RS),<br />
              RS = (Average Gain) / (Average Loss)
            </div>
            <div>👉 Chỉ số động lượng. RSI cao (&gt; 70) là <strong>quá mua</strong>, thấp (&lt; 30) là <strong>quá bán</strong>.</div>
          </li>
        </ul>
      </div>

      {/* Bảng hiển thị chỉ báo */}
      {filteredEntries.length === 0 ? (
        <p>Không có dữ liệu chỉ số kỹ thuật hợp lệ để hiển thị.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#2166f3', color: 'white' }}>
              <th style={{ padding: '8px' }}>Currency</th>
              <th style={{ padding: '8px' }}>SMA</th>
              <th style={{ padding: '8px' }}>EMA</th>
              <th style={{ padding: '8px' }}>RSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(([currency, indicators], index) => (
              <tr key={currency} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                <td style={{ padding: '8px' }}>{currency}</td>
                <td style={{ padding: '8px' }}>{formatNumber(indicators.sma, 4)}</td>
                <td style={{ padding: '8px' }}>{formatNumber(indicators.ema, 4)}</td>
                <td style={{ padding: '8px' }}>{formatNumber(indicators.rsi, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TechnicalIndicators;
