# 專案設計文件：台灣氣象 GIS 資訊地圖
(Taiwan Weather GIS Web Application)

## 1. 專案概述 (Project Overview)
本專案旨在開發一個互動式的台灣地圖網頁應用程式，透過視覺化方式呈現台灣各地的即時氣象資訊。系統將自動從交通部中央氣象署 (CWA) 獲取開源資料，整合至地理資訊系統 (GIS) 中，並透過自動化 CI/CD 流程部署至雲端平台。

## 2. 系統架構 (System Architecture)
採用現代化的 **Serverless (無伺服器)** 網頁架構，前後端分離但整合於單一框架內：
*   **資料來源：** 中央氣象署開放資料平台 (CWA API)
*   **後端邏輯/代理：** 透過框架內建的 API Routes 處理資料請求，避免前端直接呼叫產生 CORS 問題及 API Key 外流。
*   **資料儲存 (可選)：** 若僅需即時資料，可省略資料庫，改採 Cache 機制；若需歷史紀錄，則採用雲端資料庫。
*   **前端展示：** 基於 React 的網頁介面，搭配輕量級 Web GIS 套件。
*   **部署環境：** Vercel (Edge Network)

## 3. 技術選型 (Tech Stack)
*   **核心框架：** Next.js (React 架構，完美支援 Vercel 與 API Routes)
*   **Web GIS 套件：** Leaflet.js + React-Leaflet (輕量且開源，適合呈現台灣底圖與氣象 Marker)
*   **樣式與 UI：** Tailwind CSS (快速建立現代化響應式介面)
*   **雲端資料庫 (若需 Step 2 儲存功能)：** Supabase 或 Firebase (支援 Serverless 環境的 NoSQL/PostgreSQL)
*   **版本控制：** Git / GitHub

## 4. 實作步驟詳細規劃 (Implementation Steps)

### Step 1: CWA 相關 API 準備 (CWA Related API)
1. 註冊交通部中央氣象署開放資料平台帳號。
2. 申請取得 API 授權碼 (Authorization Key)。
3. 測試所需的 API 端點 (例如：`F-C0032-001` 一般天氣預報、或觀測站即時資料)。

### Step 2: 獲取資料與儲存 (Data Fetching & Storage)
*   **策略 A (無資料庫/即時串接)：** 
    *   在 Next.js 建立 `/api/weather` 路由。
    *   伺服器端定時或在請求時向 CWA 抓取資料，並設定 Cache 避免超過 API 呼叫限制。
*   **策略 B (有資料庫/歷史儲存)：**
    *   開通 Supabase 專案。
    *   撰寫 Cron Job (透過 Vercel Cron 或外部服務) 定時抓取 CWA 資料並寫入 Supabase 資料庫。

### Step 3: 地端 GIS 開發與資料綁定 (GIS Web with Taiwan)
1. 建立 Next.js 專案並安裝 Leaflet 相關套件。
2. 匯入台灣 GeoJSON 邊界資料，設定地圖初始中心點 (緯度約 23.5, 經度約 121) 與縮放級別。
3. 撰寫前端邏輯呼叫自建的 `/api/weather`。
4. 將取得的氣象資料 (如溫度、降雨機率) 解析，並根據各測站的經緯度，在地圖上生成互動式標記 (Markers/Popups)。

### Step 4: 程式碼推送到 GitHub (Push to GitHub)
1. 在本地端初始化 Git 儲存庫 (`git init`)。
2. 設定 `.gitignore` 檔案，**務必排除 `.env` 或 `.env.local` 檔案**。
3. 將程式碼 Commit 並 Push 到 GitHub 上的遠端儲存庫。

### Step 5: Vercel 自動化部署 (Auto Deploy to Vercel)
1. 登入 Vercel 並連結 GitHub 帳號。
2. 選擇該專案的 GitHub Repository 進行 Import。
3. **重要設定：** 在 Vercel 的專案設定頁面 (Environment Variables)，將 `CWA_API_KEY` (及資料庫連線字串，若有的話) 填入。
4. 點擊 Deploy。未來只要有新的 commit 推送到 GitHub 的 `main` 分支，Vercel 就會自動觸發重新部署。

## 5. 資安與注意事項 (Security & Notes)
*   **機密金鑰不落地：** 任何 API Key 只能存在於本地端的 `.env.local` 及 Vercel 的後台環境變數中，絕對不可明文寫入程式碼。
*   **API 頻率限制 (Rate Limiting)：** 注意 CWA API 的呼叫次數上限，建議在 Next.js 實作快取 (Revalidation / SWR) 以減輕政府伺服器與自身 API 的負擔。
*   **RWD 響應式設計：** 確保 GIS 地圖在手機版網頁上也能方便拖曳與點擊。