---
inclusion: always
---

# AnythingLLM Development Workflow Guide

## Development Environment Setup Process

### Initial Setup Steps

1. **Environment Preparation**
   ```bash
   # Ensure Node.js version >= 18
   node --version
   
   # Ensure using yarn as package manager
   yarn --version
   
   # Install yarn if not available
   npm install -g yarn
   ```

2. **Project Initialization**
   ```bash
   # Clone project
   git clone https://github.com/Mintplex-Labs/anything-llm.git
   cd anything-llm
   
   # Run automatic setup script
   yarn setup
   ```

3. **Environment Variables Configuration**
   ```bash
   # Configuration files will be automatically copied, need manual completion
   # server/.env.development - Backend environment variables
   # frontend/.env - Frontend environment variables  
   # collector/.env - Collector environment variables
   # docker/.env - Docker environment variables
   ```

4. **Database Setup**
   ```bash
   # Prisma database setup
   yarn prisma:setup
   
   # Or execute step by step
   yarn prisma:generate  # Generate Prisma client
   yarn prisma:migrate   # Execute database migrations
   yarn prisma:seed      # Populate seed data
   ```

### Development Services Startup

```bash
# Method 1: Start services separately (recommended for development)
yarn dev:server     # Backend service (port 3001)
yarn dev:frontend   # Frontend service (port 3000)  
yarn dev:collector  # Document collector (port 8888)

# Method 2: Start all services simultaneously
yarn dev:all
```

## Feature Development Process

### 1. Requirements Analysis Phase

**Create Feature Specification Document**
```markdown
# Feature Name: [Feature Name]

## Requirements Description
- User stories
- Acceptance criteria
- Technical requirements

## Design Considerations
- UI/UX design
- API design
- Data model design
- Internationalization support (English/Chinese)

## Implementation Plan
- Frontend tasks
- Backend tasks
- Testing plan
- i18n implementation
```

### 2. Branch Management Strategy

```bash
# Create feature branch from main branch
git checkout main
git pull origin main
git checkout -b feature/feature-name

# Regularly sync with main branch during development
git fetch origin
git rebase origin/main

# Push branch after completing development
git push origin feature/feature-name
```

### 3. Frontend Development Process

**Component Development Steps**
```javascript
// 1. Create component file structure
frontend/src/components/FeatureName/
├── index.jsx           # Main component
├── FeatureName.jsx     # Component implementation
├── styles.css          # Style file (if needed)
└── __tests__/          # Test files
    └── FeatureName.test.jsx

// 2. Implement basic component structure with i18n support
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * [Feature Name] Component
 * @param {Object} props - Component properties
 */
const FeatureName = ({ ...props }) => {
  const { t } = useTranslation();
  
  // State management
  const [state, setState] = useState(initialState);
  
  // Side effect handling
  useEffect(() => {
    // Initialization logic
  }, []);

  // Event handling
  const handleEvent = () => {
    // Event handling logic
  };

  return (
    <div className="feature-container">
      {/* Component content with internationalization */}
      <h2>{t('feature.title')}</h2>
    </div>
  );
};

export default FeatureName;
```

**State Management Integration**
```javascript
// Use Context for global state if needed
// frontend/src/context/FeatureContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const FeatureContext = createContext();

export const useFeature = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within FeatureProvider');
  }
  return context;
};

export const FeatureProvider = ({ children }) => {
  const [state, dispatch] = useReducer(featureReducer, initialState);
  
  return (
    <FeatureContext.Provider value={{ state, dispatch }}>
      {children}
    </FeatureContext.Provider>
  );
};
```

### 4. 後端開發流程

**API 端點開發**
```javascript
// 1. 創建端點檔案
// server/endpoints/featureName.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { FeatureModel } = require('../models/feature');

const featureEndpoints = (app) => {
  // GET 端點
  app.get('/api/feature/:id', 
    [requireAuth], 
    async (request, response) => {
      try {
        const { id } = request.params;
        const result = await FeatureModel.findById(id);
        
        response.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {
        console.error('獲取功能資料失敗:', error);
        response.status(500).json({
          success: false,
          message: '伺服器錯誤'
        });
      }
    }
  );

  // POST 端點
  app.post('/api/feature',
    [requireAuth],
    async (request, response) => {
      try {
        const data = request.body;
        const result = await FeatureModel.create(data);
        
        response.status(201).json({
          success: true,
          data: result,
          message: '創建成功'
        });
      } catch (error) {
        console.error('創建功能失敗:', error);
        response.status(400).json({
          success: false,
          message: error.message
        });
      }
    }
  );
};

module.exports = { featureEndpoints };
```

