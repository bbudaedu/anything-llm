# 設計文件

## 概述

此功能提供一個眼睛圖示的 UI 控制項，允許管理員使用者統一控制 LLM 思考過程和 @agent 模式思考過程的顯示。當前系統已有 `ThoughtContainer` 組件來顯示 AI 的思考過程，此設計將在現有架構基礎上添加基於角色的全域控制功能。預設情況下思考過程關閉，只有 Admin 角色使用者才能看到和操作眼睛圖示控制項。

## 架構

### 前端架構
- **React 組件架構**：基於現有的 `WorkspaceChat` > `ChatContainer` > `ChatHistory` > `ThoughtContainer` 層次結構
- **狀態管理**：使用 React Context 進行全域狀態管理，localStorage 作為備份
- **UI 組件**：在 `PromptInput` 區域添加眼睛圖示控制項（僅 Admin 可見）
- **角色檢查**：整合現有的使用者角色系統進行權限控制

### 後端架構
- **API 端點**：擴展現有的系統設定 API，而非使用者偏好設定
- **資料庫**：在系統設定表中添加全域思考過程顯示設定欄位
- **中介軟體**：添加 Admin 角色驗證中介軟體
- **權限控制**：確保只有 Admin 角色可以修改思考過程顯示設定

## 組件和介面

### 1. ThinkingToggleContext
```javascript
// 新的 Context 用於管理全域思考過程顯示狀態
const ThinkingToggleContext = createContext({
  showThinking: false, // 預設關閉
  setShowThinking: () => {},
  isAdmin: false,
  canControlThinking: false,
  toggleMode: () => {}
});
```

### 2. ThinkingToggleButton 組件
```javascript
// 位於 PromptInput 區域的眼睛圖示切換按鈕（僅 Admin 可見）
const ThinkingToggleButton = () => {
  const { isAdmin, showThinking, toggleMode } = useThinkingToggle();
  
  // 只有 Admin 角色才渲染此組件
  if (!isAdmin) return null;
  
  // 眼睛圖示切換按鈕，包含工具提示
  // 支援鍵盤快捷鍵 (Ctrl/Cmd + Shift + T)
  // 控制全域思考過程顯示狀態
};
```

### 3. 增強的 ThoughtContainer
```javascript
// 修改現有的 ThoughtContainer 以支援全域思考過程控制
const ThoughtContainer = ({ content, expanded }) => {
  const { showThinking } = useThinkingToggle();
  
  // 根據全域 showThinking 狀態決定顯示模式
  // 關閉模式：只顯示進度指示器和關鍵步驟
  // 開啟模式：顯示完整的 LLM 和 @agent 思考過程
  
  if (!showThinking) {
    return <ProgressIndicator content={content} />;
  }
  
  return <DetailedThoughtDisplay content={content} expanded={expanded} />;
};
```

### 4. ProgressIndicator 組件
```javascript
// 新組件用於思考過程關閉時的進度顯示
const ProgressIndicator = ({ content }) => {
  // 從思考內容中提取關鍵進度資訊
  // 顯示當前執行步驟摘要
  // 包含進度條和狀態指示器
  // 適用於 LLM 思考過程和 @agent 模式
};
```

### 5. API 介面擴展
```javascript
// 新增系統設定 API（僅 Admin 可存取）
PUT /api/admin/system/thinking-display
{
  "showThinking": boolean
}

GET /api/system/thinking-display
// 返回當前全域思考過程顯示設定（所有使用者可讀取）

// 角色驗證中介軟體
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

## 資料模型

### 系統設定擴展
```sql
-- 在系統設定表中添加全域思考過程顯示設定
CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_settings (setting_key, setting_value) 
VALUES ('thinking_display_enabled', 'false');
```

### 前端狀態模型
```javascript
// localStorage 備份儲存格式
const thinkingSystemSettings = {
  showThinking: boolean,
  lastUpdated: timestamp,
  isAdmin: boolean
};

