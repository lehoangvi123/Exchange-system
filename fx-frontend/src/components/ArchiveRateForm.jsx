import React, { useState } from 'react';

const ArchiveRateForm = () => {
  const [cutoffDate, setCutoffDate] = useState('');
  const [message, setMessage] = useState('');
  const [archivedCount, setArchivedCount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cutoffDate) {
      setMessage('⚠️ Vui lòng chọn ngày cutoff');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/rates/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cutoffDate }),
      });

      const data = await response.json();
      if (data.success) {
        setArchivedCount(data.archived);
        setMessage(`✅ Đã lưu trữ ${data.archived} bản ghi`);
      } else {
        setMessage(`❌ Thất bại: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Đã xảy ra lỗi trong quá trình gửi yêu cầu');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', maxWidth: '400px' }}>
      <h3>📦 Lưu trữ dữ liệu cũ</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Ngày cutoff:
          <input
            type="date"
            value={cutoffDate}
            onChange={(e) => setCutoffDate(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <button type="submit">Lưu trữ</button>
      </form>
      {message && (
        <p style={{ marginTop: '10px', color: archivedCount !== null ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ArchiveRateForm;
