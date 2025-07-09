const express = require('express');
const router = express.Router();
const { saveUser, updateUser } = require('../services/userService');

// POST /api/users/save
router.post('/save', async (req, res) => {
  const result = await saveUser(req.body);
  if (result.success) {
    return res.json({ success: true, user: result.user });
  } else {
    return res.status(400).json({ success: false, message: result.message });
  }
}); 

// PUT /api/users/update
router.put('/update', async (req, res) => {
  const { email, updates } = req.body;
  if (!email || !updates) {
    return res.status(400).json({ success: false, message: 'Thiếu email hoặc dữ liệu cập nhật' });
  }

  const result = await updateUser(email, updates);
  if (result.success) {
    return res.json({ success: true, user: result.user });
  } else {
    return res.status(404).json({ success: false, message: result.message });
  }
});

module.exports = router; 
