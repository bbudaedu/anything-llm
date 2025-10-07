import { useTranslation } from "react-i18next";
import { useThinkingToggle } from "@/ThinkingToggleContext";
import { toast } from "react-toastify";

/**
 * Hook for handling thinking toggle permissions and user notifications
 * @returns {Object} Permission checking functions and error handlers
 */
export function useThinkingTogglePermissions() {
  const { t } = useTranslation();
  const { canControlThinking, isAdmin, multiUserMode } = useThinkingToggle();

  /**
   * Check if user has permission to control thinking display
   * Shows appropriate error message if not
   * @returns {boolean} Whether user has permission
   */
  const checkPermission = () => {
    if (!canControlThinking) {
      if (multiUserMode && !isAdmin) {
        toast.error(t("thinkingToggle.permissions.adminOnly"));
      } else {
        toast.error(t("thinkingToggle.permissions.insufficientPermissions"));
      }
      return false;
    }
    return true;
  };

  /**
   * Execute an action with permission checking
   * @param {Function} action - Action to execute if permission is granted (can be async)
   * @returns {Promise<boolean>} Whether action was executed successfully
   */
  const withPermissionCheck = async (action) => {
    if (checkPermission()) {
      try {
        const result = await action();
        return result !== false; // Consider undefined/null as success, only false as failure
      } catch (error) {
        console.error("Error executing thinking toggle action:", error);
        toast.error(t("common.error"));
        return false;
      }
    }
    return false;
  };

  return {
    canControlThinking,
    isAdmin,
    multiUserMode,
    checkPermission,
    withPermissionCheck,
  };
}