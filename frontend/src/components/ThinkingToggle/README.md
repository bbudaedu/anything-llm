# 思考過程切換功能 (Thinking Toggle Feature)

## 概述

這個功能允許使用者在 @agent 模式下控制是否顯示 AI 的思考過程。使用者可以在簡潔模式和詳細模式之間切換，以獲得不同的使用體驗。

## 功能特點

- ✅ **切換按鈕**：在 PromptInput 區域提供切換按鈕
- ✅ **鍵盤快捷鍵**：支援 Ctrl/Cmd + Shift + T 快捷鍵
- ✅ **簡潔模式**：只顯示進度指示器和關鍵步驟
- ✅ **詳細模式**：顯示完整的思考過程
- ✅ **狀態持久化**：使用者偏好設定會自動儲存
- ✅ **國際化支援**：支援多語言
- ✅ **無障礙功能**：支援螢幕閱讀器和鍵盤導航

## 組件結構

```
ThinkingToggle/
├── ThinkingToggleButton.jsx     # 切換按鈕組件
├── ProgressIndicator.jsx        # 進度指示器組件
├── ThinkingToggleTest.jsx       # 測試組件
└── README.md                    # 說明文件
```

## 核心檔案

- `ThinkingToggleContext.jsx` - React Context 狀態管理
- `hooks/useThinkingToggle.js` - 自訂 Hook
- `utils/thinkingToggleStorage.js` - localStorage 持久化
- `utils/thinkingContentFilter.js` - 內容過濾和分析

## 使用方式

### 基本使用

```jsx
import { useThinkingToggle } from "@/hooks/useThinkingToggle";

function MyComponent() {
  const { showThinking, isSimpleMode, toggleMode } = useThinkingToggle();

  return (
    <div>
      <p>當前模式: {isSimpleMode ? "簡潔" : "詳細"}</p>
      <button onClick={toggleMode}>切換模式</button>
    </div>
  );
}
```

### 在 ThoughtContainer 中使用

```jsx
import { useThinkingToggle } from "@/hooks/useThinkingToggle";
import { formatForSimpleDisplay } from "@/utils/thinkingContentFilter";

function ThoughtContainer({ content }) {
  const { shouldShowThinking, isSimpleMode } = useThinkingToggle();
  const simpleDisplayData = formatForSimpleDisplay(content);

  if (isSimpleMode && !shouldShowThinking()) {
    return <ProgressIndicator {...simpleDisplayData} />;
  }

  // 顯示完整思考過程
  return <DetailedThoughtDisplay content={content} />;
}
```

## API 參考

### useThinkingToggle Hook

```typescript
interface ThinkingToggleHook {
  // 狀態
  showThinking: boolean; // 是否顯示思考過程
  mode: "simple" | "detailed"; // 當前模式
  isSimpleMode: boolean; // 是否為簡潔模式
  preferences: object; // 完整偏好設定
  isLoading: boolean; // 是否正在載入

  // 動作
  setShowThinking: (show: boolean) => void;
  setMode: (mode: string) => void;
  toggleMode: () => void;
  enableDetailedMode: () => void;
  enableSimpleMode: () => void;
  updatePreferences: (updates: object) => void;

  // 工具函數
  shouldShowThinking: () => boolean;
  getDisplayConfig: () => object;
}
```

### ProgressIndicator 組件

```typescript
interface ProgressIndicatorProps {
  status?: "thinking" | "complete" | "error" | "idle";
  currentStep?: string;
  progress?: number; // 0-100
  showProgress?: boolean;
  className?: string;
}
```

### 內容過濾工具

```typescript
// 格式化思考內容用於簡潔顯示
formatForSimpleDisplay(content: string): {
  currentStep: string;
  status: string;
  progress: number;
  summary: string;
  requiresAttention: boolean;
  hasContent: boolean;
}

// 提取當前步驟
extractCurrentStep(content: string): string;

// 檢測思考狀態
detectThinkingStatus(content: string): string;

// 計算進度
calculateThinkingProgress(content: string): number;
```

## 鍵盤快捷鍵

- **Ctrl/Cmd + Shift + T**: 切換思考過程顯示模式

## 國際化

支援的語言：

- 英文 (en)
- 繁體中文 (zh_TW)

翻譯鍵值：

```javascript
thinking_toggle: {
  hide_thinking: "Hide thinking process (Ctrl+Shift+T)",
  show_thinking: "Show thinking process (Ctrl+Shift+T)",
  hide_thinking_aria: "Hide AI thinking process",
  show_thinking_aria: "Show AI thinking process",
}

thinking_progress: {
  thinking: "Thinking...",
  complete: "Complete",
  error: "Error occurred",
  idle: "Ready",
}
```

## 測試

使用 `ThinkingToggleTest` 組件來測試功能：

```jsx
import ThinkingToggleTest from "@/components/ThinkingToggle/ThinkingToggleTest";

// 在開發環境中使用
<ThinkingToggleTest />;
```

## 故障排除

### 常見問題

1. **切換按鈕不顯示**

   - 確認 `ThinkingToggleProvider` 已包裝在應用程式根層級
   - 檢查 import 路徑是否正確

2. **狀態不持久化**

   - 檢查瀏覽器是否支援 localStorage
   - 確認沒有隱私模式或擴充功能阻止 localStorage

3. **鍵盤快捷鍵不工作**
   - 確認沒有其他元素阻止事件冒泡
   - 檢查是否有衝突的快捷鍵

### 除錯

啟用除錯模式：

```javascript
// 在瀏覽器控制台中
localStorage.setItem("thinking_toggle_debug", "true");
```

## 效能考量

- 使用 React.memo 避免不必要的重新渲染
- localStorage 操作有錯誤處理和驗證
- 內容過濾函數經過最佳化，適合處理大量文字

## 未來改進

- [ ] 後端 API 整合（任務 4）
- [ ] 管理員預設設定（任務 6）
- [ ] 更多視覺效果和動畫（任務 7）
- [ ] 更多語言支援
- [ ] 自訂主題支援
