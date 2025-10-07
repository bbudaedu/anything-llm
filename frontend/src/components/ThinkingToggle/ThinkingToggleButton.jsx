import React, { useEffect, useCallback } from "react";
import { useThinkingToggle } from "@/ThinkingToggleContext";
import { useThinkingTogglePermissions } from "@/hooks/useThinkingTogglePermissions";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import ThinkingDisplayErrorBoundary from "./ThinkingDisplayErrorBoundary";

/**
 * Thinking process toggle button component
 * Provides functionality to toggle display/hide AI thinking process
 * Supports keyboard shortcuts and accessibility features
 * Only visible to users with appropriate permissions
 */
function ThinkingToggleButtonInner() {
  const { t } = useTranslation();
  const { showThinking, toggleThinking, isLoading } = useThinkingToggle();
  const { canControlThinking, withPermissionCheck } =
    useThinkingTogglePermissions();

  // If user cannot control thinking, don't render the component
  if (!canControlThinking) {
    return null;
  }

  /**
   * Handle keyboard shortcut Ctrl/Cmd + Shift + T
   * Uses permission check to ensure only authorized users can use it
   */
  const handleKeyboardShortcut = useCallback(
    async (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "T"
      ) {
        event.preventDefault();
        await withPermissionCheck(async () => {
          return await toggleThinking();
        });
      }
    },
    [toggleThinking, withPermissionCheck]
  );

  // Register global keyboard shortcut
  useEffect(() => {
    if (!canControlThinking) return;

    document.addEventListener("keydown", handleKeyboardShortcut);
    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [handleKeyboardShortcut, canControlThinking]);

  /**
   * Handle button click event
   */
  const handleClick = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const success = await withPermissionCheck(async () => {
        return await toggleThinking();
      });

      // Additional feedback could be added here if needed
      if (!success && process.env.NODE_ENV === "development") {
        console.warn("Failed to toggle thinking display");
      }
    },
    [toggleThinking, withPermissionCheck]
  );

  // Show loading state while preferences are being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[22px] h-[22px] opacity-50">
        <div className="w-3 h-3 border border-theme-text-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine icon and tooltip text based on current state
  const IconComponent = showThinking ? Eye : EyeSlash;

  // Tooltip text
  const tooltipText = showThinking
    ? t("thinkingToggle.button.tooltip.hide", "Hide thinking process (Ctrl+Shift+T)")
    : t("thinkingToggle.button.tooltip.show", "Show thinking process (Ctrl+Shift+T)");

  // Accessibility label
  const ariaLabel = t("thinkingToggle.button.ariaLabel", "Toggle thinking process display");

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
        <span className="sr-only">{ariaLabel}</span>
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

/**
 * Thinking process toggle button component (with error boundary)
 * Provides functionality to toggle display/hide AI thinking process
 * Supports keyboard shortcuts and accessibility features
 * Only visible to users with appropriate permissions
 */
export default function ThinkingToggleButton() {
  return (
    <ThinkingDisplayErrorBoundary>
      <ThinkingToggleButtonInner />
    </ThinkingDisplayErrorBoundary>
  );
}