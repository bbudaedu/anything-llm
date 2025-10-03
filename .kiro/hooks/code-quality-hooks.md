# AnythingLLM 代碼質量自動化 Hooks

這個文件定義了用於 AnythingLLM 項目的代碼質量自動化 agent hooks。這些 hooks 利用 Kiro IDE 的現有功能，無需額外開發。

## Hook 1: JavaScript/React 代碼質量檢查

**觸發條件**: 當保存 JavaScript/JSX/TypeScript 文件時
**文件模式**: `**/*.{js,jsx,ts,tsx}`
**排除模式**: `**/node_modules/**`, `**/dist/**`, `**/build/**`

### Hook 配置

```yaml
name: "JavaScript 代碼質量檢查"
description: "自動運行 ESLint 和 Prettier 來確保代碼質量"
trigger: "file_save"
file_patterns: 
  - "**/*.js"
  - "**/*.jsx" 
  - "**/*.ts"
  - "**/*.tsx"
exclude_patterns:
  - "**/node_modules/**"
  - "**/dist/**"
  - "**/build/**"
  - "**/.next/**"
```

### Agent 指令

```
你是一個代碼質量檢查助手。當用戶保存 JavaScript/JSX/TypeScript 文件時，請執行以下操作：

1. **運行 ESLint 檢查**:
   - 使用項目的 ESLint 配置檢查代碼
   - 如果發現錯誤，列出所有問題並提供修復建議
   - 如果可能，自動修復格式問題

2. **運行 Prettier 格式化**:
   - 使用項目的 Prettier 配置格式化代碼
   - 確保代碼風格一致

3. **檢查 AnythingLLM 特定規則**:
   - 確保使用 yarn 而不是 npm
   - 檢查是否有硬編碼的文本（應該使用 i18n）
   - 驗證組件是否遵循項目的命名約定

4. **提供反饋**:
   - 如果一切正常，顯示簡短的成功消息
   - 如果有問題，提供清晰的錯誤說明和修復建議
   - 如果有警告，解釋為什麼需要注意

請使用中文回應，保持簡潔但信息豐富。
```

## Hook 2: React 組件測試自動化

**觸發條件**: 當創建或修改 React 組件時
**文件模式**: `**/src/components/**/*.{js,jsx}`

### Hook 配置

```yaml
name: "React 組件測試自動化"
description: "當組件被修改時自動運行相關測試"
trigger: "file_save"
file_patterns:
  - "**/src/components/**/*.js"
  - "**/src/components/**/*.jsx"
  - "**/frontend/src/components/**/*.js"
  - "**/frontend/src/components/**/*.jsx"
exclude_patterns:
  - "**/__tests__/**"
  - "**/*.test.js"
  - "**/*.test.jsx"
```

### Agent 指令

```
你是一個測試自動化助手。當用戶修改 React 組件時，請執行以下操作：

1. **識別相關測試**:
   - 查找與修改的組件相關的測試文件
   - 檢查是否存在對應的 .test.js 或 .test.jsx 文件

2. **運行測試**:
   - 如果存在相關測試，運行這些測試
   - 使用 `yarn test --run` 命令運行測試（不使用 watch 模式）
   - 如果沒有測試文件，建議創建基本測試

3. **分析測試結果**:
   - 如果測試通過，提供簡短確認
   - 如果測試失敗，分析失敗原因並提供修復建議
   - 檢查測試覆蓋率是否足夠

4. **AnythingLLM 特定檢查**:
   - 確保組件支持國際化（使用 useTranslation hook）
   - 檢查組件是否遵循項目的設計模式
   - 驗證 PropTypes 或 TypeScript 類型定義

5. **提供建議**:
   - 如果組件缺少測試，提供測試模板
   - 建議改進代碼質量的方法
   - 提醒遵循 AnythingLLM 的最佳實踐

請使用中文回應，專注於實用的建議。
```

## Hook 3: 國際化合規性檢查

**觸發條件**: 當修改包含用戶界面文本的文件時
**文件模式**: `**/src/components/**/*.{js,jsx}`, `**/src/pages/**/*.{js,jsx}`

### Hook 配置

```yaml
name: "國際化合規性檢查"
description: "檢查硬編碼文本並確保國際化合規性"
trigger: "file_save"
file_patterns:
  - "**/src/components/**/*.js"
  - "**/src/components/**/*.jsx"
  - "**/src/pages/**/*.js"
  - "**/src/pages/**/*.jsx"
  - "**/frontend/src/**/*.js"
  - "**/frontend/src/**/*.jsx"
exclude_patterns:
  - "**/locales/**"
  - "**/__tests__/**"
```

### Agent 指令

