const ConversionLog = require('../models/ConversionLog');

/**
 * Lấy top các cặp tiền được quy đổi nhiều nhất
 * @param {number} limit - Số lượng cặp muốn lấy (default = 10)
 * @returns {Promise<string[]>}
 */
async function getPopularCurrencyPairs(limit = 10) {
  const result = await ConversionLog.aggregate([
    {
      $project: {
        pair: { $concat: ["$from", "_", "$to"] }
      }
    },
    {
      $group: {
        _id: "$pair",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 0,
        pair: "$_id",
        count: 1
      }
    }
  ]);

  return result.map(item => item.pair);
}

module.exports = { getPopularCurrencyPairs };
