/**
 * 思考內容過濾工具
 * 用於從完整的思考過程中提取關鍵資訊，供簡潔模式使用
 */

// 關鍵詞模式，用於識別重要步驟
const IMPORTANT_KEYWORDS = [
  // 動作關鍵詞
  "searching",
  "found",
  "analyzing",
  "processing",
  "generating",
  "creating",
  "reading",
  "writing",
  "calculating",
  "executing",
  "completing",
  // 狀態關鍵詞
  "error",
  "failed",
  "success",
  "completed",
  "finished",
  "done",
  // 中文關鍵詞
  "搜尋",
  "找到",
  "分析",
  "處理",
  "生成",
  "創建",
  "讀取",
  "寫入",
  "計算",
  "執行",
  "完成",
  "錯誤",
  "失敗",
  "成功",
  "已完成",
  "結束",
  "完畢",
];

// 錯誤模式
const ERROR_PATTERNS = [
  /error/i,
  /failed/i,
  /exception/i,
  /錯誤/,
  /失敗/,
  /異常/,
];

// 進度模式
const PROGRESS_PATTERNS = [
  /step \d+/i,
  /\d+\/\d+/,
  /\d+%/,
  /第\s*\d+\s*步/,
  /步驟\s*\d+/,
];

/**
 * 從思考內容中提取當前步驟
 * @param {string} content - 完整的思考內容
 * @returns {string} 當前步驟描述
 */
export function extractCurrentStep(content = "") {
  if (!content || typeof content !== "string") {
    return "";
  }

  // 移除 HTML 標籤
  const cleanContent = content.replace(/<[^>]*>/g, "");

  // 分割成行
  const lines = cleanContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return "";
  }

  // 尋找最後一行包含重要關鍵詞的內容
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];

    // 檢查是否包含重要關鍵詞
    const hasImportantKeyword = IMPORTANT_KEYWORDS.some((keyword) =>
      line.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasImportantKeyword && line.length > 5 && line.length < 200) {
      return line;
    }
  }

  // 如果沒有找到重要關鍵詞，返回最後一行（如果合理長度）
  const lastLine = lines[lines.length - 1];
  if (lastLine && lastLine.length > 5 && lastLine.length < 200) {
    return lastLine;
  }

  // 返回第一行作為備選
  const firstLine = lines[0];
  if (firstLine && firstLine.length > 5 && firstLine.length < 200) {
    return firstLine;
  }

  return "";
}

/**
 * 檢測思考內容的狀態
 * @param {string} content - 思考內容
 * @returns {string} 狀態 ('thinking', 'complete', 'error', 'idle')
 */
export function detectThinkingStatus(content = "") {
  if (!content || typeof content !== "string") {
    return "idle";
  }

  const cleanContent = content.replace(/<[^>]*>/g, "").toLowerCase();

  // 檢查錯誤狀態
  if (ERROR_PATTERNS.some((pattern) => pattern.test(cleanContent))) {
    return "error";
  }

  // 檢查完成狀態
  const completeKeywords = [
    "completed",
    "finished",
    "done",
    "success",
    "完成",
    "結束",
    "成功",
  ];
  if (completeKeywords.some((keyword) => cleanContent.includes(keyword))) {
    return "complete";
  }

  // 檢查是否正在思考（包含開放標籤但沒有關閉標籤）
  const hasOpenTag = /<(thought|thinking|think)[\s\S]*?>/i.test(content);
  const hasCloseTag =
    /<\/(thought|thinking|think|response|answer)[\s\S]*?>/i.test(content);

  if (hasOpenTag && !hasCloseTag) {
    return "thinking";
  }

  // 如果有內容但不符合其他狀態，認為是完成狀態
  if (cleanContent.trim().length > 0) {
    return "complete";
  }

  return "idle";
}

/**
 * 計算思考進度（基於內容長度和關鍵詞）
 * @param {string} content - 思考內容
 * @returns {number} 進度百分比 (0-100)
 */
