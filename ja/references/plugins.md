# 🔌 マルチ Agent プラグイン ＆ IDE ネイティブ連携ガイド

CoSquad は、**ワークスペース構成の同期**（`coSquad init` / `harness sync` 経由）だけでなく、現代の AI コーディングエコシステムにおける**ネイティブなマルチ Agent プラグイン規格**をサポートしています。

標準化されたプラグイン仕様に準拠することで、各リポジトリにスキルフォルダを手動で複製することなく、お好みの AI 開発環境に CoSquad を直接インストールして使用できます。

---

## 1. サポート対象 AI Agent ＆ IDE 一覧

| Agent / IDE | プラグイン定義 / 設定ファイル | インストール・実行コマンド |
| :--- | :--- | :--- |
| **Google Antigravity IDE** | `.antigravity-plugin/plugin.json` | `agy plugin install https://github.com/ShanYuCoder/CoSquad` |
| **Claude Code** | `.claude-plugin/plugin.json`<br>`.claude-plugin/marketplace.json` | `/plugin marketplace add ShanYuCoder/CoSquad`<br>`/plugin install coSquad@coSquad-marketplace` |
| **Cursor** | `.cursor-plugin/plugin.json`<br>`hooks/hooks-cursor.json` | `/add-plugin coSquad` またはワークスペース内で自動検出 |
| **Gemini CLI** | `gemini-extension.json`<br>`AGENTS.md` | `gemini extensions install https://github.com/ShanYuCoder/CoSquad` |
| **OpenAI Codex** | `.codex-plugin/plugin.json` | `/plugins install coSquad` |
| **Devin CLI** | `.devin-plugin/plugin.json` | `devin plugins install ShanYuCoder/CoSquad` |
| **標準 Agents** | `.agents/plugins/marketplace.json` | `.agents/plugins/` 配下で自動検出 |

---

## 2. プラットフォーム別インストール手順

### Google Antigravity IDE
公式リポジトリからプラグインを直接インストール：
```bash
agy plugin install https://github.com/ShanYuCoder/CoSquad
```
Antigravity はすべてのスキル（`/help-plan`, `/spec`, `/update-spec`, `/grill`, `/trace` 等）を自動認識します。

### Claude Code
CoSquad マーケットプレイスを追加してインストール：
```bash
/plugin marketplace add ShanYuCoder/CoSquad
/plugin install coSquad@coSquad-marketplace
```
Claude Code 起動時に `SessionStart` ライフサイクルフックが自動実行され、CoSquad の主要ルールが読み込まれます。

### Cursor
Cursor Agent のチャットで実行：
```text
/add-plugin coSquad
```
または `.cursor-plugin/plugin.json` を含むプロジェクトを開くだけで、自動的にプラグインが適用されます。

### Gemini CLI
Gemini 拡張としてインストール：
```bash
gemini extensions install https://github.com/ShanYuCoder/CoSquad
```

### Devin CLI
Devin 環境へインストール：
```bash
devin plugins install ShanYuCoder/CoSquad
```

---

## 3. ライフサイクルフック (Lifecycle Hooks)

CoSquad は、クロスプラットフォーム対応のフックランナーを提供しています：
- **Unix (Linux, macOS, WSL):** `hooks/session-start`
- **Windows (Git Bash, コマンドプロンプト, PowerShell):** `hooks/run-hook.cmd`

エージェントの起動時やツール実行時に、CoSquad のバージョン、SSOT パス、必須遵守事項が自動的にプロンプトコンテキストへ注入されます。