// Context 狀態模型
const contextState = {
  showThinking: boolean, // 全域設定
  isAdmin: boolean, // 使用者角色
  canControlThinking: boolean, // 是否可控制設定
  loading: boolean // 載入狀態
};
```

## 錯誤處理

### 1. 網路錯誤處理
- 當無法載入系統設定時，使用 localStorage 備份（預設關閉）
- 顯示載入錯誤提示
- 在網路恢復時自動重新載入設定

### 2. 權限錯誤處理
- 當非 Admin 使用者嘗試修改設定時，返回 403 錯誤
- 前端隱藏控制項以防止未授權存取
- 提供適當的錯誤訊息

### 3. 組件錯誤邊界
```javascript
// 為思考顯示相關組件添加錯誤邊界
const ThinkingDisplayErrorBoundary = ({ children }) => {
  // 捕獲和處理組件錯誤
  // 在錯誤情況下預設隱藏思考過程
  // 提供降級顯示選項
};
```

## 測試策略

### 1. 單元測試
- **ThinkingToggleContext**：測試全域狀態管理和角色檢查
- **ThinkingToggleButton**：測試 Admin 權限控制和切換功能
- **增強的 ThoughtContainer**：測試基於全域設定的顯示模式
- **ProgressIndicator**：測試進度顯示邏輯和內容提取

### 2. 整合測試
- **權限控制**：測試 Admin 角色的權限驗證
- **系統設定同步**：測試全域設定的載入和儲存
- **跨組件通信**：測試 Context 在組件間的狀態傳遞
- **錯誤恢復**：測試網路錯誤和權限錯誤的處理

### 3. 端到端測試
- **Admin 工作流程**：測試 Admin 使用者的完整操作流程
- **非 Admin 使用者體驗**：測試非 Admin 使用者看不到控制項
- **全域設定影響**：測試設定變更對所有使用者的影響
- **響應式設計**：測試在不同裝置尺寸下的顯示

### 4. 效能測試
- **渲染效能**：測試大量思考內容的渲染效能
- **記憶體使用**：測試長時間使用的記憶體洩漏
- **API 請求**：測試系統設定 API 的效能

## 實作細節

### 1. 顯示模式切換邏輯
```javascript
// 簡潔模式顯示邏輯
const SimpleThoughtDisplay = ({ content, status }) => {
  return (
    <div className="simple-thought-display">
      <ProgressIndicator status={status} />
      <CurrentStepDisplay step={extractCurrentStep(content)} />
      {status === 'error' && <ErrorDisplay />}
    </div>
  );
};
```

### 2. 鍵盤快捷鍵實作
```javascript
// 全域鍵盤快捷鍵處理
useEffect(() => {
  const handleKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      toggleThinkingMode();
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);
```

### 3. 設定同步機制
```javascript
// 設定同步邏輯
const syncPreferences = async (preferences) => {
  try {
    await updateUserPreferences(preferences);
    localStorage.setItem('thinkingPreferences', JSON.stringify({
      ...preferences,
      lastSynced: Date.now()
    }));
  } catch (error) {
    // 處理同步失敗
    console.warn('Failed to sync preferences:', error);
  }
};
```

### 4. 響應式設計考量
```css
/* 移動裝置適配 */
@media (max-width: 768px) {
  .thinking-toggle-button {
    /* 調整按鈕大小和位置 */
  }
  
  .simple-thought-display {
    /* 優化移動裝置顯示 */
  }
}
```

## 安全考量

### 1. 資料驗證
- 驗證使用者偏好設定的格式和值
- 防止惡意的設定注入

### 2. 權限控制
- 確保使用者只能修改自己的偏好設定
- 管理員可以設定系統預設值

### 3. 資料隱私
- 思考過程內容不會被額外記錄或傳輸
- 使用者偏好設定的安全儲存

## 效能最佳化

### 1. 渲染最佳化
- 使用 React.memo 避免不必要的重新渲染
- 虛擬化長內容的顯示

### 2. 狀態管理最佳化
- 使用 useCallback 和 useMemo 最佳化 Context 值
- 避免頻繁的 localStorage 讀寫

### 3. 網路請求最佳化
- 批次處理設定更新請求
- 使用防抖動避免頻繁的 API 呼叫

## 可訪問性

### 1. 鍵盤導航
- 所有控制項支援鍵盤操作
- 提供鍵盤快捷鍵

### 2. 螢幕閱讀器支援
- 適當的 ARIA 標籤和角色
- 狀態變化的語音提示

### 3. 視覺輔助
- 高對比度模式支援
- 可調整的字體大小

## 國際化支援

### 1. 多語言文字
- 所有 UI 文字支援國際化
- 包含工具提示和錯誤訊息

### 2. 文字方向支援
- 支援 RTL 語言的佈局調整

## 向後相容性

### 1. 現有功能保持
- 不影響現有的思考過程顯示功能
- 預設行為保持一致

### 2. 漸進式增強
- 新功能作為可選增強
- 在不支援的環境中優雅降級