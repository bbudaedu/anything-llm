import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ThinkingToggleButton from "../ThinkingToggleButton";

// Mock the hooks
vi.mock("@/hooks/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useThinkingToggle", () => ({
  useThinkingToggle: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
  }),
}));

// Mock react-tooltip
vi.mock("react-tooltip", () => ({
  Tooltip: ({ children, ...props }) => (
    <div data-testid="tooltip" {...props}>
      {children}
    </div>
  ),
}));

import useUser from "@/hooks/useUser";
import { useThinkingToggle } from "@/ThinkingToggleContext";

describe("ThinkingToggleButton", () => {
  const mockToggleThinking = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for useThinkingToggle
    useThinkingToggle.mockReturnValue({
      showThinking: false,
      toggleThinking: mockToggleThinking,
      isLoading: false,
    });
  });

  describe("Admin Role Checking", () => {
    it("should render button when user is admin", () => {
      useUser.mockReturnValue({
        user: { role: "admin", username: "admin-user" },
      });

      render(<ThinkingToggleButton />);

      const button = screen.getByRole("switch");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label", "顯示 AI 思考過程");
    });

    it("should not render button when user is not admin", () => {
      useUser.mockReturnValue({
        user: { role: "default", username: "regular-user" },
      });

      render(<ThinkingToggleButton />);

      const button = screen.queryByRole("switch");
      expect(button).not.toBeInTheDocument();
    });

    it("should not render button when user is manager", () => {
      useUser.mockReturnValue({
        user: { role: "manager", username: "manager-user" },
      });

      render(<ThinkingToggleButton />);

      const button = screen.queryByRole("switch");
      expect(button).not.toBeInTheDocument();
    });

    it("should not render button when user is null", () => {
      useUser.mockReturnValue({
        user: null,
      });

      render(<ThinkingToggleButton />);

      const button = screen.queryByRole("switch");
      expect(button).not.toBeInTheDocument();
    });

    it("should not render button when user is undefined", () => {
      useUser.mockReturnValue({
        user: undefined,
      });

      render(<ThinkingToggleButton />);

      const button = screen.queryByRole("switch");
      expect(button).not.toBeInTheDocument();
    });
  });

  describe("Button States for Admin Users", () => {
    beforeEach(() => {
      useUser.mockReturnValue({
        user: { role: "admin", username: "admin-user" },
      });
    });

    it("should show eye icon when thinking is hidden", () => {
      useThinkingToggle.mockReturnValue({
        showThinking: false,
        toggleThinking: mockToggleThinking,
        isLoading: false,
      });

      render(<ThinkingToggleButton />);

      const button = screen.getByRole("switch");
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(button).toHaveAttribute("aria-label", "顯示 AI 思考過程");
    });

    it("should show eye-slash icon when thinking is visible", () => {
      useThinkingToggle.mockReturnValue({
        showThinking: true,
        toggleThinking: mockToggleThinking,
        isLoading: false,
      });

      render(<ThinkingToggleButton />);

      const button = screen.getByRole("switch");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveAttribute("aria-label", "隱藏 AI 思考過程");
    });

    it("should show loading state when isLoading is true", () => {
      useThinkingToggle.mockReturnValue({
        showThinking: false,
        toggleThinking: mockToggleThinking,
        isLoading: true,
      });

      render(<ThinkingToggleButton />);

      const loadingSpinner = screen.getByRole("generic");
      expect(loadingSpinner).toHaveClass("animate-spin");

      const button = screen.queryByRole("switch");
      expect(button).not.toBeInTheDocument();
    });
  });

  describe("Accessibility Features", () => {
    beforeEach(() => {
      useUser.mockReturnValue({
        user: { role: "admin", username: "admin-user" },
      });
    });

    it("should have proper ARIA attributes", () => {
      render(<ThinkingToggleButton />);

      const button = screen.getByRole("switch");
      expect(button).toHaveAttribute("aria-label");
      expect(button).toHaveAttribute("aria-pressed");
      expect(button).toHaveAttribute("tabIndex", "0");
    });

    it("should have screen reader text", () => {
      render(<ThinkingToggleButton />);

      const srText = screen.getByText("顯示 AI 思考過程");
      expect(srText).toHaveClass("sr-only");
    });

    it("should have tooltip attributes", () => {
      render(<ThinkingToggleButton />);

      const button = screen.getByRole("switch");
      expect(button).toHaveAttribute(
        "data-tooltip-id",
        "thinking-toggle-tooltip"
      );
      expect(button).toHaveAttribute("data-tooltip-content");
    });
  });
});
