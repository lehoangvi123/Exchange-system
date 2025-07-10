// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// ⚠️ Sửa đoạn này để tránh lỗi OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);