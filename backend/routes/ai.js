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

// ChatGPT API 路由
router.post('/chatgpt', async (req, res) => {
  try {
    const { prompt, options = {}, country } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: '缺少必要的prompt參數' });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API密鑰未配置' });
    }
    
    // 根據國家添加上下文
    let enhancedPrompt = prompt;
    if (country) {
      enhancedPrompt = `請以${country}、台灣、美國、中國、俄羅斯、法國、英國的資料為主回答以下問題：\n\n${prompt}`;
    }
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: enhancedPrompt }
        ],
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('ChatGPT API錯誤:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '處理ChatGPT請求時出錯', 
      details: error.response?.data || error.message 
    });
  }
});

// Google Gemini API 路由
router.post('/gemini', async (req, res) => {
  try {
    const { prompt, options = {}, country } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: '缺少必要的prompt參數' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API密鑰未配置' });
    }
    
    // 根據國家添加上下文
    let enhancedPrompt = prompt;
    if (country) {
      enhancedPrompt = `請以${country}、台灣、美國、中國、俄羅斯、法國、英國的資料為主回答以下問題：\n\n${prompt}`;
    }
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: enhancedPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.max_tokens || 1000,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Gemini API錯誤:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '處理Gemini請求時出錯', 
      details: error.response?.data || error.message 
    });
  }
});

// Claude API 路由
router.post('/claude', async (req, res) => {
  try {
    const { prompt, options = {}, country } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: '缺少必要的prompt參數' });
    }
    
    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'Claude API密鑰未配置' });
    }
    
    // 根據國家添加上下文
    let enhancedPrompt = prompt;
    if (country) {
      enhancedPrompt = `請以${country}、台灣、美國、中國、俄羅斯、法國、英國的資料為主回答以下問題：\n\n${prompt}`;
    }
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: options.model || 'claude-3-sonnet-20240229',
        max_tokens: options.max_tokens || 1000,
        messages: [
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: options.temperature || 0.7
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Claude API錯誤:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '處理Claude請求時出錯', 
      details: error.response?.data || error.message 
    });
  }
});

// 同時向三個AI模型發送請求的路由
router.post('/all', async (req, res) => {
  try {
    const { prompt, options = {}, country } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: '缺少必要的prompt參數' });
    }
    
    // 檢查API密鑰是否配置
    const missingKeys = [];
    if (!process.env.OPENAI_API_KEY) missingKeys.push('OpenAI');
    if (!process.env.GEMINI_API_KEY) missingKeys.push('Gemini');
    if (!process.env.CLAUDE_API_KEY) missingKeys.push('Claude');
    
    if (missingKeys.length === 3) {
      return res.status(500).json({ error: '所有AI服務的API密鑰均未配置' });
    }
    
    // 準備請求
    const requests = [];
    
    // ChatGPT請求
    if (process.env.OPENAI_API_KEY) {
      // 根據國家添加上下文
      let enhancedPrompt = prompt;
      if (country) {
        enhancedPrompt = `請以${country}、台灣、美國、中國、俄羅斯、法國、英國的資料為主回答以下問題：\n\n${prompt}`;
      }
      
      const chatgptRequest = axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: options.model?.chatgpt || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: enhancedPrompt }],
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).catch(error => ({
        error: true,
        model: 'chatgpt',
        message: error.response?.data?.error?.message || error.message
      }));
      
      requests.push(chatgptRequest);
    }
    
    // Gemini請求
    if (process.env.GEMINI_API_KEY) {
      // 根據國家添加上下文
      let enhancedPromptGemini = prompt;
      if (country) {
        enhancedPromptGemini = `請以${country}、台灣、美國、中國、俄羅斯、法國、英國的資料為主回答以下問題：\n\n${prompt}`;
      }
      
      const geminiRequest = axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: enhancedPromptGemini }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.max_tokens || 1000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).catch(error => ({
        error: true,
        model: 'gemini',
        message: error.response?.data?.error?.message || error.message
      }));
      
      requests.push(geminiRequest);
    }
    
    // Claude請求
    if (process.env.CLAUDE_API_KEY) {
      // 根據國家添加上下文
      let enhancedPromptClaude = prompt;
      if (country) {
        enhancedPromptClaude = `請以${country}、台灣、美國、中國、俄羅斯、法國、英國的資料為主回答以下問題：\n\n${prompt}`;
      }
      
      const claudeRequest = axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: options.model?.claude || 'claude-3-sonnet-20240229',
          max_tokens: options.max_tokens || 1000,
          messages: [{ role: 'user', content: enhancedPromptClaude }],
          temperature: options.temperature || 0.7
        },
        {
          headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      ).catch(error => ({
        error: true,
        model: 'claude',
        message: error.response?.data?.error?.message || error.message
      }));
      
      requests.push(claudeRequest);
    }
    
    // 並行處理所有請求
    const results = await Promise.all(requests);
    
    // 處理結果
    const responses = {};
    
    // 處理可能的請求順序
    let index = 0;
    
    // 處理ChatGPT結果
    if (process.env.OPENAI_API_KEY) {
      const result = results[index++];
      if (result.error) {
        responses.chatgpt = { error: true, message: result.message };
      } else {
        responses.chatgpt = {
          text: result.data.choices[0].message.content,
          raw: result.data
        };
      }
    } else {
      responses.chatgpt = { error: true, message: 'API密鑰未配置' };
    }
    
    // 處理Gemini結果
    if (process.env.GEMINI_API_KEY) {
      const result = results[index++];
      if (result.error) {
        responses.gemini = { error: true, message: result.message };
      } else {
        responses.gemini = {
          text: result.data.candidates[0].content.parts[0].text,
          raw: result.data
        };
      }
    } else {
      responses.gemini = { error: true, message: 'API密鑰未配置' };
    }
    
    // 處理Claude結果
    if (process.env.CLAUDE_API_KEY) {
      const result = results[index++];
      if (result.error) {
        responses.claude = { error: true, message: result.message };
      } else {
        responses.claude = {
          text: result.data.content[0].text,
          raw: result.data
        };
      }
    } else {
      responses.claude = { error: true, message: 'API密鑰未配置' };
    }
    
    res.json({
      prompt,
      responses
    });
  } catch (error) {
    console.error('多AI請求錯誤:', error.message);
    res.status(500).json({ 
      error: '處理多AI請求時出錯', 
      details: error.message 
    });
  }
});

