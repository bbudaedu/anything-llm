import React from "react";
import { useThinkingToggle } from "@/ThinkingToggleContext";
import ThinkingToggleButton from "./ThinkingToggleButton";
import ProgressIndicator, {
  SimpleProgressIndicator,
} from "./ProgressIndicator";
import { formatForSimpleDisplay } from "@/utils/thinkingContentFilter";

/**
 * 測試組件，用於驗證思考切換功能
 */
export default function ThinkingToggleTest() {
  const {
    showThinking,
    mode,
    isSimpleMode,
    toggleMode,
    enableDetailedMode,
    enableSimpleMode,
    preferences,
    isLoading,
  } = useThinkingToggle();

  // 測試鍵盤快捷鍵的狀態
  const [shortcutTestCount, setShortcutTestCount] = React.useState(0);

  // 監聽鍵盤快捷鍵測試
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "T"
      ) {
        setShortcutTestCount((prev) => prev + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-theme-bg-secondary rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-theme-text-primary">
          思考切換功能測試
        </h2>
        <div className="text-theme-text-secondary">載入中...</div>
      </div>
    );
  }

  // 測試用的思考內容
  const testThinkingContent = `
    <thought>
    我需要分析這個問題並提供解決方案。

    首先，讓我理解使用者的需求：
    - 使用者想要一個思考過程的切換功能
    - 需要支援簡潔模式和詳細模式
    - 要有進度指示器

    現在我開始實作：
    1. 創建切換按鈕組件
    2. 實作狀態管理
    3. 添加進度指示器
    4. 整合到現有系統中

    正在處理第3步：添加進度指示器...
    </thought>
  `;

  const simpleDisplayData = formatForSimpleDisplay(testThinkingContent);

  return (
    <div className="p-6 bg-theme-bg-secondary rounded-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-theme-text-primary">
        思考切換功能測試
      </h2>

      {/* 當前狀態顯示 */}
      <div className="mb-6 p-4 bg-theme-bg-chat-input rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
          當前狀態
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-theme-text-secondary">顯示思考過程：</span>
            <span className="ml-2 text-theme-text-primary">
              {showThinking ? "是" : "否"}
            </span>
          </div>
          <div>
            <span className="text-theme-text-secondary">顯示模式：</span>
            <span className="ml-2 text-theme-text-primary">{mode}</span>
          </div>
          <div>
            <span className="text-theme-text-secondary">簡潔模式：</span>
            <span className="ml-2 text-theme-text-primary">
              {isSimpleMode ? "是" : "否"}
            </span>
          </div>
          <div>
            <span className="text-theme-text-secondary">最後更新：</span>
            <span className="ml-2 text-theme-text-primary">
              {new Date(preferences.lastUpdated).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 控制按鈕 */}
      <div className="mb-6 p-4 bg-theme-bg-chat-input rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
          控制項
        </h3>
        <div className="flex gap-4 items-center">
          <ThinkingToggleButton />
          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            切換模式
          </button>
          <button
            onClick={enableSimpleMode}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            簡潔模式
          </button>
          <button
            onClick={enableDetailedMode}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            詳細模式
          </button>
        </div>
        <div className="mt-4 p-3 bg-theme-bg-secondary rounded-lg">
          <h4 className="text-sm font-medium mb-2 text-theme-text-primary">
            鍵盤快捷鍵測試
          </h4>
          <p className="text-sm text-theme-text-secondary mb-2">
            按下 Ctrl+Shift+T (或 Cmd+Shift+T) 來測試快捷鍵功能
          </p>
          <div className="text-sm">
            <span className="text-theme-text-secondary">快捷鍵觸發次數：</span>
            <span className="ml-2 text-theme-text-primary font-mono">
              {shortcutTestCount}
            </span>
          </div>
        </div>
      </div>

      {/* 進度指示器測試 */}
      <div className="mb-6 p-4 bg-theme-bg-chat-input rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
          進度指示器測試
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-theme-text-secondary">
              思考中狀態
            </h4>
            <ProgressIndicator
              status="thinking"
              currentStep="正在分析問題並制定解決方案..."
              progress={65}
              showProgress={true}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-theme-text-secondary">
              完成狀態
            </h4>
            <ProgressIndicator
              status="complete"
              currentStep="分析完成，已生成解決方案"
              progress={100}
              showProgress={false}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-theme-text-secondary">
              錯誤狀態
            </h4>
            <ProgressIndicator
              status="error"
              currentStep="處理過程中發生錯誤"
              progress={0}
              showProgress={false}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-theme-text-secondary">
              簡化版指示器
            </h4>
            <SimpleProgressIndicator
              status="thinking"
              currentStep="正在處理請求..."
            />
          </div>
        </div>
      </div>

      {/* 內容過濾測試 */}
      <div className="mb-6 p-4 bg-theme-bg-chat-input rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
          內容過濾測試
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-theme-text-secondary">當前步驟：</span>
            <span className="ml-2 text-theme-text-primary">
              {simpleDisplayData.currentStep}
            </span>
          </div>
          <div>
            <span className="text-theme-text-secondary">狀態：</span>
            <span className="ml-2 text-theme-text-primary">
              {simpleDisplayData.status}
            </span>
          </div>
          <div>
            <span className="text-theme-text-secondary">進度：</span>
            <span className="ml-2 text-theme-text-primary">
              {simpleDisplayData.progress}%
            </span>
          </div>
          <div>
            <span className="text-theme-text-secondary">需要注意：</span>
            <span className="ml-2 text-theme-text-primary">
              {simpleDisplayData.requiresAttention ? "是" : "否"}
            </span>
          </div>
          <div>
            <span className="text-theme-text-secondary">摘要：</span>
            <div className="ml-2 mt-1 p-2 bg-theme-bg-secondary rounded text-theme-text-primary">
              {simpleDisplayData.summary}
            </div>
          </div>
        </div>
      </div>

      {/* 偏好設定顯示 */}
      <div className="p-4 bg-theme-bg-chat-input rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
          偏好設定
        </h3>
        <pre className="text-xs text-theme-text-secondary bg-theme-bg-secondary p-3 rounded overflow-auto">
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>
    </div>
  );
}
