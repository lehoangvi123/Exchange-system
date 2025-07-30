const express = require('express');
const router = express.Router();
const Rate = require('../models/rateModel');

// Middleware để log requests (optional)
const logRequest = (req, res, next) => {
  console.log(`📊 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

router.use(logRequest);

// ==================== EXISTING ROUTES ====================

// Lấy tỷ giá mới nhất
router.get('/current', async (req, res) => {
  try {
    const rateDoc = await Rate.findOne().sort({ createdAt: -1 });
    if (!rateDoc) return res.status(404).json({ error: 'No rates found' });
    res.json({ success: true, rates: rateDoc.rate });
  } catch (err) {
    console.error('❌ current rate error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lịch sử tỷ giá (filter theo from, to date)
router.get('/history', async (req, res) => {
  const { from, to } = req.query;

  try {
    const query = {};
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const history = await Rate.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: history });
  } catch (err) {
    console.error('❌ History query error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// Chuyển đổi tiền tệ đơn giản
router.post('/convert', async (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const rateDoc = await Rate.findOne().sort({ createdAt: -1 });
    if (!rateDoc) return res.status(404).json({ error: 'No rates found' });

    const rates = rateDoc.rate;
    const fromRate = rates[from];
    const toRate = rates[to];

    if (!fromRate || !toRate) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    const result = (amount / fromRate) * toRate;
    res.json({ success: true, from, to, amount, result });
  } catch (err) {
    console.error('❌ convert error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chuyển đổi tiền tệ qua một đồng trung gian (cross rate)
router.post('/convert-cross', async (req, res) => {
  const { base, quote, via } = req.body;

  if (!base || !quote || !via) {
    return res.status(400).json({ error: 'Missing base, quote, or via currency' });
  }

  try {
    const rateDoc = await Rate.findOne().sort({ createdAt: -1 });
    if (!rateDoc) return res.status(404).json({ error: 'No rates available' });

    const rates = rateDoc.rate;
    const baseVia = rates[base];
    const quoteVia = rates[quote];
    const viaRate = rates[via];

    if (!baseVia || !quoteVia || !viaRate) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    // Công thức: base/quote = base/via / quote/via
    const crossRate = (baseVia / viaRate) / (quoteVia / viaRate);
    res.json({ success: true, base, quote, via, rate: crossRate });
  } catch (err) {
    console.error('❌ convert-cross error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== NEW ROUTES FOR SAVERATEFORM ====================

// Validation helper function
const validateRates = (rates) => {
  const allowedCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD',
    'KRW', 'THB', 'VND', 'MYR', 'IDR', 'PHP', 'BGN', 'BRL'
  ];

  // Check if rates is an object
  if (!rates || typeof rates !== 'object') {
    return { valid: false, message: 'Rates must be an object' };
  }

  const currencies = Object.keys(rates);
  
  // Check minimum currencies
  if (currencies.length === 0) {
    return { valid: false, message: 'At least one currency rate is required' };
  }

  // Check maximum currencies
  if (currencies.length > 15) {
    return { valid: false, message: 'Maximum 15 currencies allowed' };
  }

  // Validate each currency and rate
  for (const [currency, rate] of Object.entries(rates)) {
    // Check currency code
    if (!allowedCurrencies.includes(currency)) {
      return { valid: false, message: `Invalid currency code: ${currency}` };
    }

    // Check rate value
    if (typeof rate !== 'number' || rate <= 0 || isNaN(rate)) {
      return { valid: false, message: `Invalid rate for ${currency}: ${rate}` };
    }

    // Check rate range (reasonable values)
    if (rate > 1000000 || rate < 0.000001) {
      return { valid: false, message: `Rate out of range for ${currency}: ${rate}` };
    }
  }

  return { valid: true };
};

// POST /api/rates/save - Lưu tỷ giá mới (cho SaveRateForm)
router.post('/save', async (req, res) => {
  try {
    const rates = req.body;
    console.log('💾 Saving rates:', rates);

    // Validation
    const validation = validateRates(rates);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Tạo document mới
    const newRate = new Rate({
      rate: rates,
      source: 'manual_input',
      metadata: {
        currencyCount: Object.keys(rates).length,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress
      }
    });

    // Lưu vào database
    const savedRate = await newRate.save();
    console.log('✅ Rates saved successfully:', savedRate._id);

    res.json({
      success: true,
      message: 'Tỷ giá đã được lưu thành công',
      data: {
        id: savedRate._id,
        timestamp: savedRate.createdAt,
        currencyCount: Object.keys(rates).length
      }
    });

  } catch (error) {
    console.error('❌ Error saving rates:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lưu tỷ giá'
    });
  }
});

// PUT /api/rates/update/:id - Cập nhật tỷ giá theo ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rates = req.body;

    // Validation
    const validation = validateRates(rates);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Tìm và cập nhật
    const updatedRate = await Rate.findByIdAndUpdate(
      id,
      {
        rate: rates,
        updatedAt: new Date(),
        metadata: {
          currencyCount: Object.keys(rates).length,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress,
          lastModified: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedRate) {
      return res.status(404).json({
        success: false,
        message: 'Rate record not found'
      });
    }

    res.json({
      success: true,
      message: 'Tỷ giá đã được cập nhật',
      data: updatedRate
    });

  } catch (error) {
    console.error('❌ Error updating rates:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tỷ giá'
    });
  }
});

// DELETE /api/rates/delete/:id - Xóa tỷ giá theo ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRate = await Rate.findByIdAndDelete(id);
    
    if (!deletedRate) {
      return res.status(404).json({
        success: false,
        message: 'Rate record not found'
      });
    }

    res.json({
      success: true,
      message: 'Tỷ giá đã được xóa',
      data: {
        id: deletedRate._id,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error deleting rate:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tỷ giá'
    });
  }
});

// GET /api/rates/currencies - Lấy danh sách currencies được hỗ trợ
router.get('/currencies', (req, res) => {
  const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' }
  ];

  res.json({
    success: true,
    data: supportedCurrencies,
    total: supportedCurrencies.length
  });
});

// GET /api/rates/stats - Thống kê tỷ giá
router.get('/stats', async (req, res) => {
  try {
    const totalRecords = await Rate.countDocuments();
    const latestRate = await Rate.findOne().sort({ createdAt: -1 });
    const oldestRate = await Rate.findOne().sort({ createdAt: 1 });

    // Lấy thống kê theo ngày (7 ngày gần nhất)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRecords = await Rate.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Currencies được sử dụng nhiều nhất
    const pipeline = [
      { $unwind: { path: "$rate", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$rate.k", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const popularCurrencies = await Rate.aggregate([
      {
        $project: {
          currencies: { $objectToArray: "$rate" }
        }
      },
      { $unwind: "$currencies" },
      {
        $group: {
          _id: "$currencies.k",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalRecords,
        recentRecords,
        latestUpdate: latestRate?.createdAt,
        oldestRecord: oldestRate?.createdAt,
        popularCurrencies,
        availableCurrencies: latestRate ? Object.keys(latestRate.rate).length : 0
      }
    });

  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê'
    });
  }
});

// GET /api/rates/validate - Validate tỷ giá trước khi lưu
router.post('/validate', (req, res) => {
  try {
    const rates = req.body;
    const validation = validateRates(rates);

    if (validation.valid) {
      res.json({
        success: true,
        message: 'Dữ liệu tỷ giá hợp lệ',
        data: {
          currencyCount: Object.keys(rates).length,
          currencies: Object.keys(rates)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: validation.message
      });
    }

  } catch (error) {
    console.error('❌ Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi validate dữ liệu'
    });
  }
});

// ==================== ERROR HANDLING ====================

// Global error handler cho routes
router.use((error, req, res, next) => {
  console.error('🚨 Route Error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;