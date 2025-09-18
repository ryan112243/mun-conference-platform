# 🔧 完全免費手動部署指南

> **不使用 Blueprint，完全手動配置 - 100% 免費！**

## 🎯 為什麼選擇手動部署？

- ✅ **完全免費**：不需要 Blueprint 付費功能
- ✅ **完全控制**：每個設置都由你決定
- ✅ **學習機會**：了解每個服務的配置
- ✅ **靈活性**：可以隨時調整配置

## 📋 部署前準備

### 1. 上傳代碼到 GitHub
```bash
# 在項目根目錄執行
cd C:\Users\User\Desktop\MUN\mun-site
git init
git add .
git commit -m "Initial commit for manual deployment"

# 在 GitHub 創建新倉庫後執行（替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/mun-conference-platform.git
git push -u origin main
```

### 2. 註冊 Render 免費帳戶
1. 訪問 [render.com](https://render.com)
2. 點擊 "Get Started for Free"
3. 使用 GitHub 帳戶登錄
4. **不需要添加信用卡**

## 🗄️ 步驟 1：創建免費數據庫

### 1.1 創建 PostgreSQL 數據庫
1. 在 Render Dashboard 點擊 "New +"
2. 選擇 "PostgreSQL"
3. 填寫配置：
   ```
   Name: mun-database
   Database: mun_conference
   User: mun_user
   Region: Oregon (US West) - 免費
   PostgreSQL Version: 15
   Plan: Free ($0/month)
   ```
4. 點擊 "Create Database"
5. **重要**：複製 "External Database URL"，格式如：
   ```
   postgresql://mun_user:password@dpg-xxxxx-a.oregon-postgres.render.com/mun_conference
   ```

### 1.2 等待數據庫就緒
- 等待狀態變為 "Available"（約 2-3 分鐘）
- 記錄數據庫連接信息

## 🖥️ 步驟 2：部署後端服務

### 2.1 創建 Web Service
1. 在 Render Dashboard 點擊 "New +"
2. 選擇 "Web Service"
3. 選擇 "Build and deploy from a Git repository"
4. 連接你的 GitHub 倉庫
5. 選擇剛才創建的倉庫

### 2.2 配置後端服務
```
Name: mun-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free ($0/month)
```

### 2.3 設置環境變數
在 "Environment Variables" 部分添加：

```bash
# 數據庫連接（使用步驟 1 獲得的 URL）
MONGODB_URI=postgresql://mun_user:password@dpg-xxxxx-a.oregon-postgres.render.com/mun_conference

# JWT 密鑰（隨機生成）
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# 服務端口
PORT=10000

# CORS 設置（稍後會更新）
FRONTEND_URL=https://your-frontend-url.onrender.com

# 會議設置
DEFAULT_MEETING_DURATION=120
MAX_PARTICIPANTS=50

# 文件上傳設置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 2.4 部署後端
1. 點擊 "Create Web Service"
2. 等待部署完成（約 5-10 分鐘）
3. 記錄後端 URL，格式如：`https://mun-backend-xxxx.onrender.com`

## 🌐 步驟 3：部署前端靜態網站

### 3.1 創建 Static Site
1. 在 Render Dashboard 點擊 "New +"
2. 選擇 "Static Site"
3. 選擇同一個 GitHub 倉庫

### 3.2 配置前端服務
```
Name: mun-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
Plan: Free ($0/month)
```

### 3.3 設置前端環境變數
在 "Environment Variables" 部分添加：

```bash
# 後端 API URL（使用步驟 2 獲得的 URL）
VITE_API_URL=https://mun-backend-xxxx.onrender.com

# 應用配置
VITE_APP_NAME=MUN Conference Platform
VITE_APP_VERSION=1.0.0

# 功能開關
VITE_ENABLE_AUDIO=true
VITE_ENABLE_VIDEO=false
VITE_ENABLE_CHAT=true
```

### 3.4 部署前端
1. 點擊 "Create Static Site"
2. 等待部署完成（約 3-5 分鐘）
3. 記錄前端 URL，格式如：`https://mun-frontend-xxxx.onrender.com`

## 🔗 步驟 4：連接服務

### 4.1 更新後端 CORS 設置
1. 回到後端服務設置
2. 更新 `FRONTEND_URL` 環境變數為前端的實際 URL
3. 點擊 "Save Changes"
4. 等待自動重新部署

### 4.2 測試連接
1. 訪問前端 URL
2. 嘗試創建會議
3. 檢查是否能正常連接後端

## ✅ 步驟 5：驗證部署

### 5.1 檢查所有服務狀態
在 Render Dashboard 確認：
- ✅ Database: "Available"
- ✅ Backend: "Live"
- ✅ Frontend: "Live"

### 5.2 功能測試
1. **訪問網站**：打開前端 URL
2. **創建會議**：測試會議創建功能
3. **加入會議**：使用邀請碼加入
4. **測試功能**：
   - 文字轉語音
   - 國家選擇
   - 會議驗證

## 🎉 完成！你的免費服務

| 服務 | URL | 狀態 |
|------|-----|------|
| 前端網站 | `https://mun-frontend-xxxx.onrender.com` | ✅ 運行中 |
| 後端 API | `https://mun-backend-xxxx.onrender.com` | ✅ 運行中 |
| 數據庫 | PostgreSQL 免費版 | ✅ 運行中 |

## 💡 免費方案使用技巧

### 避免睡眠模式
免費服務 15 分鐘無活動會睡眠，使用以下方法保持活躍：

1. **UptimeRobot 監控**（推薦）
   - 註冊 [uptimerobot.com](https://uptimerobot.com)
   - 添加前端和後端 URL
   - 設置每 5 分鐘檢查一次

2. **GitHub Actions 定時器**
   創建 `.github/workflows/keep-alive.yml`：
   ```yaml
   name: Keep Services Alive
   on:
     schedule:
       - cron: '*/14 * * * *'  # 每 14 分鐘執行
   jobs:
     ping:
       runs-on: ubuntu-latest
       steps:
         - name: Ping Frontend
           run: curl -f https://mun-frontend-xxxx.onrender.com
         - name: Ping Backend
           run: curl -f https://mun-backend-xxxx.onrender.com/health
   ```

### 數據備份
免費數據庫 90 天後會被刪除：

1. **定期備份**（每月執行）
   ```bash
   # 在 Render 數據庫控制台執行
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **設置提醒**
   - 在日曆設置 80 天後的提醒
   - 提前遷移重要數據

## 🔧 故障排除

### 後端無法啟動
1. 檢查 `package.json` 中的 `start` 腳本
2. 確認所有環境變數正確設置
3. 查看部署日誌中的錯誤信息

### 前端無法連接後端
1. 確認 `VITE_API_URL` 設置正確
2. 檢查後端 CORS 配置
3. 確認後端服務正在運行

### 數據庫連接失敗
1. 確認數據庫狀態為 "Available"
2. 檢查 `MONGODB_URI` 環境變數
3. 確認數據庫 URL 格式正確

## 🚀 自動部署

設置完成後，每次推送代碼到 GitHub：
```bash
git add .
git commit -m "更新功能"
git push origin main
```

Render 會自動：
1. 檢測代碼變更
2. 重新構建服務
3. 部署新版本

## 📊 監控和維護

### 查看服務狀態
- Render Dashboard 顯示實時狀態
- 查看部署日誌和錯誤信息
- 監控資源使用情況

### 性能優化
1. **前端優化**
   - 啟用 Gzip 壓縮
   - 優化圖片和資源
   - 使用 CDN 加速

2. **後端優化**
   - 添加響應緩存
   - 優化數據庫查詢
   - 實現 API 限流

---

## 🎯 總結

**恭喜！你已經成功手動部署了完整的 MUN 會議系統！**

✅ **完全免費**：$0 成本運行
✅ **完全控制**：每個配置都清楚明白
✅ **自動部署**：推送代碼自動更新
✅ **HTTPS 加密**：免費 SSL 證書
✅ **可擴展**：需要時可輕鬆升級

**下次部署其他項目時，你已經是 Render 專家了！** 🚀