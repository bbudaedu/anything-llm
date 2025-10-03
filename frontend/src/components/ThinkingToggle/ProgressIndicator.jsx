import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, XCircle, Spinner } from "@phosphor-icons/react";

/**
 * 進度指示器組件，用於簡潔模式下顯示 AI 思考過程的進度
 * @param {Object} props - 組件屬性
 * @param {string} props.status - 當前狀態 ('thinking', 'complete', 'error', 'idle')
 * @param {string} props.currentStep - 當前執行的步驟描述
 * @param {number} props.progress - 進度百分比 (0-100)
 * @param {boolean} props.showProgress - 是否顯示進度條
 * @param {string} props.className - 額外的 CSS 類名
 */
export default function ProgressIndicator({
  status = "idle",
  currentStep = "",
  progress = 0,
  showProgress = false,
  className = "",
}) {
  const { t } = useTranslation();

  /**
   * 根據狀態獲取對應的圖示組件
   */
  const getStatusIcon = () => {
    const iconProps = {
      className: "w-4 h-4 flex-shrink-0",
      weight: "regular",
    };

    switch (status) {
      case "thinking":
        return (
          <Spinner
            {...iconProps}
            className={`${iconProps.className} animate-spin text-blue-500`}
          />
        );
      case "complete":
        return (
          <CheckCircle
            {...iconProps}
            className={`${iconProps.className} text-green-500`}
            weight="fill"
          />
        );
      case "error":
        return (
          <XCircle
            {...iconProps}
            className={`${iconProps.className} text-red-500`}
            weight="fill"
          />
        );
      case "idle":
      default:
        return (
          <Clock
            {...iconProps}
            className={`${iconProps.className} text-theme-text-secondary`}
          />
        );
    }
  };

  /**
   * 根據狀態獲取狀態文字
   */
  const getStatusText = () => {
    switch (status) {
      case "thinking":
        return t("thinking_progress.thinking", "思考中...");
      case "complete":
        return t("thinking_progress.complete", "完成");
      case "error":
        return t("thinking_progress.error", "發生錯誤");
      case "idle":
      default:
        return t("thinking_progress.idle", "準備中");
    }
  };

  /**
   * 根據狀態獲取進度條顏色
   */
  const getProgressColor = () => {
    switch (status) {
      case "thinking":
        return "bg-blue-500";
      case "complete":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "idle":
      default:
        return "bg-theme-text-secondary";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg bg-theme-bg-chat-input border border-theme-sidebar-border ${className}`}
    >
      {/* 狀態圖示 */}
      <div className="flex items-center justify-center">{getStatusIcon()}</div>

      {/* 狀態資訊 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-theme-text-primary">
            {getStatusText()}
          </span>
          {showProgress && (
            <span className="text-xs text-theme-text-secondary">
              {Math.round(progress)}%
            </span>
          )}
        </div>

        {/* 當前步驟描述 */}
        {currentStep && (
          <div className="text-xs text-theme-text-secondary truncate">
            {currentStep}
          </div>
        )}

        {/* 進度條 */}
        {showProgress && (
          <div className="mt-2 w-full bg-theme-sidebar-border rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${getProgressColor()}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 簡化版進度指示器，只顯示基本狀態
 */
export function SimpleProgressIndicator({
  status,
  currentStep,
  className = "",
}) {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (status) {
      case "thinking":
        return (
          <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      case "complete":
        return <CheckCircle className="w-3 h-3 text-green-500" weight="fill" />;
      case "error":
        return <XCircle className="w-3 h-3 text-red-500" weight="fill" />;
      default:
        return (
          <div className="w-3 h-3 rounded-full bg-theme-text-secondary opacity-50" />
        );
    }
  };

  return (
    <div
      className={`flex items-center gap-2 text-xs text-theme-text-secondary ${className}`}
    >
      {getStatusIcon()}
      {currentStep && (
        <span className="truncate max-w-[200px]">{currentStep}</span>
      )}
    </div>
  );
}
