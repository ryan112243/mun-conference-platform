# MUN Conference Platform

一個現代化的模擬聯合國會議平台，支持多語言（中文/英文）、AI對話助手和實時討論功能。

## 功能特色

- 🌐 **多語言支持**: 支持中文和英文界面
- 🤖 **AI對話助手**: 集成多個AI模型進行智能對話
- 💬 **實時討論**: 會議室內實時討論功能
- 🗑️ **對話管理**: 可刪除已結束的對話，離開會議時自動清理
- 📱 **響應式設計**: 適配各種設備屏幕
- 🎨 **現代化UI**: 使用Tailwind CSS構建的美觀界面

## 技術棧

### 前端
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### 後端
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- Morgan

## 本地開發

### 環境要求
- Node.js >= 14.0.0
- npm 或 yarn

### 安裝步驟

1. **克隆項目**
   ```bash
   git clone <your-repository-url>
   cd mun-site
   ```

2. **安裝後端依賴**
   ```bash
   cd backend
   npm install
   ```

3. **安裝前端依賴**
   ```bash
   cd ../frontend
   npm install
   ```

4. **環境配置**
   在 `backend` 目錄下創建 `.env` 文件：
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/mun-platform
   NODE_ENV=development
   ```

5. **啟動開發服務器**
   
   **後端服務器** (在 backend 目錄):
   ```bash
   npm start
   ```
   
   **前端開發服務器** (在 frontend 目錄):
   ```bash
   npm run dev
   ```

6. **訪問應用**
   - 前端: http://localhost:5173
   - 後端API: http://localhost:3001

## 部署指南

### 部署到 Render

#### 準備工作

1. **創建 GitHub 倉庫**
   - 在 GitHub 上創建新倉庫
   - 將代碼推送到 GitHub

2. **準備部署配置**
   
   在項目根目錄創建 `render.yaml`:
   ```yaml
   services:
     - type: web
       name: mun-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
         - key: MONGODB_URI
           fromDatabase:
             name: mun-database
             property: connectionString
   
     - type: web
       name: mun-frontend
       env: static
       buildCommand: cd frontend && npm install && npm run build
       staticPublishPath: ./frontend/dist
       envVars:
         - key: VITE_API_URL
           fromService:
             type: web
             name: mun-backend
             property: host
   
   databases:
     - name: mun-database
       databaseName: mun_platform
       user: mun_user
   ```

#### 部署步驟

1. **註冊 Render 帳號**
   - 訪問 [render.com](https://render.com)
   - 使用 GitHub 帳號註冊

2. **連接 GitHub 倉庫**
   - 在 Render Dashboard 點擊 "New +"
   - 選擇 "Blueprint"
   - 連接你的 GitHub 倉庫
   - 選擇包含 `render.yaml` 的倉庫

3. **配置環境變量**
   - MongoDB URI 會自動配置
   - 確認其他環境變量設置正確

4. **部署**
   - Render 會自動根據 `render.yaml` 配置部署
   - 等待部署完成

### 手動部署到 Render

如果不使用 Blueprint，可以分別部署前後端：

#### 部署後端

1. **創建 Web Service**
   - 選擇 "Web Service"
   - 連接 GitHub 倉庫
   - 設置以下配置：
     - **Name**: mun-backend
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Environment Variables**:
       - `NODE_ENV=production`
       - `MONGODB_URI=<your-mongodb-uri>`

#### 部署前端

1. **創建 Static Site**
   - 選擇 "Static Site"
   - 連接同一個 GitHub 倉庫
   - 設置以下配置：
     - **Name**: mun-frontend
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/dist`
     - **Environment Variables**:
       - `VITE_API_URL=<your-backend-url>`

### 環境變量配置

#### 後端環境變量
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-connection-string>
```

#### 前端環境變量
```env
VITE_API_URL=<your-backend-api-url>
```

## 項目結構

```
mun-site/
├── backend/                 # 後端代碼
│   ├── server.js           # 服務器入口
│   ├── package.json        # 後端依賴
│   └── ...
├── frontend/               # 前端代碼
│   ├── src/
│   │   ├── components/     # React 組件
│   │   ├── App.jsx        # 主應用組件
│   │   └── main.jsx       # 應用入口
│   ├── package.json       # 前端依賴
│   └── vite.config.js     # Vite 配置
├── package.json           # 根目錄配置
├── README.md              # 項目說明
├── .gitignore            # Git 忽略文件
└── render.yaml           # Render 部署配置
```

## 使用說明

1. **創建會議**
   - 在首頁選擇國家
   - 點擊"創建會議"
   - 獲得會議邀請碼

2. **加入會議**
   - 輸入會議邀請碼
   - 點擊"加入會議"

3. **使用功能**
   - **討論區**: 進行實時文字討論
   - **AI助手**: 與AI進行對話，獲得建議和幫助
   - **語言切換**: 在右上角切換中英文界面
   - **對話管理**: 刪除不需要的對話記錄

## 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 許可證

© 2025 MUN Conference Platform. 版權所有。

## 支持

如果您遇到任何問題或有建議，請創建 Issue 或聯繫開發團隊。