const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  country: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 生成隨機邀請碼的靜態方法
userSchema.statics.generateInviteCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = mongoose.model('User', userSchema);