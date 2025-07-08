import React, { useEffect, useState } from 'react';

export default function HistoryChart({ period }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/history/${period}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setHistory(data);
        } else {
          console.warn('❗ Không có dữ liệu');
          setHistory([]);
        }
      })
      .catch(err => console.error('❌ Lỗi khi fetch history:', err));
  }, [period]);

  return (
    <div>
      <h3>📈 Lịch sử tỷ giá ({period})</h3>
      {history.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              🕓 {new Date(item.timestamp).toLocaleString()}:{" "}
              {Object.entries(item.rates)
                .slice(0, 5) // Hiện 5 đồng đầu tiên
                .map(([currency, value]) => `${currency}: ${Number(value).toFixed(3)}`)
                .join(" | ")} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
