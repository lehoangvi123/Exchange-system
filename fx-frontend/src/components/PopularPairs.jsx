import { useEffect, useState } from 'react';
import axios from 'axios';

function PopularPairs() {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/rates/popular')
      .then((res) => {
        if (res.data && Array.isArray(res.data.pairs)) {
          setPairs(res.data.pairs);
        } else {
          setError('Dữ liệu không hợp lệ từ server');
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải cặp tiền phổ biến:", err);
        setError('Không thể tải dữ liệu');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>❌ {error}</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3 style={{ color: '#2166f3' }}>🔝 Top 10 Cặp Tiền Tệ Phổ Biến</h3>
      {pairs.length === 0 ? (
        <p>Không có dữ liệu phổ biến.</p>
      ) : (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {pairs.map((item, index) => (
            <li key={index} style={{ padding: '6px 0', borderBottom: '1px solid #ccc' }}>
              <strong>{index + 1}. {item.pair}</strong> – {item.count} lần sử dụng
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PopularPairs;