```
你是一個國際化合規性檢查助手。當用戶修改包含 UI 文本的文件時，請執行以下操作：

1. **掃描硬編碼文本**:
   - 查找 JSX 中的硬編碼字符串
   - 識別可能需要翻譯的文本
   - 檢查是否使用了 useTranslation hook

2. **驗證 i18n 使用**:
   - 確保組件導入了 `useTranslation` from 'react-i18next'
   - 檢查翻譯鍵是否存在於語言文件中
   - 驗證翻譯鍵的命名是否遵循項目約定

3. **檢查語言文件**:
   - 確認中文和英文翻譯都存在
   - 檢查翻譯內容是否完整和準確
   - 驗證翻譯鍵的結構是否一致

4. **AnythingLLM i18n 規則**:
   - 所有用戶可見的文本都必須使用 t() 函數
   - 翻譯鍵應該使用點分隔的層次結構
   - 支持英文和中文兩種語言

5. **提供修復建議**:
   - 如果發現硬編碼文本，提供 i18n 替換方案
   - 建議合適的翻譯鍵名稱
   - 提供缺失的翻譯內容

請使用中文回應，重點關注實際的 i18n 問題和解決方案。
```

## Hook 4: 提交前質量檢查

**觸發條件**: 手動觸發或 Git 提交前
**適用範圍**: 整個項目

### Hook 配置

```yaml
name: "提交前質量檢查"
description: "在 Git 提交前進行全面的代碼質量檢查"
trigger: "manual"
scope: "project"
```

### Agent 指令

```
你是一個提交前質量檢查助手。當用戶準備提交代碼時，請執行以下全面檢查：

1. **代碼質量檢查**:
   - 運行 `yarn lint` 檢查所有代碼風格問題
   - 確保沒有 ESLint 錯誤或警告
   - 驗證 Prettier 格式化是否正確

2. **測試驗證**:
   - 運行完整的測試套件 `yarn test --run`
   - 檢查測試覆蓋率是否達到標準
   - 確保所有測試都通過

3. **構建驗證**:
   - 嘗試構建前端 `cd frontend && yarn build`
   - 檢查是否有構建錯誤或警告
   - 驗證構建產物的完整性

4. **AnythingLLM 特定檢查**:
   - 確保使用 yarn 而不是 npm
   - 檢查國際化合規性
   - 驗證 API 端點的一致性
   - 檢查環境變量配置

5. **Git 檢查**:
   - 檢查提交消息是否遵循約定
   - 確保沒有敏感信息被提交
   - 驗證文件權限設置

6. **生成報告**:
   - 提供詳細的檢查結果摘要
   - 列出需要修復的問題
   - 給出改進建議

如果發現任何問題，請阻止提交並提供清晰的修復指導。請使用中文回應。
```

## Hook 5: 依賴更新檢查

**觸發條件**: 當 package.json 被修改時
**文件模式**: `**/package.json`

### Hook 配置

```yaml
name: "依賴更新檢查"
description: "檢查依賴更新和安全性"
trigger: "file_save"
file_patterns:
  - "**/package.json"
```

### Agent 指令

```
你是一個依賴管理助手。當用戶修改 package.json 時，請執行以下操作：

1. **依賴分析**:
   - 檢查新增或修改的依賴
   - 驗證版本號是否合理
   - 確保使用 yarn 而不是 npm

2. **安全檢查**:
   - 運行 `yarn audit` 檢查安全漏洞
   - 識別過時或有風險的依賴
   - 建議安全的替代方案

3. **AnythingLLM 兼容性**:
   - 檢查新依賴是否與項目架構兼容
   - 驗證是否符合項目的技術棧要求
   - 確保不會與現有依賴衝突

4. **性能影響**:
   - 評估新依賴對 bundle 大小的影響
   - 檢查是否有更輕量的替代方案
   - 建議優化策略

5. **更新建議**:
   - 運行 `yarn install` 更新依賴
   - 檢查是否需要更新 lockfile
   - 提醒更新相關文檔

請使用中文回應，重點關注安全性和兼容性。
```

## 使用說明

### 在 Kiro IDE 中設置這些 Hooks

1. **打開 Agent Hooks 面板**:
   - 在 Kiro IDE 中使用命令面板搜索 "Open Kiro Hook UI"
   - 或者在資源管理器中找到 "Agent Hooks" 部分

2. **創建新 Hook**:
   - 點擊 "+" 按鈕創建新的 hook
   - 複製上面對應的配置和指令
   - 根據需要調整文件模式和觸發條件

3. **測試 Hook**:
   - 保存配置後，修改相應的文件來測試 hook
   - 檢查 agent 是否按預期執行操作
   - 根據需要調整指令內容

4. **管理 Hooks**:
   - 可以啟用/禁用特定的 hooks
   - 根據項目需要調整優先級
   - 定期檢查和更新 hook 指令

### 最佳實踐

1. **逐步啟用**: 先啟用一個 hook，測試穩定後再啟用其他
2. **自定義調整**: 根據團隊的具體需求調整指令內容
3. **性能監控**: 注意 hooks 對開發體驗的影響，避免過於頻繁的執行
4. **團隊同步**: 確保團隊成員使用相同的 hook 配置

這種方法利用了 Kiro IDE 現有的 agent hooks 基礎設施，無需額外開發，既節省資源又能實現開發自動化的目標。