# AI 服務設置指南

## 概述
本項目支援三種AI服務：OpenAI ChatGPT、Google Gemini 和 Anthropic Claude。您需要配置相應的API密鑰才能使用AI功能。

## 快速設置

### 1. 配置環境變數
複製 `backend/.env.template` 文件並重命名為 `backend/.env`：

```bash
cp backend/.env.template backend/.env
```

### 2. 獲取API密鑰

#### OpenAI API密鑰
1. 訪問 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登入您的帳戶
3. 點擊 "Create new secret key"
4. 複製生成的密鑰

#### Google Gemini API密鑰
1. 訪問 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入您的Google帳戶
3. 點擊 "Create API Key"
4. 複製生成的密鑰

#### Anthropic Claude API密鑰
1. 訪問 [Anthropic Console](https://console.anthropic.com/)
2. 登入您的帳戶
3. 前往 API Keys 頁面
4. 創建新的API密鑰

### 3. 更新.env文件
編輯 `backend/.env` 文件，將佔位符替換為實際的API密鑰：

```env
# AI Service API Keys
OPENAI_API_KEY=sk-your-actual-openai-key-here
GEMINI_API_KEY=your-actual-gemini-key-here
CLAUDE_API_KEY=sk-ant-your-actual-claude-key-here
```

## API端點

### 單一AI服務
- `POST /api/ai/chatgpt` - 使用OpenAI ChatGPT
- `POST /api/ai/gemini` - 使用Google Gemini
- `POST /api/ai/claude` - 使用Anthropic Claude

### 多AI服務
- `POST /api/ai/all` - 同時向所有配置的AI服務發送請求
- `POST /api/ai/evaluate` - 基於選定回答進行後續對話

### 請求格式
```json
{
  "prompt": "您的問題或提示",
  "country": "Taiwan",
  "options": {
    "model": "gpt-3.5-turbo",
    "max_tokens": 1000,
    "temperature": 0.7
  }
}
```

## 注意事項

1. **安全性**: 請勿將API密鑰提交到版本控制系統
2. **費用**: 使用AI服務會產生費用，請注意您的使用量
3. **配置**: 即使只配置一個API密鑰，系統也能正常工作
4. **測試**: 可以使用 `GET /api/ai-services` 端點檢查哪些服務已配置

## 故障排除

### 錯誤：所有AI服務的API密鑰均未配置
- 檢查 `.env` 文件是否存在
- 確認API密鑰格式正確
- 重啟後端服務

### API請求失敗
- 檢查API密鑰是否有效
- 確認網路連接正常
- 檢查API服務狀態

## 支援
如有問題，請檢查後端日誌或聯繫開發團隊。