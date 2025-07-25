import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const pairs = ["AUD_BGN", "AUD_BRL", "AUD_CAD", "AUD_CHF", "AUD_CNY", "CNY_CZK"];
const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff5e78", "#2b7a78", "#a66dd4"];

const RateTrend = ({ period = "30d" }) => {
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      pairs.map(pair =>
        axios
          .get(`http://localhost:5000/api/rates/trend/${pair}/${period}`)
          .then(res => ({ pair, values: res.data.values }))
          .catch(() => ({ pair, values: [] }))
      )
    ).then(results => {
      const mapped = {};
      results.forEach(({ pair, values }) => {
        mapped[pair] = values;
      });
      setDataMap(mapped);
      setLoading(false);
    });
  }, [period]);

  if (loading) return <p style={{ textAlign: 'center' }}>⏳ Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 So sánh xu hướng tỷ giá (6 cặp)</h2>

      {pairs.map((pair, idx) => (
        <div
          key={pair}
          style={{
            marginBottom: '40px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#fefefe',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{ textAlign: 'center', color: '#333' }}>{pair.replace('_', ' → ')}</h3>
          {dataMap[pair] && dataMap[pair].length > 0 ? (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataMap[pair]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => new Date(d).toLocaleDateString()}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2}
                    name="Tỷ giá"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: 'red', textAlign: 'center' }}>⚠️ Không có dữ liệu cho {pair}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RateTrend;
