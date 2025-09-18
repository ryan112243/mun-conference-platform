# 📋 分步驟手動部署指南

> **跟著這個指南，一步一步完成免費部署！**

## 🎯 部署順序

**重要**：必須按照以下順序部署，因為服務之間有依賴關係：
1. 數據庫 → 2. 後端 → 3. 前端 → 4. 連接配置

---

## 📤 第一步：上傳代碼到 GitHub

### 1.1 初始化 Git 倉庫
```bash
# 打開 PowerShell，進入項目目錄
cd C:\Users\User\Desktop\MUN\mun-site

# 初始化 Git（如果還沒有）
git init

# 添加所有文件
git add .

# 提交代碼
git commit -m "準備手動部署到 Render"
```

### 1.2 創建 GitHub 倉庫
1. 訪問 [github.com](https://github.com)
2. 點擊右上角 "+" → "New repository"
3. 填寫倉庫信息：
   ```
   Repository name: mun-conference-platform
   Description: MUN Conference Platform - Free Deployment
   Visibility: Public（免費用戶必須選擇 Public）
   ```
4. **不要**勾選 "Add a README file"
5. 點擊 "Create repository"

### 1.3 推送代碼
```bash
# 連接到 GitHub 倉庫（替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/mun-conference-platform.git

# 推送代碼
git branch -M main
git push -u origin main
```

---

## 🗄️ 第二步：創建數據庫（第一個服務）

### 2.1 註冊 Render
1. 訪問 [render.com](https://render.com)
2. 點擊 "Get Started for Free"
3. 選擇 "Sign up with GitHub"
4. 授權 Render 訪問你的 GitHub

### 🗄️ 第二步：創建免費數據庫

### 2.1 使用 MongoDB Atlas（推薦）
**MongoDB Atlas 提供 512MB 免費存儲空間，完全足夠 MUN 系統使用！**

1. 訪問 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 點擊 **"Try Free"** 註冊帳戶
3. 創建免費集群：
   ```
   Cluster Name: mun-cluster
   Cloud Provider: AWS
   Region: 選擇離你最近的地區
   Plan: M0 Sandbox (FREE)
   ```

4. 設置數據庫用戶：
   ```
   Username: mun_user
   Password: 生成強密碼（記住這個密碼）
   ```

5. 設置網絡訪問：
   - 添加你的當前 IP
   - 添加 `0.0.0.0/0`（用於 Render 部署）

6. 獲取連接字符串：
   - 點擊 **"Connect"** → **"Drivers"**
   - 複製連接字符串，格式如：
   ```
   mongodb+srv://mun_user:你的密碼@mun-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**詳細步驟請參考：** <mcfile name="MONGODB_SETUP_GUIDE.md" path="c:\Users\User\Desktop\MUN\mun-site\MONGODB_SETUP_GUIDE.md"></mcfile>

### 2.2 替代方案：Render PostgreSQL（如果需要）
如果你偏好使用 PostgreSQL：

1. 在 Render Dashboard 點擊 **"New +"**
2. 選擇 **"PostgreSQL"**
3. 填寫數據庫配置：
   ```
   Name: mun-database
   Database: mun_conference
   User: mun_user
   Region: Oregon (US West)
   PostgreSQL Version: 15
   Plan: Free
   ```

4. 點擊 **"Create Database"**
5. 等待數據庫狀態變為 **"Available"**（約 2-3 分鐘）
6. 複製 **"External Database URL"**

**注意**：如果使用 PostgreSQL，需要修改後端代碼以使用 PostgreSQL 驅動而不是 MongoDB。

---

## 🖥️ 第三步：部署後端服務（第二個服務）

### 3.1 創建後端 Web Service
1. 在 Render Dashboard 點擊 **"New +"**
2. 選擇 **"Web Service"**
3. 選擇 **"Build and deploy from a Git repository"**
4. 點擊 **"Connect"** 連接你的 GitHub 帳戶
5. 選擇剛才創建的倉庫：`mun-conference-platform`

### 3.2 配置後端服務
填寫以下配置：

```
Name: mun-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

**重要檢查點**：
- ✅ Root Directory 必須是 `backend`
- ✅ Runtime 必須是 `Node`
- ✅ Plan 必須是 `Free`

### 3.3 設置後端環境變數
在 **"Environment Variables"** 部分點擊 **"Add Environment Variable"**，添加以下變數：

```bash
# 數據庫連接（使用 MongoDB Atlas 獲得的連接字符串）
MONGODB_URI=mongodb+srv://mun_user:你的密碼@mun-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

# JWT 密鑰（自己生成一個長隨機字符串）
JWT_SECRET=mun-super-secret-jwt-key-2025-render-deployment-secure

# 服務端口（Render 要求）
PORT=10000

# CORS 設置（暫時設置，稍後更新）
FRONTEND_URL=https://localhost:3000

# 會議設置
DEFAULT_MEETING_DURATION=120
MAX_PARTICIPANTS=50

# 文件上傳設置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 3.4 部署後端
1. 檢查所有配置無誤
2. 點擊 **"Create Web Service"**
3. 等待部署完成（約 5-10 分鐘）
4. 部署成功後，複製後端 URL，格式如：
   ```
   https://mun-backend-xxxx.onrender.com
   ```
5. **重要**：保存這個 URL，前端部署時需要用到

---

## 🌐 第四步：部署前端服務（第三個服務）

### 4.1 創建前端 Static Site
1. 在 Render Dashboard 點擊 **"New +"**
2. 選擇 **"Static Site"**
3. 選擇同一個 GitHub 倉庫：`mun-conference-platform`

### 4.2 配置前端服務
填寫以下配置：

```
Name: mun-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
Plan: Free
```

**重要檢查點**：
- ✅ Root Directory 必須是 `frontend`
- ✅ Build Command 必須是 `npm install && npm run build`
- ✅ Publish Directory 必須是 `dist`
- ✅ Plan 必須是 `Free`

### 4.3 設置前端環境變數
在 **"Environment Variables"** 部分添加：

```bash
# 後端 API URL（使用第三步獲得的 URL）
VITE_API_URL=https://mun-backend-xxxx.onrender.com

# 應用配置
VITE_APP_NAME=MUN Conference Platform
VITE_APP_VERSION=1.0.0

# 功能開關
VITE_ENABLE_AUDIO=true
VITE_ENABLE_VIDEO=false
VITE_ENABLE_CHAT=true
```

### 4.4 部署前端
1. 檢查所有配置無誤
2. 點擊 **"Create Static Site"**
3. 等待部署完成（約 3-5 分鐘）
4. 部署成功後，複製前端 URL，格式如：
   ```
   https://mun-frontend-xxxx.onrender.com
   ```

---

## 🔗 第五步：連接所有服務

### 5.1 更新後端 CORS 設置
1. 回到後端服務（`mun-backend`）
2. 點擊 **"Environment"** 標籤
3. 找到 `FRONTEND_URL` 變數
4. 更新為前端的實際 URL：
   ```
   FRONTEND_URL=https://mun-frontend-xxxx.onrender.com
   ```
5. 點擊 **"Save Changes"**
6. 等待自動重新部署（約 2-3 分鐘）

### 5.2 驗證所有服務
檢查 Render Dashboard 中的服務狀態：

| 服務 | 狀態 | URL |
|------|------|-----|
| mun-database | 🟢 Available | - |
| mun-backend | 🟢 Live | `https://mun-backend-xxxx.onrender.com` |
| mun-frontend | 🟢 Live | `https://mun-frontend-xxxx.onrender.com` |

---

## ✅ 第六步：測試部署

### 6.1 基本功能測試
1. **訪問網站**：打開前端 URL
2. **檢查頁面**：確認頁面正常載入
3. **測試國家選擇**：下拉選單應該有很多國家
4. **測試語音功能**：點擊朗讀按鈕

### 6.2 會議功能測試
1. **創建會議**：
   - 填寫會議信息
   - 選擇國家
   - 點擊創建會議
   - 應該獲得邀請碼

2. **加入會議**：
   - 使用邀請碼加入會議
   - 確認能正常進入會議室

### 6.3 檢查控制台錯誤
1. 按 F12 打開開發者工具
2. 查看 Console 標籤
3. 確認沒有紅色錯誤信息

---

## 🎉 完成！你的免費服務已上線

### 📊 服務總覽
```
✅ 數據庫：PostgreSQL 免費版（512MB）
✅ 後端：Node.js Web Service 免費版（750小時/月）
✅ 前端：靜態網站免費版（100GB帶寬/月）
✅ SSL：自動 HTTPS 加密
✅ 域名：免費 .onrender.com 子域名
```

### 💰 節省成本
你剛才部署的服務如果在其他平台需要：
- Heroku: ~$25/月
- AWS: ~$30/月
- DigitalOcean: ~$20/月
- **Render 免費版: $0/月** 🎉

---

## 🚀 後續操作

### 自動部署設置
現在每次你推送代碼到 GitHub：
```bash
git add .
git commit -m "更新功能"
git push origin main
```
Render 會自動重新部署你的應用！

### 避免睡眠模式
免費服務 15 分鐘無活動會睡眠，推薦使用：
1. **UptimeRobot**（免費）：[uptimerobot.com](https://uptimerobot.com)
2. 添加你的前端和後端 URL
3. 設置每 5 分鐘檢查一次

### 自定義域名（可選）
如果你有自己的域名：
1. 在 Render 服務設置中點擊 "Custom Domains"
2. 添加你的域名
3. 按照說明設置 DNS 記錄

---

## 🔧 常見問題解決

### 後端部署失敗
**錯誤**：Build failed
**解決**：
1. 檢查 Root Directory 是否設置為 `backend`
2. 確認 Build Command 是 `npm install`
3. 確認 Start Command 是 `npm start`

### 前端部署失敗
**錯誤**：Build failed
**解決**：
1. 檢查 Root Directory 是否設置為 `frontend`
2. 確認 Build Command 是 `npm install && npm run build`
3. 確認 Publish Directory 是 `dist`

### 網站無法連接後端
**錯誤**：API 請求失敗
**解決**：
1. 確認 `VITE_API_URL` 設置正確
2. 確認後端 `FRONTEND_URL` 設置正確
3. 檢查兩個服務都在運行

### 數據庫連接失敗
**錯誤**：Database connection failed
**解決**：
1. 確認數據庫狀態是 "Available"
2. 檢查 `MONGODB_URI` 環境變數
3. 確認 URL 格式正確（包含用戶名和密碼）

---

**🎯 恭喜！你已經成功手動部署了完整的 MUN 會議系統！**

現在你可以：
- 分享網站給朋友使用
- 繼續開發新功能
- 學習更多 Render 的高級功能
- 考慮升級到付費方案（當用戶量增長時）

**記住**：這個部署完全免費，沒有任何隱藏費用！ 🚀