# 通用 Agent Hooks 系統

這個目錄包含了一套完整的通用 agent hooks 配置，專門設計用於 Kiro IDE 的現有 agent hooks 功能。這些 hooks 具有高度的通用性，可以適用於各種不同類型的項目。

## 🎯 設計理念

- **通用性優先**: 適用於各種編程語言和項目類型
- **智能檢測**: 自動識別項目類型並提供相應的功能
- **資源節約**: 利用 Kiro IDE 現有基礎設施，無需額外開發
- **漸進增強**: 基本功能適用於所有項目，高級功能根據項目配置啟用

## 📁 文件結構

```
.kiro/hooks/
├── README.md                              # 本文件
├── universal-code-quality-hooks.md        # 通用代碼質量檢查
├── universal-project-automation-hooks.md  # 通用項目自動化
├── code-quality-hooks.md                  # AnythingLLM 特定代碼質量
├── testing-automation-hooks.md            # AnythingLLM 特定測試自動化
└── config.example.json                    # 示例配置文件
```

## 🚀 快速開始

### 1. 在 Kiro IDE 中設置 Hooks

1. **打開 Agent Hooks 管理界面**:
   - 使用命令面板搜索 "Open Kiro Hook UI"
   - 或在資源管理器中找到 "Agent Hooks" 部分

2. **創建通用 Hooks**:
   - 從 `universal-code-quality-hooks.md` 開始
   - 複製相應的配置和 Agent 指令
   - 根據個人偏好調整觸發條件

3. **測試和調優**:
   - 在不同類型的項目中測試 hooks
   - 根據實際使用情況調整指令
   - 監控性能影響並優化

### 2. 推薦的啟用順序

1. **智能代碼質量檢查** - 基礎的代碼質量保證
2. **通用測試自動化** - 自動化測試執行
3. **通用依賴安全檢查** - 依賴安全管理
4. **通用代碼格式化** - 代碼風格統一
5. **通用提交前檢查** - 提交質量保證

## 🔧 Hook 類型說明

### 通用代碼質量 Hooks

**適用項目**: 所有類型的軟件項目
**主要功能**:
- 自動檢測項目類型 (JavaScript, Python, Java, Go, Rust 等)
- 運行相應的代碼檢查工具 (ESLint, pylint, golint 等)
- 提供通用的代碼質量建議
- 支持多種框架和工具鏈

**支持的項目類型**:
- 前端: React, Vue, Angular, Svelte
- 後端: Node.js, Python, Java, Go, Rust, PHP, Ruby
- 移動端: React Native, Flutter
- 桌面應用: Electron, Tauri

### 通用項目自動化 Hooks

**適用項目**: 各種規模的軟件項目
**主要功能**:
- 智能項目初始化和配置建議
- 自動文檔生成和更新
- 部署準備檢查
- 性能監控和優化建議
- 團隊協作和溝通支持

## 🎨 自定義配置

### 項目特定配置

在項目根目錄創建 `.kiro-hooks-config.json`:

```json
{
  "project_type": "auto",
  "language_preference": "zh-CN",
  "hooks": {
    "code_quality": {
      "enabled": true,
      "tools": ["eslint", "prettier"],
      "auto_fix": false
    },
    "testing": {
      "enabled": true,
      "framework": "auto",
      "coverage_threshold": 80
    }
  }
}
```

### 個人偏好設置

```json
{
  "global_settings": {
    "output_format": "concise",
    "notification_level": "important_only",
    "auto_actions": false
  }
}
```

## 🌍 多語言支持

所有 hooks 都支持中英文雙語：
- **中文**: 默認使用中文進行交互和反饋
- **English**: 可通過配置切換到英文模式
- **混合模式**: 技術術語使用英文，說明使用中文

## 📊 性能考慮

### 優化策略
- **智能觸發**: 只在相關文件變更時觸發
- **增量檢查**: 優先檢查修改的文件
- **並行執行**: 支持多個 hooks 並行運行
- **緩存機制**: 利用檢查結果緩存

### 性能監控
- 監控 hook 執行時間
- 跟踪對開發效率的影響
- 提供性能優化建議

## 🔒 安全和隱私

- **本地執行**: 所有檢查都在本地執行
- **無數據上傳**: 不會向外部服務發送代碼
- **敏感信息保護**: 自動檢測和保護敏感信息
- **權限控制**: 遵循最小權限原則

## 🤝 團隊協作

### 配置共享
- 通過 Git 共享 hooks 配置
- 團隊標準化的代碼質量要求
- 一致的開發工作流程

### 最佳實踐
- 定期更新 hooks 配置
- 團隊內部分享優化經驗
- 根據項目發展調整 hooks

## 🆘 故障排除

### 常見問題

**Q: Hook 沒有觸發？**
A: 檢查文件模式匹配和排除規則，確保文件路徑符合配置

**Q: 檢查工具找不到？**
A: 確保相關工具已安裝，或者讓 hook 自動檢測可用工具

**Q: 性能影響太大？**
A: 調整觸發條件，增加防抖延遲，或禁用部分檢查

**Q: 誤報太多？**
A: 調整檢查嚴格程度，添加項目特定的忽略規則

### 調試模式

啟用詳細日誌來診斷問題：
```json
{
  "debug": true,
  "log_level": "verbose"
}
```

## 🔄 更新和維護

### 定期更新
- 關注 Kiro IDE 的功能更新
- 更新 hooks 以支持新的工具和框架
- 根據社區反饋改進 hooks

### 版本管理
- 使用語義化版本管理 hooks 配置
- 維護變更日誌
- 提供遷移指南

## 📚 擴展資源

- [Kiro IDE 官方文檔](https://kiro.ai/docs)
- [Agent Hooks 最佳實踐](https://kiro.ai/docs/hooks)
- [社區 Hooks 分享](https://github.com/kiro-ai/community-hooks)

## 🤖 AI 助手集成

這些 hooks 充分利用了 Kiro IDE 的 AI 能力：
- **智能代碼分析**: 理解代碼意圖和上下文
- **個性化建議**: 根據項目特點提供定制建議
- **學習能力**: 從用戶反饋中持續改進
- **多模態支持**: 支持代碼、文檔、配置等多種文件類型

---

通過使用這套通用 agent hooks 系統，您可以在不同項目間保持一致的開發體驗，同時享受 Kiro IDE 強大的 AI 輔助功能。這種方法既節省了開發資源，又提供了高度的靈活性和可擴展性。