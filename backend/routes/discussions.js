const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 創建討論模型
const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, default: 'anonymous' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [String],
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});

// 創建評論模型
const CommentSchema = new mongoose.Schema({
  discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true },
  content: { type: String, required: true },
  createdBy: { type: String, default: 'anonymous' },
  createdAt: { type: Date, default: Date.now },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});

const Discussion = mongoose.model('Discussion', DiscussionSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// 創建新討論
router.post('/', async (req, res) => {
  try {
    const { title, content, createdBy, tags, attachments } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: '標題和內容為必填項' });
    }
    
    const newDiscussion = new Discussion({
      title,
      content,
      createdBy: createdBy || 'anonymous',
      tags: tags || [],
      attachments: attachments || []
    });
    
    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (error) {
    console.error('創建討論錯誤:', error);
    res.status(500).json({ error: '創建討論失敗', details: error.message });
  }
});

// 獲取所有討論
router.get('/', async (req, res) => {
  try {
    const { tag, createdBy, sort = '-createdAt' } = req.query;
    const query = {};
    
    if (tag) query.tags = tag;
    if (createdBy) query.createdBy = createdBy;
    
    const discussions = await Discussion.find(query)
      .sort(sort)
      .populate('attachments');
      
    res.json(discussions);
  } catch (error) {
    console.error('獲取討論列表錯誤:', error);
    res.status(500).json({ error: '獲取討論列表失敗', details: error.message });
  }
});

// 獲取單個討論
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('attachments');
      
    if (!discussion) {
      return res.status(404).json({ error: '討論不存在' });
    }
    
    res.json(discussion);
  } catch (error) {
    console.error('獲取討論詳情錯誤:', error);
    res.status(500).json({ error: '獲取討論詳情失敗', details: error.message });
  }
});

// 更新討論
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, attachments } = req.body;
    const updateData = { updatedAt: Date.now() };
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    if (attachments) updateData.attachments = attachments;
    
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('attachments');
    
    if (!discussion) {
      return res.status(404).json({ error: '討論不存在' });
    }
    
    res.json(discussion);
  } catch (error) {
    console.error('更新討論錯誤:', error);
    res.status(500).json({ error: '更新討論失敗', details: error.message });
  }
});

// 刪除討論
router.delete('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndDelete(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ error: '討論不存在' });
    }
    
    // 刪除相關評論
    await Comment.deleteMany({ discussionId: req.params.id });
    
    res.json({ message: '討論已成功刪除' });
  } catch (error) {
    console.error('刪除討論錯誤:', error);
    res.status(500).json({ error: '刪除討論失敗', details: error.message });
  }
});

// 添加評論
router.post('/:id/comments', async (req, res) => {
  try {
    const { content, createdBy, attachments } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: '評論內容為必填項' });
    }
    
    // 檢查討論是否存在
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ error: '討論不存在' });
    }
    
    const newComment = new Comment({
      discussionId: req.params.id,
      content,
      createdBy: createdBy || 'anonymous',
      attachments: attachments || []
    });
    
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('添加評論錯誤:', error);
    res.status(500).json({ error: '添加評論失敗', details: error.message });
  }
});

// 獲取討論的所有評論
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ discussionId: req.params.id })
      .sort('createdAt')
      .populate('attachments');
      
    res.json(comments);
  } catch (error) {
    console.error('獲取評論列表錯誤:', error);
    res.status(500).json({ error: '獲取評論列表失敗', details: error.message });
  }
});

// 刪除評論
router.delete('/:discussionId/comments/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      discussionId: req.params.discussionId
    });
    
    if (!comment) {
      return res.status(404).json({ error: '評論不存在' });
    }
    
    res.json({ message: '評論已成功刪除' });
  } catch (error) {
    console.error('刪除評論錯誤:', error);
    res.status(500).json({ error: '刪除評論失敗', details: error.message });
  }
});

module.exports = router;