// 將選定的回答發送給其他AI模型進行評估
router.post('/evaluate', async (req, res) => {
  try {
    const { prompt, selectedResponse, selectedModel, options = {} } = req.body;
    
    if (!prompt || !selectedResponse || !selectedModel) {
      return res.status(400).json({ error: '缺少必要參數' });
    }
    
    // 檢查API密鑰是否配置
    const missingKeys = [];
    if (!process.env.OPENAI_API_KEY) missingKeys.push('OpenAI');
    if (!process.env.GEMINI_API_KEY) missingKeys.push('Gemini');
    if (!process.env.CLAUDE_API_KEY) missingKeys.push('Claude');
    
    if (missingKeys.length === 3) {
      return res.status(500).json({ error: '所有AI服務的API密鑰均未配置' });
    }
    
    // 準備評估提示
    const evaluationPrompt = `以下是一個問題和一個AI助手的回答。請基於這個回答，繼續回答用戶的下一個問題。\n\n原始問題: ${prompt}\n\nAI回答: ${selectedResponse}\n\n請基於上述對話，回答用戶的下一個問題: ${options.nextPrompt || '請繼續'}`;
    
    // 準備請求
    const requests = [];
    const modelsToRequest = ['chatgpt', 'gemini', 'claude'].filter(model => model !== selectedModel);
    
    // 為每個非選定的模型創建請求
    for (const model of modelsToRequest) {
      if (model === 'chatgpt' && process.env.OPENAI_API_KEY) {
        const chatgptRequest = axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: options.model?.chatgpt || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: evaluationPrompt }],
            max_tokens: options.max_tokens || 1000,
            temperature: options.temperature || 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        ).catch(error => ({
          error: true,
          model: 'chatgpt',
          message: error.response?.data?.error?.message || error.message
        }));
        
        requests.push(chatgptRequest);
      }
      
      if (model === 'gemini' && process.env.GEMINI_API_KEY) {
        const geminiRequest = axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{ text: evaluationPrompt }]
            }],
            generationConfig: {
              temperature: options.temperature || 0.7,
              maxOutputTokens: options.max_tokens || 1000,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).catch(error => ({
          error: true,
          model: 'gemini',
          message: error.response?.data?.error?.message || error.message
        }));
        
        requests.push(geminiRequest);
      }
      
      if (model === 'claude' && process.env.CLAUDE_API_KEY) {
        const claudeRequest = axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: options.model?.claude || 'claude-3-sonnet-20240229',
            max_tokens: options.max_tokens || 1000,
            messages: [{ role: 'user', content: evaluationPrompt }],
            temperature: options.temperature || 0.7
          },
          {
            headers: {
              'x-api-key': process.env.CLAUDE_API_KEY,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            }
          }
        ).catch(error => ({
          error: true,
          model: 'claude',
          message: error.response?.data?.error?.message || error.message
        }));
        
        requests.push(claudeRequest);
      }
    }
    
    // 並行處理所有請求
    const results = await Promise.all(requests);
    
    // 處理結果
    const responses = {};
    
    // 處理結果
    results.forEach((result, index) => {
      const model = modelsToRequest[index];
      
      if (result.error) {
        responses[model] = { error: true, message: result.message };
      } else {
        if (model === 'chatgpt') {
          responses[model] = {
            text: result.data.choices[0].message.content,
            raw: result.data
          };
        } else if (model === 'gemini') {
          responses[model] = {
            text: result.data.candidates[0].content.parts[0].text,
            raw: result.data
          };
        } else if (model === 'claude') {
          responses[model] = {
            text: result.data.content[0].text,
            raw: result.data
          };
        }
      }
    });
    
    res.json({
      prompt: options.nextPrompt || '請繼續',
      selectedModel,
      responses
    });
  } catch (error) {
    console.error('AI評估錯誤:', error.message);
    res.status(500).json({ 
      error: '處理AI評估請求時出錯', 
      details: error.message 
    });
  }
});

// 翻譯API路由
router.post('/translate', async (req, res) => {
  try {
    const { word, fromLang = 'english', toLang = 'chinese-traditional' } = req.body;
    
    if (!word) {
      return res.status(400).json({ error: '缺少必要的word參數' });
    }
    
    const translations = await translateWord(word, fromLang, toLang);
    res.json({ translations });
  } catch (error) {
    console.error('翻譯API錯誤:', error.message);
    res.status(500).json({ 
      error: '處理翻譯請求時出錯', 
      details: error.message 
    });
  }
});

module.exports = router;