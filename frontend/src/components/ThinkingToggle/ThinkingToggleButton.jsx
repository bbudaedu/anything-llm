import React, { useEffect, useCallback } from "react";
import { useThinkingToggle } from "@/hooks/useThinkingToggle";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";

/**
 * 思考過程切換按鈕組件
 * 提供切換顯示/隱藏 AI 思考過程的功能
 * 支援鍵盤快捷鍵和無障礙功能
 * 僅對 Admin 角色使用者顯示
 */
export default function ThinkingToggleButton() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { showThinking, toggleThinking, isLoading } = useThinkingToggle();

  // Only show the button to Admin users
  const isAdmin = user?.role === "admin";
  
  // If user is not admin, don't render the component
  if (!isAdmin) {
    return null;
  }

  /**
   * 處理鍵盤快捷鍵 Ctrl/Cmd + Shift + T
   * 僅對 Admin 使用者有效
   */
  const handleKeyboardShortcut = useCallback(
    (event) => {
      // Only allow keyboard shortcut for admin users
      if (!isAdmin) return;
      
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "T"
      ) {
        event.preventDefault();
        toggleThinking();
      }
    },
    [toggleThinking, isAdmin]
  );

  // 註冊全域鍵盤快捷鍵（僅 Admin 使用者）
  useEffect(() => {
    // Only register keyboard shortcut for admin users
    if (!isAdmin) return;
    
    document.addEventListener("keydown", handleKeyboardShortcut);
    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [handleKeyboardShortcut, isAdmin]);

  /**
   * 處理按鈕點擊事件
   */
  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleThinking();
    },
    [toggleThinking]
  );

  // 如果正在載入偏好設定，顯示載入狀態
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[22px] h-[22px] opacity-50">
        <div className="w-3 h-3 border border-theme-text-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 根據當前狀態決定圖示和工具提示文字
  const IconComponent = showThinking ? Eye : EyeSlash;

  // 工具提示文字
  const tooltipText = showThinking
    ? t("thinking_toggle.hide_thinking", "隱藏思考過程 (Ctrl+Shift+T)")
    : t("thinking_toggle.show_thinking", "顯示思考過程 (Ctrl+Shift+T)");

  // 無障礙標籤
  const ariaLabel = showThinking
    ? t("thinking_toggle.hide_thinking_aria", "隱藏 AI 思考過程")
    : t("thinking_toggle.show_thinking_aria", "顯示 AI 思考過程");

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`
          border-none inline-flex justify-center items-center rounded-lg cursor-pointer 
          transition-all duration-200 ease-in-out
          w-[22px] h-[22px] p-0.5
          ${
            showThinking
              ? "opacity-100 hover:opacity-80 bg-theme-sidebar-footer-bg hover:bg-theme-sidebar-footer-bg/80"
              : "opacity-60 hover:opacity-100 hover:bg-theme-sidebar-footer-bg/20"
          }
          light:opacity-100 light:hover:opacity-60
          focus:outline-none focus:ring-2 focus:ring-theme-text-primary focus:ring-opacity-50
          disabled:cursor-not-allowed disabled:opacity-25
        `}
        data-tooltip-id="thinking-toggle-tooltip"
        data-tooltip-content={tooltipText}
        aria-label={ariaLabel}
        aria-pressed={showThinking}
        role="switch"
        tabIndex={0}
      >
        <IconComponent
          color="var(--theme-sidebar-footer-icon-fill)"
          className="w-[18px] h-[18px] pointer-events-none text-theme-text-primary"
          weight={showThinking ? "fill" : "regular"}
        />
        <span className="sr-only">
          {showThinking 
            ? t("thinking_toggle.hide_thinking_aria", "隱藏 AI 思考過程")
            : t("thinking_toggle.show_thinking_aria", "顯示 AI 思考過程")
          }
        </span>
      </button>

      <Tooltip
        id="thinking-toggle-tooltip"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </>
  );
}
