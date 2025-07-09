import { useEffect, useState } from 'react';
import axios from 'axios';

function PopularPairs() {
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    async function fetchPopularPairs() {
      try {
        const res = await axios.get('/api/rates/popular');
        setPairs(res.data.pairs);
      } catch (err) {
        console.error("Lỗi khi lấy cặp phổ biến", err);
      }
    }

    fetchPopularPairs();
  }, []);

  return (
    <div>
      <h3>🔝 Top 10 Cặp tiền phổ biến</h3>
      <ul>
        {pairs.map((pair, index) => (
          <li key={index}>{pair}</li>
        ))}
      </ul>
    </div>
  );
}

export default PopularPairs;
