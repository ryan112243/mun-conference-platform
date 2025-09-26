const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// 翻譯功能 - 使用Cambridge Dictionary API
async function translateWord(word, fromLang = 'english', toLang = 'chinese-traditional') {
  try {
    const url = `https://dictionary.cambridge.org/dictionary/${fromLang}-${toLang}/${encodeURIComponent(word)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // 提取翻譯結果
    const translations = [];
    $('.def-block').each((i, el) => {
      const definition = $(el).find('.def').text().trim();
      const translation = $(el).find('.trans').text().trim();
      if (definition && translation) {
        translations.push({ definition, translation });
      }
    });
    
    return translations.length > 0 ? translations : [{ definition: word, translation: '未找到翻譯' }];
  } catch (error) {
    console.error('翻譯錯誤:', error.message);
    return [{ definition: word, translation: '翻譯過程中出錯' }];
  }
}

// Google Translate API 翻譯功能
async function translateText(text, fromLang = 'en', toLang = 'zh-TW') {
  try {
    // 使用免費的翻譯API服務
    const response = await axios.get(`https://api.mymemory.translated.net/get`, {
      params: {
        q: text,
        langpair: `${fromLang}|${toLang}`
      }
    });
    
    if (response.data && response.data.responseData) {
      return {
        originalText: text,
        translatedText: response.data.responseData.translatedText,
        fromLang,
        toLang
      };
    } else {
      throw new Error('翻譯服務響應格式錯誤');
    }
  } catch (error) {
    console.error('文本翻譯錯誤:', error.message);
    return {
      originalText: text,
      translatedText: '翻譯失敗',
      error: error.message,
      fromLang,
      toLang
    };
  }
}

// 翻譯單詞API路由
router.post('/translate-word', async (req, res) => {
  try {
    const { word, fromLang = 'english', toLang = 'chinese-traditional' } = req.body;
    
    if (!word) {
      return res.status(400).json({ error: '缺少必要的word參數' });
    }
    
    const translations = await translateWord(word, fromLang, toLang);
    res.json({ 
      word,
      fromLang,
      toLang,
      translations 
    });
  } catch (error) {
    console.error('翻譯API錯誤:', error.message);
    res.status(500).json({ 
      error: '處理翻譯請求時出錯', 
      details: error.message 
    });
  }
});

// 翻譯文本API路由
router.post('/translate-text', async (req, res) => {
  try {
    const { text, fromLang = 'en', toLang = 'zh-TW' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: '缺少必要的text參數' });
    }
    
    const result = await translateText(text, fromLang, toLang);
    res.json(result);
  } catch (error) {
    console.error('文本翻譯API錯誤:', error.message);
    res.status(500).json({ 
      error: '處理文本翻譯請求時出錯', 
      details: error.message 
    });
  }
});

// 支持的語言列表
router.get('/languages', (req, res) => {
  const languages = {
    'en': 'English',
    'zh-TW': '繁體中文',
    'zh-CN': '簡體中文',
    'ja': '日本語',
    'ko': '한국어',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'ar': 'العربية'
  };
  
  res.json({ languages });
});

module.exports = router;