export function calculateThinkingProgress(content = "") {
  if (!content || typeof content !== "string") {
    return 0;
  }

  const cleanContent = content.replace(/<[^>]*>/g, "");
  const contentLength = cleanContent.length;

  // 基於內容長度的基礎進度
  let baseProgress = Math.min(90, (contentLength / 1000) * 100);

  // 檢查進度指示器
  const progressMatch =
    cleanContent.match(/(\d+)%/) ||
    cleanContent.match(/(\d+)\/(\d+)/) ||
    cleanContent.match(/step\s+(\d+)/i);

  if (progressMatch) {
    if (progressMatch[0].includes("%")) {
      return parseInt(progressMatch[1]);
    } else if (progressMatch[0].includes("/")) {
      const current = parseInt(progressMatch[1]);
      const total = parseInt(progressMatch[2]);
      return Math.round((current / total) * 100);
    }
  }

  // 檢查完成狀態
  const status = detectThinkingStatus(content);
  if (status === "complete") {
    return 100;
  } else if (status === "error") {
    return 0;
  }

  return Math.round(baseProgress);
}

/**
 * 提取思考內容的摘要
 * @param {string} content - 完整思考內容
 * @param {number} maxLength - 最大長度
 * @returns {string} 摘要內容
 */
export function extractThinkingSummary(content = "", maxLength = 100) {
  if (!content || typeof content !== "string") {
    return "";
  }

  // 移除 HTML 標籤
  const cleanContent = content.replace(/<[^>]*>/g, "");

  // 分割成句子
  const sentences = cleanContent
    .split(/[.!?。！？]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return "";
  }

  // 尋找包含重要關鍵詞的句子
  const importantSentences = sentences.filter((sentence) =>
    IMPORTANT_KEYWORDS.some((keyword) =>
      sentence.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  // 選擇要顯示的句子
  const selectedSentences =
    importantSentences.length > 0 ? importantSentences : sentences;

  let summary = "";
  for (const sentence of selectedSentences) {
    if (summary.length + sentence.length + 1 <= maxLength) {
      summary += (summary ? " " : "") + sentence;
    } else {
      break;
    }
  }

  // 如果摘要太短，嘗試添加更多內容
  if (summary.length < maxLength / 2 && sentences.length > 0) {
    for (const sentence of sentences) {
      if (
        !summary.includes(sentence) &&
        summary.length + sentence.length + 1 <= maxLength
      ) {
        summary += (summary ? " " : "") + sentence;
      }
    }
  }

  return (
    summary ||
    (cleanContent.length > maxLength
      ? cleanContent.substring(0, maxLength - 3) + "..."
      : cleanContent)
  );
}

/**
 * 檢查內容是否包含需要使用者注意的資訊
 * @param {string} content - 思考內容
 * @returns {boolean} 是否需要使用者注意
 */
export function requiresUserAttention(content = "") {
  if (!content || typeof content !== "string") {
    return false;
  }

  const cleanContent = content.toLowerCase();

  // 錯誤或失敗
  if (ERROR_PATTERNS.some((pattern) => pattern.test(cleanContent))) {
    return true;
  }

  // 需要使用者輸入的關鍵詞
  const userInputKeywords = [
    "input required",
    "please provide",
    "need more information",
    "clarification needed",
    "user confirmation",
    "需要輸入",
    "請提供",
    "需要更多資訊",
    "需要確認",
    "使用者確認",
  ];

  return userInputKeywords.some((keyword) => cleanContent.includes(keyword));
}

/**
 * 格式化思考內容用於簡潔顯示
 * @param {string} content - 原始思考內容
 * @returns {Object} 格式化後的顯示資料
 */
export function formatForSimpleDisplay(content = "") {
  return {
    currentStep: extractCurrentStep(content),
    status: detectThinkingStatus(content),
    progress: calculateThinkingProgress(content),
    summary: extractThinkingSummary(content),
    requiresAttention: requiresUserAttention(content),
    hasContent: Boolean(content && content.trim().length > 0),
  };
}
