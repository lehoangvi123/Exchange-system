// 📁 components/ExportData.jsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export default function ExportData() {
  const [rateData, setRateData] = useState([]);
  const [exportType, setExportType] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([]);
  const [dateRange, setDateRange] = useState('7days');
  const [selectedPairs, setSelectedPairs] = useState(['USD_VND', 'EUR_VND', 'GBP_VND']);
  const [error, setError] = useState(null);

  // Generate sample data for export
  useEffect(() => {
    generateSampleData();
  }, [dateRange]);

  const generateSampleData = () => {
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const data = [];
    
    // Base rates
    const baseRates = {
      USD_VND: 24650,
      EUR_VND: 26890,
      GBP_VND: 31250,
      EUR_USD: 0.9234,
      GBP_USD: 0.7891,
      USD_JPY: 149.85,
      USD_CNY: 7.2456
    };

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dataPoint = {
        date: date.toISOString().split('T')[0],
        time: date.toLocaleTimeString('vi-VN'),
        timestamp: date.getTime()
      };

      // Generate realistic variations
      Object.keys(baseRates).forEach(pair => {
        const variation = (Math.random() - 0.5) * 0.02; // ±1%
        dataPoint[pair] = parseFloat((baseRates[pair] * (1 + variation)).toFixed(pair.includes('VND') ? 0 : 6));
        dataPoint[`${pair}_change`] = parseFloat((variation * 100).toFixed(4));
      });

      data.push(dataPoint);
    }

    setRateData(data);
  };

  // CSV Export Function
  const exportToCSV = () => {
    const headers = ['Date', 'Time', ...selectedPairs, ...selectedPairs.map(p => `${p}_Change_%`)];
    const csvContent = [
      headers.join(','),
      ...rateData.map(row => [
        row.date,
        row.time,
        ...selectedPairs.map(pair => row[pair] || ''),
        ...selectedPairs.map(pair => row[`${pair}_change`] || '')
      ].join(','))
    ].join('\n');

    downloadFile(csvContent, `fx_rates_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  // Excel Export Function
  const exportToExcel = () => {
    // Create Excel-compatible CSV with better formatting
    const excelContent = [
      'FX Rate Dashboard - Export Report',
      `Generated: ${new Date().toLocaleString('vi-VN')}`,
      `Period: ${dateRange}`,
      `Currency Pairs: ${selectedPairs.join(', ')}`,
      '',
      ['Date', 'Time', ...selectedPairs, ...selectedPairs.map(p => `${p} Change %`)].join('\t'),
      ...rateData.map(row => [
        row.date,
        row.time,
        ...selectedPairs.map(pair => row[pair] || ''),
        ...selectedPairs.map(pair => `${row[`${pair}_change`] || ''}%`)
      ].join('\t'))
    ].join('\n');

    downloadFile(excelContent, `fx_rates_detailed_${dateRange}.xls`, 'application/vnd.ms-excel');
  };

  // PDF Export Function (HTML to PDF simulation)
  const exportToPDF = () => {
    const pdfContent = generatePDFContent();
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new window for printing to PDF
    const printWindow = window.open(url, '_blank');
    setTimeout(() => {
      if (printWindow) {
        printWindow.print();
      }
    }, 1000);
  };

  const generatePDFContent = () => {
    const avgRates = selectedPairs.reduce((acc, pair) => {
      acc[pair] = (rateData.reduce((sum, row) => sum + (row[pair] || 0), 0) / rateData.length).toFixed(pair.includes('VND') ? 0 : 6);
      return acc;
    }, {});

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FX Rate Dashboard - Export Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #667eea; color: white; }
        .chart-placeholder { height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌐 FX Rate Dashboard</h1>
        <h2>📊 Export Report - ${dateRange.toUpperCase()}</h2>
        <p>Generated: ${new Date().toLocaleString('vi-VN')}</p>
      </div>

      <div class="summary">
        ${selectedPairs.map(pair => `
          <div class="card">
            <h3>${pair.replace('_', '/')}</h3>
            <p><strong>Average:</strong> ${avgRates[pair]}</p>
            <p><strong>Data Points:</strong> ${rateData.length}</p>
          </div>
        `).join('')}
      </div>

      <div class="chart-placeholder">
        📈 Chart Area - Print from browser for best quality
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            ${selectedPairs.map(pair => `<th>${pair.replace('_', '/')}</th>`).join('')}
            ${selectedPairs.map(pair => `<th>${pair} Change %</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rateData.slice(-20).map(row => `
            <tr>
              <td>${row.date}</td>
              <td>${row.time}</td>
              ${selectedPairs.map(pair => `<td>${row[pair] || 'N/A'}</td>`).join('')}
              ${selectedPairs.map(pair => `<td>${row[pair + '_change'] || 'N/A'}%</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <footer style="margin-top: 50px; text-align: center; color: #666;">
        <p>🏦 FX Rate Dashboard - Professional Trading Platform</p>
        <p>Data exported on ${new Date().toLocaleString('vi-VN')}</p>
      </footer>
    </body>
    </html>
    `;
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Add to export history
    const exportRecord = {
      id: Date.now(),
      filename,
      type: exportType.toUpperCase(),
      date: new Date().toLocaleString('vi-VN'),
      pairs: selectedPairs.length,
      records: rateData.length
    };
    setExportHistory(prev => [exportRecord, ...prev.slice(0, 9)]);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

      switch (exportType) {
        case 'csv':
          exportToCSV();
          break;
        case 'excel':
          exportToExcel();
          break;
        case 'pdf':
          exportToPDF();
          break;
        default:
          throw new Error('Unknown export type');
      }
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '40px auto',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 10px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0
    },
    section: {
      marginBottom: '40px',
      padding: '25px',
      backgroundColor: '#f8fafc',
      borderRadius: '15px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '25px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    },
    select: {
      padding: '12px 15px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      cursor: 'pointer'
    },
    exportButton: {
      padding: '15px 30px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#667eea',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    disabledButton: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
      boxShadow: 'none'
    },
    previewTable: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    th: {
      padding: '15px 12px',
      backgroundColor: '#667eea',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '13px',
      color: '#374151'
    },
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '10px'
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600'
    },
    csvBadge: { backgroundColor: '#dcfce7', color: '#166534' },
    excelBadge: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    pdfBadge: { backgroundColor: '#fef3c7', color: '#92400e' },
    errorMessage: {
      padding: '15px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      marginBottom: '20px'
    }
  };

  const chartData = rateData.slice(-7).map(row => ({
    date: row.date.split('-')[2],
    ...selectedPairs.reduce((acc, pair) => {
      acc[pair] = row[pair];
      return acc;
    }, {})
  }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          📊 Xuất dữ liệu
        </h1>
        <p style={styles.subtitle}>
          Xuất dữ liệu tỷ giá sang CSV, Excel, hoặc PDF để phân tích và báo cáo
        </p>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          ❌ {error}
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚙️ Cấu hình xuất dữ liệu</h3>
        
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>📅 Khoảng thời gian</label>
            <select 
              style={styles.select}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">7 ngày gần nhất</option>
              <option value="30days">30 ngày gần nhất</option>
              <option value="90days">90 ngày gần nhất</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>📄 Định dạng file</label>
            <select 
              style={styles.select}
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
            >
              <option value="csv">CSV (Excel compatible)</option>
              <option value="excel">Excel (.xls)</option>
              <option value="pdf">PDF Report</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>💱 Chọn cặp tiền tệ</label>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '10px'}}>
            {['USD_VND', 'EUR_VND', 'GBP_VND', 'EUR_USD', 'GBP_USD', 'USD_JPY', 'USD_CNY'].map(pair => (
              <label key={pair} style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedPairs.includes(pair)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPairs(prev => [...prev, pair]);
                    } else {
                      setSelectedPairs(prev => prev.filter(p => p !== pair));
                    }
                  }}
                />
                {pair.replace('_', '/')}
              </label>
            ))}
          </div>
        </div>

        <button
          style={{
            ...styles.exportButton,
            ...(isExporting || selectedPairs.length === 0 ? styles.disabledButton : {})
          }}
          onClick={handleExport}
          disabled={isExporting || selectedPairs.length === 0}
        >
          {isExporting ? (
            <>🔄 Đang xuất dữ liệu...</>
          ) : (
            <>📤 Xuất dữ liệu {exportType.toUpperCase()}</>
          )}
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📈 Xem trước dữ liệu ({rateData.length} records)</h3>
        
        {chartData.length > 0 && (
          <div style={{height: '300px', marginBottom: '25px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedPairs.slice(0, 3).map((pair, index) => (
                  <Line 
                    key={pair}
                    dataKey={pair}
                    stroke={['#667eea', '#f093fb', '#4ecdc4'][index]}
                    strokeWidth={2}
                    name={pair.replace('_', '/')}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{overflowX: 'auto'}}>
          <table style={styles.previewTable}>
            <thead>
              <tr>
                <th style={styles.th}>📅 Date</th>
                <th style={styles.th}>⏰ Time</th>
                {selectedPairs.map(pair => (
                  <th key={pair} style={styles.th}>💱 {pair.replace('_', '/')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rateData.slice(-5).map((row, index) => (
                <tr key={index}>
                  <td style={styles.td}>{row.date}</td>
                  <td style={styles.td}>{row.time}</td>
                  {selectedPairs.map(pair => (
                    <td key={pair} style={styles.td}>
                      {row[pair] ? row[pair].toLocaleString() : 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {exportHistory.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Lịch sử xuất dữ liệu</h3>
          {exportHistory.map(record => (
            <div key={record.id} style={styles.historyItem}>
              <div>
                <div style={{fontWeight: '600', marginBottom: '5px'}}>
                  📄 {record.filename}
                </div>
                <div style={{fontSize: '13px', color: '#6b7280'}}>
                  {record.date} • {record.pairs} pairs • {record.records} records
                </div>
              </div>
              <span style={{
                ...styles.badge,
                ...(record.type === 'CSV' ? styles.csvBadge : 
                   record.type === 'EXCEL' ? styles.excelBadge : styles.pdfBadge)
              }}>
                {record.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}