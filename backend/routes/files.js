const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// 創建文件存儲目錄
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 設置文件存儲
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制10MB
});

// 創建文件模型
const FileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  size: Number,
  mimetype: String,
  uploadDate: { type: Date, default: Date.now },
  userId: String, // 可以關聯到用戶
  discussionId: String // 可以關聯到討論
});

const File = mongoose.model('File', FileSchema);

// 上傳文件
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有文件被上傳' });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId: req.body.userId || 'anonymous',
      discussionId: req.body.discussionId
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    console.error('文件上傳錯誤:', error);
    res.status(500).json({ error: '文件上傳失敗', details: error.message });
  }
});

// 獲取文件列表
router.get('/', async (req, res) => {
  try {
    const { userId, discussionId } = req.query;
    const query = {};
    
    if (userId) query.userId = userId;
    if (discussionId) query.discussionId = discussionId;
    
    const files = await File.find(query).sort({ uploadDate: -1 });
    res.json(files);
  } catch (error) {
    console.error('獲取文件列表錯誤:', error);
    res.status(500).json({ error: '獲取文件列表失敗', details: error.message });
  }
});

// 下載文件
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    res.download(file.path, file.originalName);
  } catch (error) {
    console.error('文件下載錯誤:', error);
    res.status(500).json({ error: '文件下載失敗', details: error.message });
  }
});

// 刪除文件
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    // 刪除實際文件
    fs.unlinkSync(file.path);
    
    // 從數據庫中刪除記錄
    await File.findByIdAndDelete(req.params.id);
    
    res.json({ message: '文件已成功刪除' });
  } catch (error) {
    console.error('文件刪除錯誤:', error);
    res.status(500).json({ error: '文件刪除失敗', details: error.message });
  }
});

module.exports = router;