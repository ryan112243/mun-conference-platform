# 🗄️ MongoDB Atlas 免費數據庫設置指南

> **完全免費的 MongoDB 雲端數據庫解決方案**

## 🎯 為什麼使用 MongoDB Atlas？

- ✅ **完全免費**：512MB 存儲空間，足夠小型項目使用
- ✅ **雲端託管**：無需自己維護數據庫服務器
- ✅ **自動備份**：數據安全有保障
- ✅ **全球部署**：多個地區可選
- ✅ **易於擴展**：需要時可輕鬆升級

## 📋 步驟一：註冊 MongoDB Atlas 帳戶

### 1.1 訪問官網
1. 打開瀏覽器，訪問：[https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. 點擊 **"Try Free"** 按鈕
3. 選擇註冊方式：
   - 使用 Google 帳戶（推薦）
   - 使用 GitHub 帳戶
   - 或創建新帳戶

### 1.2 完成註冊
1. 填寫基本信息
2. 選擇使用目的：**"Learning MongoDB"**
3. 選擇經驗等級：根據實際情況選擇
4. 點擊 **"Finish"**

## 🏗️ 步驟二：創建免費集群

### 2.1 選擇部署選項
1. 在歡迎頁面點擊 **"Create a deployment"**
2. 選擇 **"M0 Sandbox"**（免費方案）
3. 確認顯示 **"FREE"** 標籤

### 2.2 配置集群設置
```
Cluster Name: mun-cluster
Cloud Provider: AWS（推薦）
Region: 選擇離你最近的地區
  - 亞洲用戶：Singapore (ap-southeast-1)
  - 美洲用戶：N. Virginia (us-east-1)
  - 歐洲用戶：Ireland (eu-west-1)
```

### 2.3 創建集群
1. 確認所有設置正確
2. 點擊 **"Create Deployment"**
3. 等待集群創建完成（約 3-5 分鐘）

## 🔐 步驟三：設置數據庫訪問

### 3.1 創建數據庫用戶
1. 在彈出的 **"Security Quickstart"** 中
2. 設置用戶名和密碼：
   ```
   Username: mun_user
   Password: 生成一個強密碼（建議使用自動生成）
   ```
3. **重要**：記住這個密碼，稍後需要用到
4. 點擊 **"Create User"**

### 3.2 設置網絡訪問
1. 在 **"Where would you like to connect from?"** 部分
2. 選擇 **"My Local Environment"**
3. 點擊 **"Add My Current IP Address"**
4. 為了 Render 部署，還需要添加：
   - 點擊 **"Add IP Address"**
   - 輸入：`0.0.0.0/0`（允許所有 IP 訪問）
   - 描述：`Render Deployment`
5. 點擊 **"Finish and Close"**

## 🔗 步驟四：獲取連接字符串

### 4.1 進入連接設置
1. 在集群頁面點擊 **"Connect"** 按鈕
2. 選擇 **"Drivers"**
3. 選擇：
   - Driver: **Node.js**
   - Version: **4.1 or later**

### 4.2 複製連接字符串
你會看到類似這樣的連接字符串：
```
mongodb+srv://mun_user:<password>@mun-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 4.3 替換密碼
將 `<password>` 替換為你在步驟 3.1 中設置的實際密碼：
```
mongodb+srv://mun_user:你的實際密碼@mun-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 📝 步驟五：配置應用程序

### 5.1 本地開發環境
在後端目錄創建 `.env` 文件：
```bash
# 進入後端目錄
cd backend

# 創建 .env 文件
echo "MONGODB_URI=mongodb+srv://mun_user:你的密碼@mun-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority" > .env
```

### 5.2 Render 部署環境
在 Render Dashboard 的後端服務中：
1. 進入 **"Environment"** 標籤
2. 添加環境變數：
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://mun_user:你的密碼@mun-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## ✅ 步驟六：測試連接

### 6.1 本地測試
```bash
# 在後端目錄執行
cd backend
npm run dev
```

查看控制台輸出，應該看到：
```
MongoDB connected
Server running on port 5000
```

### 6.2 Render 部署測試
1. 重新部署後端服務
2. 查看部署日誌
3. 確認看到 "MongoDB connected" 消息

## 🔧 故障排除

### 常見問題

#### 1. 連接超時
**錯誤**：`MongooseServerSelectionError: connection timed out`
**解決**：
- 檢查 IP 白名單是否包含 `0.0.0.0/0`
- 確認網絡連接正常

#### 2. 認證失敗
**錯誤**：`MongooseServerSelectionError: bad auth`
**解決**：
- 檢查用戶名和密碼是否正確
- 確認密碼中的特殊字符是否需要 URL 編碼

#### 3. 數據庫名稱問題
**錯誤**：找不到數據庫
**解決**：
- MongoDB 會自動創建數據庫
- 第一次插入數據時數據庫才會真正創建

### URL 編碼特殊字符

如果密碼包含特殊字符，需要進行 URL 編碼：
```
@ → %40
: → %3A
/ → %2F
? → %3F
# → %23
[ → %5B
] → %5D
```

## 📊 監控和管理

### 查看數據庫狀態
1. 登錄 MongoDB Atlas Dashboard
2. 查看集群狀態和使用情況
3. 監控連接數和存儲使用量

### 數據備份
免費方案包含：
- 自動備份（保留 2 天）
- 可手動下載備份文件

## 💰 免費方案限制

- **存儲空間**：512MB
- **連接數**：500 個並發連接
- **備份保留**：2 天
- **支持**：社區支持

對於 MUN 會議系統來說，這些限制完全足夠！

## 🎯 完成！

現在你已經成功：
✅ 創建了免費的 MongoDB Atlas 數據庫
✅ 獲取了 MONGODB_URI 連接字符串
✅ 配置了應用程序連接
✅ 測試了數據庫連接

你的 MUN 系統現在可以使用雲端數據庫了！🚀