**資料模型開發**
```javascript
// 2. 創建資料模型
// server/models/feature.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FeatureModel = {
  /**
   * 創建新記錄
   */
  create: async (data) => {
    return await prisma.feature.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  },

  /**
   * 根據 ID 查找
   */
  findById: async (id) => {
    return await prisma.feature.findUnique({
      where: { id }
    });
  },

  /**
   * 更新記錄
   */
  update: async (id, data) => {
    return await prisma.feature.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  },

  /**
   * 刪除記錄
   */
  delete: async (id) => {
    return await prisma.feature.delete({
      where: { id }
    });
  }
};

module.exports = { FeatureModel };
```

**Prisma Schema 更新**
```prisma
// 3. 更新資料庫 Schema
// server/prisma/schema.prisma
model Feature {
  id        String   @id @default(uuid())
  name      String
  description String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("features")
}
```

```bash
# 4. 執行資料庫遷移
yarn prisma:migrate
```

### 5. 整合與測試

**前後端整合**
```javascript
// 前端 API 呼叫
// frontend/src/utils/api/feature.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export const featureAPI = {
  /**
   * 獲取功能資料
   */
  getFeature: async (id) => {
    const response = await fetch(`${API_BASE}/api/feature/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('獲取功能資料失敗');
    }
    
    return await response.json();
  },

  /**
   * 創建功能
   */
  createFeature: async (data) => {
    const response = await fetch(`${API_BASE}/api/feature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('創建功能失敗');
    }
    
    return await response.json();
  }
};
```

**測試實作**
```javascript
// 前端組件測試
// frontend/src/components/FeatureName/__tests__/FeatureName.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeatureName } from '../FeatureName';

describe('FeatureName 組件', () => {
  test('應該正確渲染', () => {
    render(<FeatureName />);
    expect(screen.getByText('功能標題')).toBeInTheDocument();
  });

  test('應該處理使用者互動', async () => {
    render(<FeatureName />);
    
    const button = screen.getByRole('button', { name: '提交' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('操作成功')).toBeInTheDocument();
    });
  });
});

// 後端 API 測試
// server/__tests__/feature.test.js
const request = require('supertest');
const app = require('../index');

describe('Feature API', () => {
  test('POST /api/feature 應該創建新功能', async () => {
    const featureData = {
      name: '測試功能',
      description: '這是一個測試功能'
    };

    const response = await request(app)
      .post('/api/feature')
      .set('Authorization', 'Bearer valid-token')
      .send(featureData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(featureData.name);
  });
});
```

## 程式碼品質檢查

### Linting 和格式化
```bash
# 執行程式碼檢查
yarn lint

# 自動修復格式問題
yarn lint --fix

# 檢查特定目錄
cd frontend && yarn lint
cd server && yarn lint
cd collector && yarn lint
```

### 測試執行
```bash
# 執行所有測試
yarn test

# 執行特定測試
yarn test --testNamePattern="FeatureName"

# 執行測試覆蓋率檢查
yarn test --coverage
```

## 部署準備

### 建置檢查
```bash
# 前端建置
cd frontend && yarn build

# 檢查建置結果
cd frontend && yarn preview

# 後端生產模式測試
cd server && yarn start
```

### 環境變數檢查
```bash
# 確保所有必要的環境變數都已設定
# 檢查 .env.example 檔案中的所有變數
```

## 提交與合併流程

### 提交規範
```bash
# 使用語義化提交訊息
git commit -m "feat: 新增使用者個人資料功能"
git commit -m "fix: 修復登入驗證問題"
git commit -m "docs: 更新 API 文件"
git commit -m "style: 調整按鈕樣式"
git commit -m "refactor: 重構資料處理邏輯"
git commit -m "test: 新增單元測試"
```

### Pull Request 流程
1. **創建 PR**
   - 填寫詳細的 PR 描述
   - 包含功能說明和測試結果
   - 添加相關的標籤和里程碑

2. **程式碼審查**
   - 等待團隊成員審查
   - 根據回饋進行修改
   - 確保所有檢查都通過

3. **合併準備**
   - 確保分支是最新的
   - 所有測試都通過
   - 程式碼品質檢查通過

4. **合併到主分支**
   - 使用 Squash and merge 保持提交歷史整潔
   - 刪除功能分支

這個開發工作流程確保了 AnythingLLM 專案的開發品質和團隊協作效率。