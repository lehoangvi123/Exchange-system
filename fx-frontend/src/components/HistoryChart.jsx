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

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '700px',
      margin: '40px auto',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    heading: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#111827'
    },
    list: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    item: {
      backgroundColor: '#f9fafb',
      padding: '10px 14px',
      marginBottom: '8px',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#374151',
      boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.05)'
    },
    empty: {
      color: '#9ca3af',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📈 Lịch sử tỷ giá ({period})</h3>

      {history.length === 0 ? (
        <p style={styles.empty}>Không có dữ liệu</p>
      ) : (
        <ul style={styles.list}>
          {history.map((item, index) => (
            <li key={index} style={styles.item}>
              🕓 {new Date(item.timestamp).toLocaleString()}:{" "}
              {Object.entries(item.rates)
                .slice(0, 5)
                .map(([currency, value]) => `${currency}: ${Number(value).toFixed(3)}`)
                .join(" | ")} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
