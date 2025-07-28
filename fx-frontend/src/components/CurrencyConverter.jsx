import React, { useState } from 'react';
import axios from 'axios'; 
import '../CurrencyConverter.css'

function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('VND');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!from || !to || !amount) return;
    setIsLoading(true);

    try {
      const res = await axios.post('https://backend-1-8b9z.onrender.com/api/rates/convert', {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: parseFloat(amount),
        userId: null // ✅ thêm userId để tránh lỗi backend
      });

      if (res.data && res.data.result !== undefined) {
        setConvertedAmount(res.data);
      } else {
        setConvertedAmount(null);
        alert('No result returned from API');
      }
    } catch (err) {
      console.error('❌ Conversion error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Server error: ${err.response.data.message}`);
      } else {
        alert('Conversion failed. Check backend or input format.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="currency-container">
  <h2 className="currency-title">💱 Currency Converter</h2>

  <div className="mb-3">
    <label className="currency-label">From:</label>
    <input
      type="text"
      value={from}
      onChange={e => setFrom(e.target.value.toUpperCase())}
      className="currency-input"
    />
  </div>

  <div className="mb-3">
    <label className="currency-label">To:</label>
    <input
      type="text"
      value={to}
      onChange={e => setTo(e.target.value.toUpperCase())}
      className="currency-input"
    />
  </div>

  <div className="mb-3">
    <label className="currency-label">Amount:</label>
    <input
      type="number"
      value={amount}
      onChange={e => setAmount(e.target.value)}
      className="currency-input"
    />
  </div>

  <button
    onClick={handleConvert}
    disabled={isLoading}
    className="currency-button"
  >
    {isLoading ? 'Converting...' : 'Convert'}
  </button>

  {convertedAmount && (
    <div className="currency-result">
      {`${convertedAmount.amount} ${convertedAmount.from} = ${convertedAmount.result.toLocaleString()} ${convertedAmount.to}`}
    </div>
  )}
</div>

  );
}

export default CurrencyConverter;
