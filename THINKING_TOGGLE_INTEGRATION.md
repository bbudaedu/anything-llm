# Thinking Toggle Integration Guide

This document provides a simplified integration guide for the thinking toggle feature in AnythingLLM.

## Core Components

### 1. ThinkingToggleButton
Location: `frontend/src/components/ThinkingToggle/ThinkingToggleButton.jsx`
- Main toggle button component
- Handles keyboard shortcuts (Ctrl+Shift+T)
- Permission-based visibility

### 2. ThinkingToggleContext
Location: `frontend/src/ThinkingToggleContext.jsx`
- Global state management
- Handles single-user and multi-user modes
- Persistence to localStorage or system settings

### 3. Permission Hook
Location: `frontend/src/hooks/useThinkingTogglePermissions.js`
- Permission checking logic
- User feedback for unauthorized actions

### 4. Storage Utilities
Location: `frontend/src/utils/thinkingToggleStorage.js`
- localStorage operations
- Preference validation

## Integration Points

### 1. Add to Chat Input Area
In `frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/index.jsx`:

```jsx
import ThinkingToggleButton from "@/components/ThinkingToggle/ThinkingToggleButton";

// Add to the controls area
<div className="flex gap-x-2">
  <ThinkingToggleButton />
  <SpeechToText sendCommand={sendCommand} />
</div>
```

### 2. Wrap App with Context Provider
In your main App component:

```jsx
import { ThinkingToggleProvider } from "@/ThinkingToggleContext";

function App() {
  return (
    <ThinkingToggleProvider>
      {/* Your app content */}
    </ThinkingToggleProvider>
  );
}
```

### 3. Use in Chat Components
In thinking/status display components:

```jsx
import { useThinkingToggle } from "@/ThinkingToggleContext";

function StatusResponse({ messages, isThinking }) {
  const { showThinking } = useThinkingToggle();
  
  if (!showThinking) {
    // Show simplified view
    return <SimpleProgressIndicator />;
  }
  
  // Show full thinking process
  return <FullThinkingDisplay />;
}
```

## Backend Requirements

### 1. Admin Endpoints
Add to `server/endpoints/admin.js`:

```javascript
// GET /admin/thinking-display
app.get("/admin/thinking-display", [validatedRequest], async (req, res) => {
  // Return current thinking display setting
});

// PUT /admin/thinking-display  
app.put("/admin/thinking-display", [validatedRequest, adminOnly], async (req, res) => {
  // Update thinking display setting
});
```

### 2. Admin Model Methods
Add to `frontend/src/models/admin.js`:

```javascript
getThinkingDisplaySetting: async function () {
  return fetch(`${API_BASE}/admin/thinking-display`, {
    method: "GET",
    headers: baseHeaders(),
  });
},

updateThinkingDisplaySetting: async function (enabled) {
  return fetch(`${API_BASE}/admin/thinking-display`, {
    method: "PUT", 
    headers: baseHeaders(),
    body: JSON.stringify({ enabled: Boolean(enabled) }),
  });
}
```

## Internationalization

Add translations to `frontend/src/locales/en/common.js`:

```javascript
thinkingToggle: {
  button: {
    tooltip: {
      show: "Show thinking process (Ctrl+Shift+T)",
      hide: "Hide thinking process (Ctrl+Shift+T)",
    },
    ariaLabel: "Toggle thinking process display",
  },
  permissions: {
    adminOnly: "Only administrators can control thinking display settings",
  },
  feedback: {
    enabled: "Thinking process display enabled",
    disabled: "Thinking process display disabled",
    error: "Failed to update thinking display setting",
  },
}
```

## Features

- ✅ Toggle button with eye/eye-slash icons
- ✅ Keyboard shortcut (Ctrl+Shift+T)
- ✅ Permission-based access control
- ✅ Single-user and multi-user mode support
- ✅ Persistent preferences
- ✅ Error boundary protection
- ✅ Internationalization support
- ✅ Accessibility features

## Usage

1. **Single-user mode**: All users can toggle thinking display
2. **Multi-user mode**: Only admins can control the system-wide setting
3. **Keyboard shortcut**: Ctrl+Shift+T (or Cmd+Shift+T on Mac)
4. **Visual feedback**: Eye icon shows current state
5. **Tooltips**: Hover for keyboard shortcut info

This simplified implementation provides the core functionality for toggling thinking process visibility in AnythingLLM chat interfaces.