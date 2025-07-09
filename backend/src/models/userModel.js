// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferredCurrencies: [String], // Ví dụ: ['USD', 'VND']
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
