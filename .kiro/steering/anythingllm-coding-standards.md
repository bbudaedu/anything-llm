---
inclusion: always
---

# AnythingLLM Code Standards & Best Practices

## Code Style Guidelines

### JavaScript/React Standards

#### Naming Conventions
```javascript
// Use camelCase for variables and functions
const userName = "john_doe";
const getUserData = () => {};

// Use PascalCase for React components
const UserProfile = () => {};
const ChatInterface = () => {};

// Use UPPER_SNAKE_CASE for constants
const API_BASE_URL = "https://api.example.com";
const MAX_FILE_SIZE = 1024 * 1024;

// File naming uses kebab-case or camelCase
// Component files: UserProfile.jsx, ChatInterface.jsx
// Utility files: apiHelpers.js, storageUtils.js
```

#### React Component Structure
```javascript
// Standard component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * User profile component
 * @param {Object} props - Component properties
 * @param {string} props.userId - User ID
 * @param {Function} props.onUpdate - Update callback function
 */
const UserProfile = ({ userId, onUpdate }) => {
  const { t } = useTranslation();
  
  // State definitions
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Side effect handling
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Event handler functions
  const handleUpdate = async (userData) => {
    try {
      setLoading(true);
      await updateUser(userData);
      onUpdate?.(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render logic with internationalization
  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div>{t('common.error')}: {error}</div>;

  return (
    <div className="user-profile">
      {/* Component content with i18n support */}
      <h2>{t('user.profile.title')}</h2>
    </div>
  );
};

// PropTypes definition
UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func
};

export default UserProfile;
```

#### Hooks Usage Guidelines
```javascript
// Custom Hook naming starts with 'use'
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data fetching logic
  }, [userId]);

  return { user, loading, refetch: () => {} };
};

// Context usage
const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
};

// Internationalization Hook
const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return { t, changeLanguage, currentLanguage: i18n.language };
};
```

### Backend Node.js Standards

#### API Endpoint Structure
```javascript
// Standard endpoint structure
const express = require('express');
const { validatedRequest } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

/**
 * User management endpoints
 */
const userEndpoints = (app) => {
  // GET endpoint - Retrieve user data
  app.get('/api/users/:id', 
    [requireAuth], 
    async (request, response) => {
      try {
        const { id } = request.params;
        const user = await User.findById(id);
        
        if (!user) {
          return response.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        response.status(200).json({
          success: true,
          user: user.toJSON()
        });
      } catch (error) {
        console.error('Failed to retrieve user:', error);
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  );

  // POST endpoint - Create user
  app.post('/api/users',
    [requireAuth, validatedRequest],
    async (request, response) => {
      try {
        const userData = request.body;
        const user = await User.create(userData);
        
        response.status(201).json({
          success: true,
          user: user.toJSON(),
          message: 'User created successfully'
        });
      } catch (error) {
        console.error('Failed to create user:', error);
        response.status(400).json({
          success: false,
          message: error.message
        });
      }
    }
  );
};

module.exports = { userEndpoints };
```

#### Data Model Structure
```javascript
// Prisma model usage
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * User data model
 */
const User = {
  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  create: async (userData) => {
    return await prisma.user.create({
      data: userData
    });
  },

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User data or null
   */
  findById: async (id) => {
    return await prisma.user.findUnique({
      where: { id }
    });
  },

  /**
   * Update user data
   * @param {string} id - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated user
   */
  update: async (id, updateData) => {
    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  }
};

module.exports = { User };
```

## Error Handling Standards

### Frontend Error Handling
```javascript
// Unified error handling Hook with i18n support
const useErrorHandler = () => {
  const { t } = useTranslation();
  
  const showError = (error) => {
    console.error('Application error:', error);
    
    // Display different messages based on error type
    if (error.response?.status === 401) {
      toast.error(t('errors.unauthorized'));
      // Redirect to login page
    } else if (error.response?.status === 403) {
      toast.error(t('errors.forbidden'));
    } else {
      toast.error(error.message || t('errors.unknown'));
    }
  };

  return { showError };
};

// API call error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed (${url}):`, error);
    throw error;
  }
};
```

### Backend Error Handling
```javascript
// Global error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error('Server error:', error);

  // Prisma error handling
  if (error.code === 'P2002') {
    return response.status(409).json({
      success: false,
      message: 'Duplicate data, please check input'
    });
  }

  // JWT error handling
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }

  // Default error response
  response.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error'
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

## 測試標準

