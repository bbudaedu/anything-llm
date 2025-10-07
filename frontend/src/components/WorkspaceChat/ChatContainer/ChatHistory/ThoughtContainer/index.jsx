import { useState, forwardRef, useImperativeHandle } from "react";
import renderMarkdown from "@/utils/chat/markdown";
import { CaretDown } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import { isMobile } from "react-device-detect";
import ThinkingAnimation from "@/media/animations/thinking-animation.webm";
import ThinkingStatic from "@/media/animations/thinking-static.png";
import { useThinkingToggle } from "@/ThinkingToggleContext";
import ProgressIndicator, {
  SimpleProgressIndicator,
} from "@/components/ThinkingToggle/ProgressIndicator";
import { formatForSimpleDisplay } from "@/utils/thinkingContentFilter";

const THOUGHT_KEYWORDS = ["thought", "thinking", "think", "thought_chain"];
const CLOSING_TAGS = [...THOUGHT_KEYWORDS, "response", "answer"];
export const THOUGHT_REGEX_OPEN = new RegExp(
  THOUGHT_KEYWORDS.map((keyword) => `<${keyword}\\s*(?:[^>]*?)?\\s*>`).join("|")
);
export const THOUGHT_REGEX_CLOSE = new RegExp(
  CLOSING_TAGS.map((keyword) => `</${keyword}\\s*(?:[^>]*?)?>`).join("|")
);
export const THOUGHT_REGEX_COMPLETE = new RegExp(
  THOUGHT_KEYWORDS.map(
    (keyword) =>
      `<${keyword}\\s*(?:[^>]*?)?\\s*>[\\s\\S]*?<\\/${keyword}\\s*(?:[^>]*?)?>`
  ).join("|")
);
const THOUGHT_PREVIEW_LENGTH = isMobile ? 25 : 50;

/**
 * Checks if the content has readable content.
 * @param {string} content - The content to check.
 * @returns {boolean} - Whether the content has readable content.
 */
function contentIsNotEmpty(content = "") {
  return (
    content
      ?.trim()
      ?.replace(THOUGHT_REGEX_OPEN, "")
      ?.replace(THOUGHT_REGEX_CLOSE, "")
      ?.replace(/[\n\s]/g, "")?.length > 0
  );
}

/**
 * Component to render a thought chain with global thinking process control.
 * Supports both LLM thinking process and @agent mode thinking process unified control.
 * @param {string} content - The content of the thought chain.
 * @param {boolean} expanded - Whether the thought chain is expanded.
 * @param {string} mode - The mode of thinking ('llm' or 'agent'), defaults to 'llm'
 * @returns {JSX.Element}
 */
export const ThoughtChainComponent = forwardRef(
  ({ content: initialContent, expanded, mode = "llm" }, ref) => {
    const [content, setContent] = useState(initialContent);
    const [hasReadableContent, setHasReadableContent] = useState(
      contentIsNotEmpty(initialContent)
    );
    const [isExpanded, setIsExpanded] = useState(expanded);

    // 獲取全域思考過程顯示設定
    const { showThinking } = useThinkingToggle();

    useImperativeHandle(ref, () => ({
      updateContent: (newContent) => {
        setContent(newContent);
        setHasReadableContent(contentIsNotEmpty(newContent));
      },
    }));

    const isThinking =
      content.match(THOUGHT_REGEX_OPEN) && !content.match(THOUGHT_REGEX_CLOSE);
    const isComplete =
      content.match(THOUGHT_REGEX_COMPLETE) ||
      content.match(THOUGHT_REGEX_CLOSE);
    const tagStrippedContent = content
      .replace(THOUGHT_REGEX_OPEN, "")
      .replace(THOUGHT_REGEX_CLOSE, "");
    const autoExpand =
      isThinking && tagStrippedContent.length > THOUGHT_PREVIEW_LENGTH;
    const canExpand = tagStrippedContent.length > THOUGHT_PREVIEW_LENGTH;

    // 格式化簡潔模式顯示資料
    const simpleDisplayData = formatForSimpleDisplay(content);

    // 如果沒有內容或不可讀，不顯示任何內容
    if (!content || !content.length || !hasReadableContent) return null;

    // 全域思考過程控制邏輯
    // 當 showThinking 為 false 時，顯示簡潔的進度指示器
    if (!showThinking) {
      // 重要內容仍需顯示（錯誤、需要使用者輸入等）
      if (simpleDisplayData.requiresAttention) {
        // 顯示簡化版的完整內容，但保持緊湊
        return renderCompactThoughtDisplay({
          content,
          tagStrippedContent,
          isThinking,
          isComplete,
          simpleDisplayData,
          mode,
        });
      } else {
        // 顯示簡潔的進度指示器
        return renderProgressIndicatorDisplay({
          simpleDisplayData,
          isThinking,
          mode,
        });
      }
    }

    // 處理展開/收起點擊
    function handleExpandClick() {
      if (!canExpand) return;
      setIsExpanded(!isExpanded);
    }

    // 顯示完整的詳細思考過程（當 showThinking 為 true 時）
    return renderFullThoughtDisplay({
      content,
      tagStrippedContent,
      isThinking,
      isComplete,
      isExpanded,
      autoExpand,
      canExpand,
      handleExpandClick,
      mode,
    });
  }
);
ThoughtChainComponent.displayName = "ThoughtChainComponent";

