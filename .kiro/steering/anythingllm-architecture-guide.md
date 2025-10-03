---
inclusion: always
---

# AnythingLLM Architecture & Technology Stack Guide

## Project Overview

AnythingLLM is a full-stack application that enables users to convert any document, resource, or content into context that LLMs can use during chat conversations. It's a multi-user, customizable private ChatGPT solution with international language support.

## Core Technology Stack

### Frontend
- **Framework**: React 18.2.0 + Vite 4.3.0
- **Styling**: TailwindCSS + PostCSS
- **State Management**: React Context API
- **Routing**: React Router DOM 6.3.0
- **UI Components**: 
  - @tremor/react (Charts and data visualization)
  - @phosphor-icons/react (Icons)
  - react-beautiful-dnd (Drag and drop functionality)
  - react-toastify (Notifications)
- **Internationalization**: i18next + react-i18next (English & Chinese support)
- **Voice Features**: 
  - react-speech-recognition (Speech recognition)
  - @mintplex-labs/piper-tts-web (Text-to-speech)
- **Document Processing**: 
  - markdown-it (Markdown rendering)
  - highlight.js (Code highlighting)
  - katex (Mathematical formulas)
- **Other Tools**:
  - onnxruntime-web (Machine learning inference)
  - qrcode.react (QR code generation)
  - recharts (Charts)

### Backend (Server)
- **Framework**: Node.js + Express.js
- **Database**: Prisma ORM (supports multiple databases)
- **Authentication**: JWT + bcrypt
- **WebSocket**: @mintplex-labs/express-ws
- **Task Scheduling**: @mintplex-labs/bree
- **LLM Integration**:
  - OpenAI SDK
  - @anthropic-ai/sdk (Claude)
  - @langchain/core + related packages
  - ollama (Local LLM)
  - cohere-ai
- **Vector Databases**:
  - @lancedb/lancedb (Default)
  - @pinecone-database/pinecone
  - chromadb
  - @qdrant/js-client-rest
  - @zilliz/milvus2-sdk-node
  - weaviate-ts-client
- **Cloud Services**:
  - @aws-sdk/client-bedrock-runtime
  - @datastax/astra-db-ts
- **Document Processing**: 
  - @xenova/transformers (Embedding models)
  - js-tiktoken (Token calculation)
- **Other Tools**:
  - winston (Logging)
  - joi (Data validation)
  - swagger-ui-express (API documentation)
  - posthog-node (Analytics)

### Document Collector
- **Framework**: Node.js + Express.js
- **Document Processing**:
  - pdf-parse (PDF)
  - mammoth (Word documents)
  - node-xlsx (Excel)
  - officeparser (Office documents)
  - epub2 (E-books)
  - puppeteer (Web scraping)
  - tesseract.js (OCR)
- **Media Processing**:
  - fluent-ffmpeg (Audio/Video)
  - sharp (Image processing)
  - wavefile (Audio)
- **Other**:
  - youtubei.js (YouTube content)
  - mbox-parser (Email)

## Project Structure

```
anything-llm/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom Hooks
│   │   ├── locales/        # Internationalization files (en/zh)
│   │   └── models/         # Data models
│   ├── public/             # Static assets
│   └── dist/               # Build output
├── server/                  # Node.js backend
│   ├── endpoints/          # API endpoints
│   ├── models/             # Data models
│   ├── utils/              # Utility functions
│   ├── middleware/         # Middleware
│   ├── prisma/             # Database Schema
│   ├── storage/            # File storage
│   └── swagger/            # API documentation
├── collector/               # Document processing service
│   ├── processSingleFile/  # Single file processing
│   ├── processLink/        # Link processing
│   ├── extensions/         # Extensions
│   └── utils/              # Utility functions
├── docker/                  # Docker configuration
├── embed/                   # Embedded widget (submodule)
├── browser-extension/       # Browser extension (submodule)
└── cloud-deployments/       # Cloud deployment configurations
```

## Core Functional Architecture

### Workspaces
- Each workspace is an independent chat environment
- Documents can be shared without interfering with each other
- Supports multi-user permission management
- Internationalized UI supporting English and Chinese

### Document Processing Flow
1. **Upload**: Users upload documents through the frontend
2. **Collection**: Collector service processes and parses documents
3. **Embedding**: Convert document content to vector embeddings
4. **Storage**: Store in selected vector database
5. **Retrieval**: Retrieve relevant content based on queries during chat

### LLM Integration
- Supports multiple LLM providers (OpenAI, Anthropic, local models, etc.)
- Unified API interface
- Supports multimodal (text, images)
- Custom AI agents

### Vector Database Support
- Default uses LanceDB
- Supports Pinecone, Chroma, Qdrant, Milvus, Weaviate, etc.
- Dynamic vector database switching

## 開發環境設定

### 必要環境變數
```bash
# Server (.env.development)
JWT_SECRET=your-jwt-secret
VECTOR_DB=lancedb
LLM_PROVIDER=openai
OPENAI_API_KEY=your-openai-key
EMBEDDING_ENGINE=native
TTS_PROVIDER=native
WHISPER_PROVIDER=local

# 資料庫設定 (如果使用外部資料庫)
DATABASE_URL=your-database-url

# 向量資料庫設定 (根據選擇的提供者)
PINECONE_API_KEY=your-pinecone-key
CHROMA_ENDPOINT=http://localhost:8000
```

### 開發工作流程
1. `yarn setup` - 初始化專案和環境
2. `yarn dev:server` - 啟動後端服務 (port 3001)
3. `yarn dev:frontend` - 啟動前端服務 (port 3000)
4. `yarn dev:collector` - 啟動文件收集器 (port 8888)
5. `yarn dev:all` - 同時啟動所有服務

## API 架構

### RESTful API
- `/api/v1/` - 主要 API 端點
- `/api/system/` - 系統管理
- `/api/workspace/` - 工作區管理
- `/api/chat/` - 聊天功能
- `/api/admin/` - 管理員功能

### WebSocket
- 即時聊天通訊
- 代理執行狀態更新
- 系統通知

### 開發者 API
- 完整的 REST API
- OpenAI 相容端點
- Swagger 文件自動生成

## 部署選項

### Docker 部署
- 單一容器包含所有服務
- 支援 Docker Compose
- 環境變數配置

### 雲端部署
- AWS (CloudFormation)
- Google Cloud Platform
- DigitalOcean
- Railway
- Render.com

### 裸機部署
- 直接在伺服器上運行
- 需要 Node.js 18+ 環境
- 支援 PM2 進程管理

## 安全性考量

### 認證與授權
- JWT Token 認證
- 角色基礎存取控制 (RBAC)
- API 金鑰管理

### 資料保護
- 本地資料儲存選項
- 加密傳輸 (HTTPS)
- 敏感資料遮罩

### 隱私設定
- 可選的遙測功能
- 本地 LLM 支援
- 資料不會離開本地環境

## 效能最佳化

### 前端最佳化
- Vite 建置最佳化
- 程式碼分割
- 懶載入組件
- Bundle 分析工具

### 後端最佳化
- 向量快取機制
- 資料庫查詢最佳化
- 檔案儲存最佳化
- 記憶體管理

### 擴展性
- 微服務架構
- 水平擴展支援
- 負載平衡
- 快取策略

這個架構指南將幫助開發者更好地理解 AnythingLLM 的整體設計和技術選擇，確保開發工作符合專案的架構原則。