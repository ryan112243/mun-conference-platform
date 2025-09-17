# 部署指南 - GitHub 和 Render

本指南將詳細說明如何將 MUN Conference Platform 上傳到 GitHub 並部署到 Render。

## 第一步：準備 GitHub 上傳

### 1. 初始化 Git 倉庫

在項目根目錄 (`mun-site`) 中打開終端，執行以下命令：

```bash
# 初始化 Git 倉庫
git init

# 添加所有文件到暫存區
git add .

# 創建第一次提交
git commit -m "Initial commit: MUN Conference Platform with multilingual support and AI chat"
```

### 2. 創建 GitHub 倉庫

1. **登錄 GitHub**
   - 訪問 [github.com](https://github.com)
   - 登錄你的 GitHub 帳號

2. **創建新倉庫**
   - 點擊右上角的 "+" 按鈕
   - 選擇 "New repository"
   - 填寫倉庫信息：
     - **Repository name**: `mun-conference-platform`
     - **Description**: `A modern Model United Nations conference platform with multilingual support and AI chat assistant`
     - **Visibility**: 選擇 Public 或 Private
     - **不要**勾選 "Initialize this repository with a README"

3. **連接本地倉庫到 GitHub**
   
   創建倉庫後，GitHub 會顯示連接指令。在你的項目目錄中執行：

   ```bash
   # 添加遠程倉庫（替換 YOUR_USERNAME 為你的 GitHub 用戶名）
   git remote add origin https://github.com/YOUR_USERNAME/mun-conference-platform.git
   
   # 推送代碼到 GitHub
   git branch -M main
   git push -u origin main
   ```

### 3. 驗證上傳

- 刷新 GitHub 倉庫頁面
- 確認所有文件都已上傳
- 檢查 README.md 是否正確顯示

## 第二步：部署到 Render

### 方法一：使用 Blueprint（推薦）

1. **註冊 Render 帳號**
   - 訪問 [render.com](https://render.com)
   - 點擊 "Get Started"
   - 選擇 "Sign up with GitHub" 使用 GitHub 帳號註冊

2. **創建 Blueprint 部署**
   - 登錄後，點擊 "New +"
   - 選擇 "Blueprint"
   - 點擊 "Connect GitHub" 並授權 Render 訪問你的 GitHub
   - 選擇你剛創建的 `mun-conference-platform` 倉庫
   - Render 會自動檢測到 `render.yaml` 文件
   - 點擊 "Apply" 開始部署

3. **等待部署完成**
   - Render 會自動創建：
     - MongoDB 數據庫
     - 後端 Web Service
     - 前端 Static Site
   - 部署過程大約需要 5-10 分鐘

### 方法二：手動部署

如果 Blueprint 方法不可用，可以手動創建服務：

#### 2.1 部署後端

1. **創建 Web Service**
   - 在 Render Dashboard 點擊 "New +"
   - 選擇 "Web Service"
   - 連接你的 GitHub 倉庫
   - 配置設置：
     - **Name**: `mun-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`

2. **設置環境變量**
   - 在 "Environment" 標籤中添加：
     - `NODE_ENV` = `production`
     - `PORT` = `10000`
     - `MONGODB_URI` = （稍後設置）

#### 2.2 創建數據庫

1. **創建 MongoDB 數據庫**
   - 點擊 "New +"
   - 選擇 "PostgreSQL" 旁邊的下拉菜單
   - 選擇 "MongoDB"
   - 配置：
     - **Name**: `mun-database`
     - **Database Name**: `mun_platform`
     - **User**: `mun_user`

2. **獲取連接字符串**
   - 數據庫創建完成後，複製 "Internal Connection String"
   - 回到後端服務，將此字符串設置為 `MONGODB_URI` 環境變量

#### 2.3 部署前端

1. **創建 Static Site**
   - 點擊 "New +"
   - 選擇 "Static Site"
   - 連接同一個 GitHub 倉庫
   - 配置：
     - **Name**: `mun-frontend`
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/dist`

2. **設置環境變量**
   - 獲取後端服務的 URL（例如：`https://mun-backend.onrender.com`）
   - 在前端服務的環境變量中添加：
     - `VITE_API_URL` = `https://mun-backend.onrender.com`

## 第三步：驗證部署

### 1. 檢查服務狀態

- 在 Render Dashboard 中確認所有服務都顯示為 "Live"
- 檢查部署日誌，確保沒有錯誤

### 2. 測試應用功能

1. **訪問前端應用**
   - 點擊前端服務的 URL
   - 測試語言切換功能
   - 嘗試創建和加入會議

2. **測試 AI 對話功能**
   - 進入會議室
   - 切換到 AI 助手標籤
   - 發送測試消息

3. **測試對話管理**
   - 創建對話後嘗試刪除
   - 離開會議，確認對話被清除

## 第四步：自定義域名（可選）

如果你有自己的域名：

1. **在 Render 中設置自定義域名**
   - 進入前端服務設置
   - 點擊 "Custom Domains"
   - 添加你的域名

2. **配置 DNS**
   - 在你的域名提供商處添加 CNAME 記錄
   - 指向 Render 提供的地址

## 故障排除

### 常見問題

1. **部署失敗**
   - 檢查 `package.json` 文件是否正確
   - 確認所有依賴都已列出
   - 查看部署日誌中的錯誤信息

2. **前端無法連接後端**
   - 確認 `VITE_API_URL` 環境變量設置正確
   - 檢查後端服務是否正常運行
   - 確認 CORS 設置允許前端域名

3. **數據庫連接問題**
   - 驗證 `MONGODB_URI` 環境變量
   - 確認數據庫服務正常運行
   - 檢查網絡連接設置

### 獲取幫助

- 查看 Render 官方文檔：[render.com/docs](https://render.com/docs)
- 檢查項目的 GitHub Issues
- 聯繫開發團隊

## 更新部署

當你對代碼進行更改時：

1. **提交更改到 GitHub**
   ```bash
   git add .
   git commit -m "描述你的更改"
   git push origin main
   ```

2. **自動重新部署**
   - Render 會自動檢測 GitHub 的更改
   - 自動觸發重新部署
   - 等待部署完成

## 監控和維護

1. **監控服務狀態**
   - 定期檢查 Render Dashboard
   - 設置通知提醒

2. **查看日誌**
   - 在服務頁面查看實時日誌
   - 監控錯誤和性能問題

3. **備份數據**
   - 定期備份 MongoDB 數據
   - 考慮設置自動備份

恭喜！你的 MUN Conference Platform 現在已經成功部署到雲端了！🎉