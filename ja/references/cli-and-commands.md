# 🛠 CLI コマンド ＆ Agent スキル一覧 (References)

本文書は、CoSquad が提供するコマンドラインツール（CLI Commands）、Model Context Protocol ツール（MCP Tools）、および AI エージェントスキル（Skills）の全容を整理したリファレンスです。

---

## CoSquad CLI のインストール

**必須動作環境：** Node.js **≥ 24**。

**推奨インストール方法 — pnpm によるグローバルインストール**（Linux, macOS, WSL, Windows PowerShell 共通）：

```bash
pnpm add -g @shanyucoder/cosquad@latest
```

| 代替インストール手段 | 実行コマンド |
| :--- | :--- |
| **GitHub からの直接グローバルインストール** | `pnpm add -g github:ShanYuCoder/CoSquad --allow-build=@shanyucoder/cosquad` |
| **npx によるオンデマンド実行** | `npx -y -p @shanyucoder/cosquad@latest coSquad <command>` |
| **npm によるグローバルインストール** | `npm install -g @shanyucoder/cosquad@latest` |
| **Bash ワンライナー実行** | `curl -fsSL https://raw.githubusercontent.com/ShanYuCoder/CoSquad/main/install.sh \| bash` |

- **CLI のアップデート：** `coSquad update`
- **最新版の確認：** `coSquad update --check`
- **アンインストール：** `coSquad uninstall`

---

## ⚙️ コア処理エンジンコマンド (CoSquad CLI)

CoSquad は、開発プロセスを**ドキュメントエンジン (Docs Engine)**、**コードエンジン (Code Engine)**、**テストエンジン (Test Engine)** の 3 つの基盤で支えます：

### 1. ドキュメントエンジン (Docs Engine — 仕様およびドキュメント管理)

| CoSquad コマンド | 機能概要 |
| :--- | :--- |
| `coSquad split` | `.bundle.yaml` を `ir/design.yaml`, `ir/spec.yaml`, `ir/generated/spec.md` に分割。 |
| `coSquad split_all` | ワークスペース内のすべての Bundle YAML ファイルを再帰的に走査して分割。 |
| `coSquad render` | YAML 形式の UI 仕様から Markdown（データ辞書と状態マトリクス）を再レンダリング。 |
| `coSquad dev` | ローカルの VitePress ドキュメントハブ（ポート **5173**）を起動。統合 SSOT アーキテクチャ（overview, architecture, surfaces, cases, scenarios）全体を提供。 |
| `coSquad build` | 静的ドキュメントサイトをビルド。 |
| `coSquad publish` | ドキュメント成果物を公開し、`CATALOG.md` を更新。 |
| `coSquad openapi_gen` | `01-backend-spec.yaml` から OpenAPI の定義スニペットを自動生成・更新。 |
| `coSquad openapi_render` | 各 OpenAPI YAML スニペットを統合し `docs/api-spec/api.yaml` を生成。 |
| `coSquad openapi_build_ui`| ドキュメントハブ用の静的 Swagger UI 画面をビルド。 |
| `coSquad api:check` | バックエンドコード生成前に `01-backend-spec.yaml` の妥当性を検証。 |

### 2. 監査 ＆ ガバナンスコマンド (PR 監査および品質ゲート)

| コマンド | 概要 |
| :--- | :--- |
| `coSquad audit` | 監査コマンドのヘルプを表示。 |
| `coSquad audit spec …` | UI 仕様バンドルおよび UX アフォーダンスの欠落を監査。 |
| `coSquad audit api …` | `01-backend-spec.yaml` の API 契約仕様を監査。 |
| `coSquad audit flow …` | `FLOW-*.md` 業務フローの各章と画面参照の整合性を監査。 |
| `coSquad audit testcase …` | `TC-*.yaml` テストケースと画面仕様バンドルを突合監査。 |
| `coSquad audit fe-be …` | フロントエンドの `apiRef` とバックエンド契約の整合性を検証。 |
| `coSquad audit scenario …`| テストシナリオの画面網羅率を監査。 |
| `coSquad audit e2e …` | Playwright 自動テストとテスト計画の網羅性を監査。 |
| `coSquad harness sync` | `.coSquad/config.json` からスキル、ルール、MCP 設定を IDE に自動同期。 |
| `coSquad doctor` | ワークスペース設定、MCP 環境変数、ツールチェーンの健全性を自己診断。 |
| `coSquad doctor --fix` | 不足している設定ファイルを自動補完し、同期を再実行。 |

### 3. テストエンジン (Test Engine — テスト ＆ 品質保証)

| CoSquad コマンド | 機能概要 |
| :--- | :--- |
| `coSquad cases:render` | テストハブ上で Testplan YAML マトリクスを Markdown にレンダリング。 |
| `coSquad cases:check` | テスト計画 YAML の構文と JSON Schema 準拠を検証。 |
| `coSquad cases:gate` | CI/CD 品質リリースゲート（Schema v2 + TC 監査 + 追跡性検査）。 |
| `coSquad cases:coverage` | テスト網羅率を計算し、テストが未作成の仕様を即座に検出。 |
| `coSquad testcase:gen` | TC YAML から Playwright E2E UI 自動テストコードを生成。 |
| `coSquad testcase:gen:api`| TC YAML から Playwright API 自動テストコードを生成。 |

### 4. コードエンジン (Code Engine — コードおよび単体テスト生成)

| CoSquad コマンド | 機能概要 |
| :--- | :--- |
| `coSquad gen` | `ir/design.yaml` からフロントエンド UI コンポーネントを自動生成。 |
| `coSquad unit-gen` | フロントエンド単体テスト（Jest / Vitest）コードを自動生成。 |
| `coSquad api-gen` | `ir/spec.yaml` からバックエンド API ルート、コントローラー、サービスを生成。 |
| `coSquad api-unit-gen` | バックエンド単体テスト（Pytest, PHPUnit, xUnit）コードを自動生成。 |
| `coSquad contract-gen` | 共通 TypeScript 型定義および DTO 契約コードを生成。 |
| `coSquad build-template-code --sample=<dir>` | 既存のゴールデンサンプルモジュールの AST とコーディングスタイルを学習。 |
| `coSquad build-template-code --yes` | 学習済みテンプレートを `.coSquad/adapters/` 配下に書き出し。 |

#### スタックとアダプターの互換性マトリクス (Stacks & Adapters)

| 分類 | ビルトインアダプター (OOTB) | カスタムスタック (Custom via Golden Sample) |
| --- | --- | --- |
| **フロントエンド (Frontend)** | `nuxt4` (Nuxt 4), `nextjs` (Next.js), `dotnet-line` (DotNet Line クライアント) | `coSquad build-template-code --sample=<dir>` または `/adopt` スキルを活用して既存コードの設計 DNA を抽出し、Vue 3、React、Angular、Svelte などのテンプレートを自動生成可能。 |
| **バックエンド (Backend)** | `nestjs` (NestJS), `fastapi` (FastAPI), `laravel` (Laravel), `dotnet-integration` (DotNet) | 任意のクリーンなモジュール（Golden Sample）を指定するだけで、CoSquad が設計パターンを学習しテンプレート（`.hbs`、`.stub`、`.j2`、`.scriban`）を自動生成。 |

