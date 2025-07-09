const express = require('express');
const router = express.Router();
const { getPopularCurrencyPairs } = require('../services/rateService');

router.get('/', async (req, res) => {
  try {
    const pairs = await getPopularCurrencyPairs();
    res.json(pairs);
  } catch (err) {
    console.error("❌ Lỗi khi lấy cặp tiền phổ biến:", err.message);
    res.status(500).json({ error: "Không thể lấy cặp tiền phổ biến" });
  }
});

module.exports = router;
