import React, { useState } from 'react';

const LogConversionForm = () => {
  const [form, setForm] = useState({
    from: 'USD',
    to: 'VND',
    amount: 100,
    userId: ''
  });

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/rates/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: form.from,
          to: form.to,
          amount: parseFloat(form.amount),
          userId: form.userId || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
        setMessage('✅ Giao dịch đã được ghi lại thành công!');
      } else {
        setMessage(`❌ Lỗi: ${data.message || 'Không thể ghi log'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Lỗi khi gửi yêu cầu');
    }
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ccc', maxWidth: 400 }}>
      <h3>🔁 Giao dịch quy đổi</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Từ (from):{' '}
          <input type="text" name="from" value={form.from} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Đến (to):{' '}
          <input type="text" name="to" value={form.to} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Số lượng (amount):{' '}
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
        </label>
        <br />
        <label>
          User ID (tùy chọn):{' '}
          <input type="text" name="userId" value={form.userId} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Gửi giao dịch</button>
      </form>
      {message && <p>{message}</p>}
      {result && (
        <p>💰 Kết quả chuyển đổi: <strong>{result}</strong></p>
      )}
    </div>
  );
};

export default LogConversionForm;
