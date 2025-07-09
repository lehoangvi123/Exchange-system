const express = require('express');
const router = express.Router();
const { getPopularCurrencyPairs } = require('../services/popularPairService');

/**
 * GET /api/rates/popular
 */
router.get('/popular', async (req, res) => {
  try {
    const topPairs = await getPopularCurrencyPairs(10);
    res.json({ success: true, pairs: topPairs });
  } catch (error) {
    console.error('Lỗi khi lấy cặp phổ biến:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
