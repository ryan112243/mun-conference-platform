const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 創建新用戶並生成邀請碼
router.post('/create', async (req, res) => {
  try {
    const { country } = req.body;
    
    if (!country) {
      return res.status(400).json({ error: '國家是必填項' });
    }
    
    // 生成邀請碼
    let inviteCode;
    let isUnique = false;
    
    // 確保邀請碼唯一
    while (!isUnique) {
      inviteCode = User.generateInviteCode();
      const existingUser = await User.findOne({ inviteCode });
      if (!existingUser) {
        isUnique = true;
      }
    }
    
    // 創建新用戶
    const newUser = new User({
      inviteCode,
      country
    });
    
    await newUser.save();
    
    res.status(201).json({ inviteCode, country });
  } catch (error) {
    console.error('創建用戶錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 驗證邀請碼
router.post('/verify', async (req, res) => {
  try {
    const { inviteCode } = req.body;
    
    if (!inviteCode) {
      return res.status(400).json({ error: '邀請碼是必填項' });
    }
    
    const user = await User.findOne({ inviteCode });
    
    if (!user) {
      return res.status(404).json({ error: '無效的邀請碼' });
    }
    
    res.json({ valid: true, country: user.country });
  } catch (error) {
    console.error('驗證邀請碼錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;