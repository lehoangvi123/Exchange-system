// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// 🔒 Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ So sánh mật khẩu người dùng nhập với mật khẩu đã hash
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
