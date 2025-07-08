import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Thay bằng URL backend nếu khác

export default function MarketSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Lắng nghe sự kiện từ socket
    socket.on('marketSummary', (data) => {
      console.log('📦 Nhận marketSummary:', data);
      setSummary(data);
    });

    return () => socket.off('marketSummary');
  }, []);

  // Hiển thị loading nếu chưa có dữ liệu
  if (!summary || !summary.topGainer || !summary.topLoser) {
    return <div>⏳ Đang tải tóm tắt thị trường...</div>;
  }

  // 👉 Tạo dòng mô tả tổng quát
  const summaryText = `💹 Tỷ giá ${summary.sentiment.toLowerCase()}. 
    Tăng mạnh nhất: ${summary.topGainer.currency} (${summary.topGainer.changePercent.toFixed(2)}%). 
    Giảm mạnh nhất: ${summary.topLoser.currency} (${summary.topLoser.changePercent.toFixed(2)}%).`;

  return (
    <div style={{
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f0f8ff',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '10px' }}>📊 Tóm tắt thị trường</h3>

      <p style={{ fontStyle: 'italic', color: '#333', marginBottom: '16px' }}>
        {summaryText}
      </p>

      <ul style={{ listStyleType: 'none', paddingLeft: 0, color: '#333' }}>
        <li>🔺 <strong>Tăng mạnh nhất:</strong> {summary.topGainer.currency} ({summary.topGainer.changePercent.toFixed(2)}%)</li>
        <li>🔻 <strong>Giảm mạnh nhất:</strong> {summary.topLoser.currency} ({summary.topLoser.changePercent.toFixed(2)}%)</li>
        <li>📉 <strong>Biến động trung bình:</strong> {summary.avgChange}%</li>
        <li>📈 <strong>Tâm lý thị trường:</strong> {summary.sentiment}</li>
      </ul>
    </div>
  );
}