### 前端測試
```javascript
// React 組件測試
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

describe('UserProfile 組件', () => {
  test('應該正確顯示使用者資訊', async () => {
    const mockUser = {
      id: '1',
      name: '測試使用者',
      email: 'test@example.com'
    };

    render(<UserProfile userId="1" />);

    // 等待資料載入
    await waitFor(() => {
      expect(screen.getByText('測試使用者')).toBeInTheDocument();
    });

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('應該處理載入狀態', () => {
    render(<UserProfile userId="1" />);
    expect(screen.getByText('載入中...')).toBeInTheDocument();
  });
});

// Hook 測試
import { renderHook, act } from '@testing-library/react';
import { useUserData } from '../hooks/useUserData';

describe('useUserData Hook', () => {
  test('應該正確獲取使用者資料', async () => {
    const { result } = renderHook(() => useUserData('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeDefined();
  });
});
```

### 後端測試
```javascript
// API 端點測試
const request = require('supertest');
const app = require('../index');

describe('使用者 API', () => {
  test('GET /api/users/:id 應該返回使用者資料', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.id).toBe('1');
  });

  test('POST /api/users 應該創建新使用者', async () => {
    const userData = {
      name: '新使用者',
      email: 'new@example.com'
    };

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid-token')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.name).toBe(userData.name);
  });
});

// 模型測試
describe('User 模型', () => {
  test('應該正確創建使用者', async () => {
    const userData = {
      name: '測試使用者',
      email: 'test@example.com'
    };

    const user = await User.create(userData);

    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });
});
```

## 效能最佳化標準

### 前端效能
```javascript
// React.memo 使用
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return (
    <div>
      {/* 複雜的渲染邏輯 */}
    </div>
  );
}, (prevProps, nextProps) => {
  // 自訂比較邏輯
  return prevProps.data.id === nextProps.data.id;
});

// useMemo 和 useCallback 使用
const DataProcessor = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  const handleItemClick = useCallback((itemId) => {
    // 處理點擊事件
  }, []);

  return (
    <div>
      {filteredItems.map(item => (
        <Item 
          key={item.id} 
          data={item} 
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
};

// 懶載入組件
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <LazyComponent />
    </Suspense>
  );
};
```

### 後端效能
```javascript
// 資料庫查詢最佳化
const getWorkspaceWithDocuments = async (workspaceId) => {
  return await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      documents: {
        select: {
          id: true,
          name: true,
          createdAt: true
          // 只選擇需要的欄位
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50 // 限制結果數量
      }
    }
  });
};

// 快取實作
const cache = new Map();

const getCachedData = async (key, fetchFn, ttl = 300000) => {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, {
    data,
    timestamp: Date.now()
  });

  return data;
};
```

## 安全性標準

### 輸入驗證
```javascript
// 使用 Joi 進行資料驗證
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
});

const validateUser = (userData) => {
  const { error, value } = userSchema.validate(userData);
  if (error) {
    throw new Error(`驗證失敗: ${error.details[0].message}`);
  }
  return value;
};
```

### XSS 防護
```javascript
// 前端 - 使用 DOMPurify 清理 HTML
import DOMPurify from 'dompurify';

const SafeHTML = ({ content }) => {
  const cleanHTML = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

// 後端 - 輸出編碼
const he = require('he');

const safeOutput = (userInput) => {
  return he.encode(userInput);
};
```

## Internationalization (i18n) Standards

### Translation File Structure
```javascript
// frontend/src/locales/en/common.json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "error": "Error",
    "success": "Success"
  },
  "user": {
    "profile": {
      "title": "User Profile",
      "edit": "Edit Profile"
    }
  },
  "errors": {
    "unauthorized": "Please log in again",
    "forbidden": "Insufficient permissions",
    "unknown": "An unknown error occurred"
  }
}

// frontend/src/locales/zh/common.json
{
  "common": {
    "loading": "載入中...",
    "save": "儲存",
    "cancel": "取消",
    "error": "錯誤",
    "success": "成功"
  },
  "user": {
    "profile": {
      "title": "使用者個人資料",
      "edit": "編輯個人資料"
    }
  },
  "errors": {
    "unauthorized": "請重新登入",
    "forbidden": "權限不足",
    "unknown": "發生未知錯誤"
  }
}
```

### i18n Setup
```javascript
// frontend/src/locales/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './en/common.json';
import zhCommon from './zh/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      zh: { common: zhCommon }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### Component Usage Examples
```javascript
// Good - Using translation keys
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('user.profile.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
};

// Bad - Hardcoded text
const MyComponent = () => {
  return (
    <div>
      <h1>User Profile</h1>
      <button>Save</button>
    </div>
  );
};
```

### Language Switching
```javascript
// Language switcher component
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
};
```

These code standards ensure AnythingLLM project's code quality, maintainability, security, and international accessibility for the GitHub community.