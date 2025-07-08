const Rate = require('../models/Rate');

/**
 * Lưu tỷ giá hiện tại vào MongoDB
 * @param {Object} currencyRate - Object chứa các cặp tiền và tỷ giá, ví dụ: { USD: 1, VND: 24500, EUR: 0.92 }
 */
exports.getRateHistory = async (fromDate, toDate) => {
  return await Rate.find({ createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) } })
    .sort({ createdAt: 1 });
};  

exports.archiveOldData = async (cutoffDate) => {
  const result = await Rate.deleteMany({ createdAt: { $lt: new Date(cutoffDate) } });
  console.log(`[📦] Archived ${result.deletedCount} old records.`);
}; 

exports.getPopularCurrencyPairs = async () => {
  const ConversionLog = require('../models/ConversionLog');
  const results = await ConversionLog.aggregate([
    {
      $group: {
        _id: { from: "$from", to: "$to" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return results;
}; 

async function saveRate(currencyRate) {
  try {
    const rateDoc = new Rate({
      rate: currencyRate,
      createdAt: new Date()
    });
    await rateDoc.save();
    console.log('✅ Tỷ giá đã được lưu vào MongoDB');
  } catch (error) {
    console.error('❌ Lỗi khi lưu tỷ giá:', error.message);
  }
}

module.exports = { saveRate }; 