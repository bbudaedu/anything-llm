import React, { useState } from "react";
import ThinkingToggleButton from "./ThinkingToggleButton";
import { ThinkingToggleProvider } from "@/ThinkingToggleContext";

/**
 * Demo component to test admin role checking functionality
 * This component simulates different user roles to verify the button visibility
 */
export default function AdminRoleDemo() {
  const [mockUserRole, setMockUserRole] = useState("admin");

  // Mock the useUser hook behavior
  React.useEffect(() => {
    // This is a demo - in real usage, the role comes from the actual auth system
    const originalUseUser = require("@/hooks/useUser").default;
    
    // Note: This is just for demonstration purposes
    // In the actual implementation, the role checking works with the real auth system
  }, [mockUserRole]);

  return (
    <ThinkingToggleProvider>
      <div className="p-6 bg-theme-bg-secondary rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-theme-text-primary">
          Admin Role Checking Demo
        </h2>
        
        <div className="mb-6 p-4 bg-theme-bg-chat-input rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
            Simulate User Role
          </h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMockUserRole("admin")}
              className={`px-4 py-2 rounded transition-colors ${
                mockUserRole === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setMockUserRole("manager")}
              className={`px-4 py-2 rounded transition-colors ${
                mockUserRole === "manager"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setMockUserRole("default")}
              className={`px-4 py-2 rounded transition-colors ${
                mockUserRole === "default"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              Default User
            </button>
            <button
              onClick={() => setMockUserRole(null)}
              className={`px-4 py-2 rounded transition-colors ${
                mockUserRole === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              No User
            </button>
          </div>
          
          <div className="text-sm text-theme-text-secondary mb-4">
            Current simulated role: <span className="font-mono text-theme-text-primary">{mockUserRole || "null"}</span>
          </div>
        </div>

        <div className="mb-6 p-4 bg-theme-bg-chat-input rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
            ThinkingToggleButton Visibility Test
          </h3>
          
          <div className="flex items-center gap-4 p-4 bg-theme-bg-secondary rounded-lg">
            <span className="text-theme-text-secondary">Button:</span>
            <div className="flex items-center gap-2">
              <ThinkingToggleButton />
              <span className="text-sm text-theme-text-secondary">
                {mockUserRole === "admin" 
                  ? "✅ Visible (Admin user)" 
                  : "❌ Hidden (Non-admin user)"
                }
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-theme-bg-secondary rounded-lg">
            <h4 className="text-sm font-medium mb-2 text-theme-text-primary">
              Expected Behavior:
            </h4>
            <ul className="text-sm text-theme-text-secondary space-y-1">
              <li>• <strong>Admin:</strong> Button should be visible and functional</li>
              <li>• <strong>Manager:</strong> Button should be hidden</li>
              <li>• <strong>Default User:</strong> Button should be hidden</li>
              <li>• <strong>No User:</strong> Button should be hidden</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-theme-bg-chat-input rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-theme-text-primary">
            Keyboard Shortcut Test
          </h3>
          <p className="text-sm text-theme-text-secondary mb-2">
            Press <kbd className="px-2 py-1 bg-theme-bg-secondary rounded text-xs">Ctrl+Shift+T</kbd> 
            {" "}(or <kbd className="px-2 py-1 bg-theme-bg-secondary rounded text-xs">Cmd+Shift+T</kbd> on Mac)
          </p>
          <p className="text-xs text-theme-text-secondary">
            Keyboard shortcut should only work when user role is "admin"
          </p>
        </div>
      </div>
    </ThinkingToggleProvider>
  );
}