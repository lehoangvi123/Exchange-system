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
      const response = await fetch('https://backend-1-8b9z.onrender.com/api/rates/archive', {
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
    <div style={containerStyle}>
      <h3 style={headingStyle}>📦 Lưu trữ dữ liệu cũ</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Ngày cutoff:
          <input
            type="date"
            value={cutoffDate}
            onChange={(e) => setCutoffDate(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>Lưu trữ</button>
      </form>
      {message && (
        <p style={{ ...messageStyle, color: archivedCount !== null ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  backgroundColor: '#fafafa',
  maxWidth: '400px',
  margin: '30px auto',
  fontFamily: 'Arial, sans-serif',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const headingStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '20px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const labelStyle = {
  fontSize: '14px',
  color: '#444',
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  padding: '8px',
  fontSize: '14px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginTop: '5px'
};

const buttonStyle = {
  padding: '10px',
  fontSize: '14px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const messageStyle = {
  marginTop: '15px',
  fontSize: '14px',
  textAlign: 'center'
};

export default ArchiveRateForm;
