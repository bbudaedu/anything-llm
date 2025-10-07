import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ThinkingToggleProvider } from "@/ThinkingToggleContext";
import ThinkingToggleButton from "../ThinkingToggleButton";
import { ThoughtChainComponent } from "@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer";

// Mock dependencies
vi.mock("@/utils/request", () => ({
  userFromStorage: vi.fn(),
  baseHeaders: vi.fn(() => ({})),
}));

vi.mock("@/models/system", () => ({
  default: {
    keys: vi.fn(),
  },
}));

vi.mock("@/models/admin", () => ({
  default: {
    getThinkingDisplaySetting: vi.fn(),
    updateThinkingDisplaySetting: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
  }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("react-tooltip", () => ({
  Tooltip: ({ children, ...props }) => (
    <div data-testid="tooltip" {...props}>
      {children}
    </div>
  ),
}));

import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import Admin from "@/models/admin";

describe("Thinking Toggle Integration Tests", () => {
  const mockToggleThinking = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    System.keys.mockResolvedValue({ MultiUserMode: false });
    Admin.getThinkingDisplaySetting.mockResolvedValue({
      success: true,
      thinking_display_enabled: false,
    });
    Admin.updateThinkingDisplaySetting.mockResolvedValue({
      success: true,
      thinking_display_enabled: true,
    });
  });

  describe("Single User Mode Integration", () => {
    beforeEach(() => {
      userFromStorage.mockReturnValue({
        role: "admin",
        username: "admin-user",
      });
      System.keys.mockResolvedValue({ MultiUserMode: false });
    });

    it("should integrate ThinkingToggleProvider with ThinkingToggleButton in single-user mode", async () => {
      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      const button = screen.getByRole("switch");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("should toggle thinking display in single-user mode", async () => {
      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      const button = screen.getByRole("switch");
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-pressed", "true");
      });
    });
  });

  describe("Multi User Mode Integration", () => {
    beforeEach(() => {
      userFromStorage.mockReturnValue({
        role: "admin",
        username: "admin-user",
      });
      System.keys.mockResolvedValue({ MultiUserMode: true });
    });

    it("should integrate with system settings in multi-user mode", async () => {
      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(Admin.getThinkingDisplaySetting).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      const button = screen.getByRole("switch");
      fireEvent.click(button);

      await waitFor(() => {
        expect(Admin.updateThinkingDisplaySetting).toHaveBeenCalledWith(true);
      });
    });

    it("should not show button for non-admin users in multi-user mode", async () => {
      userFromStorage.mockReturnValue({
        role: "default",
        username: "regular-user",
      });

      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(screen.queryByRole("switch")).not.toBeInTheDocument();
      });
    });
  });

  describe("ThoughtContainer Integration", () => {
    const TestWrapper = ({ showThinking = false, children }) => (
      <ThinkingToggleProvider>
        <div data-testid="thinking-context" data-show-thinking={showThinking}>
          {children}
        </div>
      </ThinkingToggleProvider>
    );

    it("should integrate with ThoughtContainer to control thinking display", async () => {
      const thoughtContent = "<thinking>This is a test thought</thinking>";

      render(
        <TestWrapper showThinking={false}>
          <ThoughtChainComponent content={thoughtContent} expanded={false} />
        </TestWrapper>
      );

      // In simple mode, should show progress indicator instead of full content
      await waitFor(() => {
        // The component should render but in simplified mode
        expect(screen.getByText(/思考中|處理完成/)).toBeInTheDocument();
      });
    });

    it("should show full thinking content when showThinking is true", async () => {
      const thoughtContent =
        "<thinking>This is a detailed thought process</thinking>";

      render(
        <TestWrapper showThinking={true}>
          <ThoughtChainComponent content={thoughtContent} expanded={false} />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show the actual thinking content
        expect(
          screen.getByText(/This is a detailed thought process/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling Integration", () => {
    beforeEach(() => {
      userFromStorage.mockReturnValue({
        role: "admin",
        username: "admin-user",
      });
      System.keys.mockResolvedValue({ MultiUserMode: true });
    });

    it("should handle API errors gracefully", async () => {
      Admin.getThinkingDisplaySetting.mockRejectedValue(
        new Error("Network error")
      );

      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      // Should still render button with default state
      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      const button = screen.getByRole("switch");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("should handle update failures gracefully", async () => {
      Admin.updateThinkingDisplaySetting.mockResolvedValue({
        success: false,
        error: "Update failed",
      });

      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      const button = screen.getByRole("switch");
      fireEvent.click(button);

      await waitFor(() => {
        expect(Admin.updateThinkingDisplaySetting).toHaveBeenCalled();
      });

      // Button state should not change on failure
      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Keyboard Shortcuts Integration", () => {
    beforeEach(() => {
      userFromStorage.mockReturnValue({
        role: "admin",
        username: "admin-user",
      });
      System.keys.mockResolvedValue({ MultiUserMode: false });
    });

    it("should handle Ctrl+Shift+T keyboard shortcut", async () => {
      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      // Simulate Ctrl+Shift+T
      fireEvent.keyDown(document, {
        key: "T",
        ctrlKey: true,
        shiftKey: true,
      });

      await waitFor(() => {
        const button = screen.getByRole("switch");
        expect(button).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should handle Cmd+Shift+T keyboard shortcut on Mac", async () => {
      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      // Simulate Cmd+Shift+T (Mac)
      fireEvent.keyDown(document, {
        key: "T",
        metaKey: true,
        shiftKey: true,
      });

      await waitFor(() => {
        const button = screen.getByRole("switch");
        expect(button).toHaveAttribute("aria-pressed", "true");
      });
    });
  });

  describe("Accessibility Integration", () => {
    beforeEach(() => {
      userFromStorage.mockReturnValue({
        role: "admin",
        username: "admin-user",
      });
      System.keys.mockResolvedValue({ MultiUserMode: false });
    });

    it("should have proper ARIA attributes and screen reader support", async () => {
      render(
        <ThinkingToggleProvider>
          <ThinkingToggleButton />
        </ThinkingToggleProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole("switch")).toBeInTheDocument();
      });

      const button = screen.getByRole("switch");

      // Check ARIA attributes
      expect(button).toHaveAttribute("aria-label");
      expect(button).toHaveAttribute("aria-pressed");
      expect(button).toHaveAttribute("role", "switch");
      expect(button).toHaveAttribute("tabIndex", "0");

      // Check screen reader text
      expect(screen.getByText(/顯示 AI 思考過程|隱藏 AI 思考過程/)).toHaveClass(
        "sr-only"
      );

      // Check tooltip attributes
      expect(button).toHaveAttribute("data-tooltip-id");
      expect(button).toHaveAttribute("data-tooltip-content");
    });
  });
});