/**
 * 渲染進度指示器顯示模式（簡潔模式）
 */
function renderProgressIndicatorDisplay({
  simpleDisplayData,
  isThinking,
  mode,
}) {
  return (
    <div className="flex justify-start items-end transition-all duration-200 w-full md:max-w-[800px]">
      <div className="pb-2 w-full flex gap-x-5 flex-col relative">
        <ProgressIndicator
          status={simpleDisplayData.status}
          currentStep={
            simpleDisplayData.currentStep ||
            (isThinking ? "思考中..." : "處理完成")
          }
          progress={simpleDisplayData.progress}
          showProgress={simpleDisplayData.status === "thinking"}
          className="max-w-md"
        />
      </div>
    </div>
  );
}

/**
 * 渲染緊湊的思考顯示模式（用於需要使用者注意的內容）
 */
function renderCompactThoughtDisplay({
  content,
  tagStrippedContent,
  isThinking,
  isComplete,
  simpleDisplayData,
  mode,
}) {
  return (
    <div className="flex justify-start items-end transition-all duration-200 w-full md:max-w-[800px]">
      <div className="pb-2 w-full flex gap-x-5 flex-col relative">
        <div
          style={{
            transition: "all 0.1s ease-in-out",
            borderRadius: "6px",
          }}
          className="items-start bg-theme-bg-chat-input py-2 px-4 flex gap-x-2 border-l-4 border-yellow-500"
        >
          <div className="w-7 h-7 flex justify-center flex-shrink-0 items-center">
            {renderThinkingIcon(isThinking, isComplete, mode)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-theme-text-secondary font-mono leading-6">
              <div className="text-xs text-yellow-600 mb-1">需要注意</div>
              <span
                className="block w-full"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    simpleDisplayData.summary ||
                      tagStrippedContent.substring(0, 200)
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 渲染完整的思考顯示模式（詳細模式）
 */
function renderFullThoughtDisplay({
  content,
  tagStrippedContent,
  isThinking,
  isComplete,
  isExpanded,
  autoExpand,
  canExpand,
  handleExpandClick,
  mode,
}) {
  return (
    <div className="flex justify-start items-end transition-all duration-200 w-full md:max-w-[800px]">
      <div className="pb-2 w-full flex gap-x-5 flex-col relative">
        <div
          style={{
            transition: "all 0.1s ease-in-out",
            borderRadius: "6px",
          }}
          className={`${isExpanded || autoExpand ? "" : `${canExpand ? "hover:bg-theme-sidebar-item-hover" : ""}`} items-start bg-theme-bg-chat-input py-2 px-4 flex gap-x-2`}
        >
          <div
            className={`w-7 h-7 flex justify-center flex-shrink-0 ${!isExpanded && !autoExpand ? "items-center" : "items-start pt-[2px]"}`}
          >
            {renderThinkingIcon(isThinking, isComplete, mode)}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`overflow-hidden transition-all transform duration-300 ease-in-out origin-top ${isExpanded || autoExpand ? "" : "max-h-6"}`}
            >
              <div
                className={`text-theme-text-secondary font-mono leading-6 ${isExpanded || autoExpand ? "-ml-[5.5px] -mt-[4px]" : "mt-[2px]"}`}
              >
                <span
                  className={`block w-full ${!isExpanded && !autoExpand ? "truncate" : ""}`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      isExpanded || autoExpand
                        ? renderMarkdown(tagStrippedContent)
                        : tagStrippedContent
                    ),
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            {!autoExpand && canExpand ? (
              <button
                onClick={handleExpandClick}
                data-tooltip-id="expand-cot"
                data-tooltip-content={
                  isExpanded ? "Hide thought chain" : "Show thought chain"
                }
                className="border-none text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-sidebar-item-hover"
                aria-label={
                  isExpanded ? "Hide thought chain" : "Show thought chain"
                }
              >
                <CaretDown
                  className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 渲染思考圖示（支援 LLM 和 Agent 模式）
 */
function renderThinkingIcon(isThinking, isComplete, mode) {
  if (isThinking || isComplete) {
    return (
      <>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-7 h-7 transition-opacity duration-200 light:invert light:opacity-50 ${isThinking ? "opacity-100" : "opacity-0 hidden"}`}
          data-tooltip-id="cot-thinking"
          data-tooltip-content={
            mode === "agent" ? "Agent is thinking..." : "Model is thinking..."
          }
          aria-label={
            mode === "agent" ? "Agent is thinking..." : "Model is thinking..."
          }
        >
          <source src={ThinkingAnimation} type="video/webm" />
        </video>
        <img
          src={ThinkingStatic}
          alt="Thinking complete"
          className={`w-6 h-6 transition-opacity duration-200 light:invert light:opacity-50 ${!isThinking && isComplete ? "opacity-100" : "opacity-0 hidden"}`}
          data-tooltip-id="cot-thinking"
          data-tooltip-content={
            mode === "agent"
              ? "Agent has finished thinking"
              : "Model has finished thinking"
          }
          aria-label={
            mode === "agent"
              ? "Agent has finished thinking"
              : "Model has finished thinking"
          }
        />
      </>
    );
  }
  return null;
}
