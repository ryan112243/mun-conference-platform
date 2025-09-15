require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express app
const app = express();

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection (if needed)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Import routes
const aiRoutes = require('./routes/ai');
const fileRoutes = require('./routes/files');
const discussionRoutes = require('./routes/discussions');
const userRoutes = require('./routes/users');

// API routes
app.get('/', (req, res) => {
  res.json({ message: 'MUN API is running' });
});

// Example route that uses API keys
app.get('/api/ai-services', (req, res) => {
  const services = [];
  
  if (process.env.OPENAI_API_KEY) {
    services.push('OpenAI');
  }
  
  if (process.env.GEMINI_API_KEY) {
    services.push('Gemini');
  }
  
  if (process.env.CLAUDE_API_KEY) {
    services.push('Claude');
  }
  
  res.json({ available_services: services });
});

// Use routes
app.use('/api/ai', aiRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/users', userRoutes);

// 靜態文件服務
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});