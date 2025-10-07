import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Error boundary component for thinking display functionality
 * Provides graceful fallback when thinking display components fail
 */
class ThinkingDisplayErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    console.error("ThinkingDisplay Error:", error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - hide thinking process by default on error
      return (
        <ThinkingDisplayFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Fallback component displayed when thinking display encounters an error
 */
function ThinkingDisplayFallback({ error, onRetry }) {
  const { t } = useTranslation();

  return (
    <div className="thinking-display-error-fallback">
      <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 text-red-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm text-red-700">
            {t("thinkingToggle.errorFallback.message")}
          </span>
        </div>
        <button
          onClick={onRetry}
          className="text-xs text-red-600 hover:text-red-800 underline"
        >
          {t("thinkingToggle.errorFallback.retry")}
        </button>
      </div>
    </div>
  );
}

export default ThinkingDisplayErrorBoundary;
