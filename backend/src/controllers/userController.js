const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ Tạo token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ✅ Đăng nhập
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email không tồn tại' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      preferences: user.preferences,
    });
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err.message);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

module.exports = { loginUser };
