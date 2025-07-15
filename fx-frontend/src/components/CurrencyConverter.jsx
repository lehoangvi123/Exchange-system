import React, { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.post('http://localhost:5000/api/rates/convert', {
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
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">💱 Currency Converter</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">From:</label>
        <input
          type="text"
          value={from}
          onChange={e => setFrom(e.target.value.toUpperCase())}
          className="w-full p-2 border border-gray-300 rounded focus:ring focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">To:</label>
        <input
          type="text"
          value={to}
          onChange={e => setTo(e.target.value.toUpperCase())}
          className="w-full p-2 border border-gray-300 rounded focus:ring focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring focus:outline-none"
        />
      </div>

      <button
        onClick={handleConvert}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Converting...' : 'Convert'}
      </button>

      {convertedAmount && (
        <div className="mt-4 text-lg font-semibold text-green-700 text-center">
          {`${convertedAmount.amount} ${convertedAmount.from} = ${convertedAmount.result.toLocaleString()} ${convertedAmount.to}`}
        </div>
      )}
    </div>
  );
}

export default CurrencyConverter;
