# CoSquad 🚀

> **AI 駆動・決定論的 SDLC 自動化ツールキット (AI-Powered & Deterministic SDLC Automation Toolkit)**  
> 膨大でコストのかかる手動ドキュメント作成に頼ることなく、高速なソフトウェア開発において SDLC の規律と Single Source of Truth (SSOT) の整合性を維持します。

---

## 📦 クイックインストール (Quick Start)

Git Personal Access Token (PAT) を使用した自動リリーススクリプトにより、環境へツールを直接セットアップします：

```bash
export COSQUAD_GITHUB_TOKEN=github_pat_XXXXX
export COSQUAD_REF=latest

curl -fsSL \
  https://raw.githubusercontent.com/ShanYuCoder/Doc-CoSquad/main/scripts/install-from-release.sh \
  | bash -s -- "$COSQUAD_GITHUB_TOKEN"
```

---

## 🔄 標準化ワークフローパイプライン (Workflow Pipeline)

AI は人間のために — AI は人間に取って代わるものではありません：

- **AI は「***量***」に責任を持つ：**
  - AI Agent は、構造化情報が**十分な量と完全性**を満たしているかを担保します。
  - 情報の網羅性を自動監査し、不足があれば選択肢を能動的に提示します *(例：画面にタイトルやパンくずリストが存在するか？フォーム要素に型・バリデーション・エラー状態が定義されているか？... 不足時はユーザーに選択や追記を促す)*。
- **人間は「***質***」に責任を持つ：**
  - 人間は、AI へ提供する情報の**正確性と緻密さ**に全責任を負います。
  - AI が提案を提示した際の**選択と承認**に対して直接責任を持ちます。
  - プロダクトの品質が正確で緊密に連携しているかどうかは、人間が提供した情報と下した意思決定に完全に依存します。

```text
粗い要件（箇条書き / 画面キャプチャ / 既存コード）
  │
  ▼
AI による標準化 Bundle + IR 生成 + Markdown レンダリング
  │
  ▼
Anti-Copy-Paste Guard による重複排除と共通カタログ (CMN-*) への集約
  │
  ▼
インタラクティブプロトタイプ + BA / QA / Dev レビュー
  │
  ▼
自動コード生成：E2E Playwright / バックエンド / 結合連携 + セーフティネット
```

![ソースコードと並行する多層 Artifact 仕様体系](../assets/overview-artifact-layers.png)

---

## 🎯 目標：アジャイル T 型チームモデル (Agile T-Shaped Team)

```text
                                 COSQUAD 協調型開発プラットフォーム
                                     (アジャイル T 型チームモデル)
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
        非エンジニア向け (BA / QA / PO)                                   エンジニア向け (DEV / CODER)
   ─────────────────────────────────                              ──────────────────────────────
1. コード考古学と業務ロジック抽出：                                1. 強力なコード生成アシスタント：
   5 層のコードを深掘りし、行番号の根拠付きで                       スキャフォールディング、ボイラープレート、Mock API、
   クリーンに業務仕様を抽出。                                     IR 同期、Swagger の正確なフォーマットを自動化。

2. 仕様変更と新規開発 (CR/New Feature)：                         2. 対抗的業務レビュー (BA 機能)：
   単なるドキュメント作成にとどまらず — CoSquad が                  - エッジケース、並行性、Anti-goals を深く質疑し、
   承認済み仕様から直接コード生成と結線を実施し、                    実装前にロジックを確実に確定。
   動作するプロダクトを直接納品！                                 - 無機質な技術エラーを親しみやすい表現へ変換。

3. 自律的でスムーズな意思決定：                                   3. 厳格な品質ゲート (QA 機能)：
   (推奨案) + (代替案) + (技術的負債) の選択肢を                    - 異常系 (Unhappy)、境界値、データ漏洩、
   提示し、エンジニアを待たずに 80% の承認判断を                   エラー急増ケースを能動的に補完。
   自信を持って下せるよう支援。                                   - 仕様から E2E Playwright 自動テストを生成。
```

- **非エンジニア向け (BA / QA / PO)：**
  - **コード考古学と仕様抽出：** 5 層のソースコードを自律探索し、行番号の根拠付きで正確に業務仕様を抽出。
  - **新規機能の自動コード生成：** 仕様変更 (CR) や新モジュール開発時、CoSquad が承認済み仕様から直接 `/api`、`/prototype`、`/wire` スキルを活用してコード生成と結線を一括代行し、動作する成果物を納品。
  - **自律的な意思決定：** `(推奨案) + (代替案) + (技術的負債)` の多面的提案を受け取り、開発者のスケジュールを待つことなく 80% の意思決定を自信を持って完了。

- **エンジニア向け (DEV / CODER / LEAD)：**
  - **定型作業からの解放：** スキャフォールディング、ボイラープレート、Mock API、IR 同期、Swagger 整備を完全自動化し、リソースの 100% をコアロジックとアーキテクチャ設計に集中。
  - **業務対抗型コパイロット (BA 機能)：** 高並行処理や境界条件、Anti-goals を能動的に質疑し、難解なシステムエラー（*500 Internal Error*, *Unique constraint failed*）を洗練されたユーザー表現へと昇華。
  - **緻密な品質保証 (QA 機能)：** 思考の死角となる異常系やエラー急増パターンを網羅的に洗い出し、高品質な E2E Playwright 自動テストコードを出力。

![SSOT Hub — アジャイル T 型協調プラットフォーム](../assets/overview-ssot-hub.png)

---

## ⚡ 6 つのアーキテクチャ ＆ 運用の強み

| # | スローガン | 核心的意義 |
| :-: | :--- | :--- |
| **1** | **T 型人材スキルの拡張** | 専門分野の壁を解消：Dev は業務を深く理解し、BA は自らプロトタイプを作り、QA は自動テストを能動生成。 |
| **2** | **早期フィードバックプロトタイプ** | 実際に操作可能なプロトタイプで画面と動線を早期確定し、手戻りリスクの 80% を事前に排除。 |
| **3** | **自動テストによる品質ループの完結** | テスト仕様マトリクスから E2E Playwright コード (`*.spec.ts`) を自動生成し、リグレッションテストの負担から解放。 |
| **4** | **Anti-Copy-Paste Guard** | 重複コードを一掃し、共通資産カタログ (`CMN-UI-*`, `CMN-API-*`, `CMN-DTO-*`) を通じて一元的な再利用を強制。 |
| **5** | **機械が「量」を検証し、人間が「質」を決める** | `coSquad audit` が構造やスキーマを機械検証し、人間（BA/Dev/QA）が対抗質疑 (*grill*) を経て最終的な SSOT を決定。 |
| **6** | **標準フレームワークと柔軟なリスク対応** | 小規模開発ではステップを合理的に短縮し、最重要領域 (Hotspots) では仕様から E2E テストまで厳格に規律を遵守。 |

![早期インタラクティブプロトタイプと仕様によるフェーズ再調整](../assets/overview-phase-recalibration.png)

---

## 🔄 AI Agent との End-to-End 開発ワークフロー

環境設定完了後、AI Agent（Cursor、Antigravity、Claude Code 等）でワークスペースを開き、以下のフローに沿って開発を進めます：

```text
                        coSquad setup
                     (ワークスペース構築)
                              │
                            /init
                    (リポジトリ・境界マップ)
                              │
                         プロジェクト種別？
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
     (保守 Maintain)      (刷新 Rebase)       (新規 Greenfield)
         │                    │                    │
      /trace               /legacy               /spec
    (コード考古学)         (既存資産抽出)          (機能仕様記述)
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    /prototype & /api-spec
                              │
                    /testcase & codegen
                              │
                            /wire
                      (結合連携・パッケージ)
```

### 実行ステップ詳細

| ステップ | コマンド / Skill | 核心的役割 |
| :--- | :--- | :--- |
| **1. Setup 初期化** | `coSquad setup [name]` | スケルトンの初期化、MCP サーバーの設定、AI エージェントハーネスの準備。 |
| **2. Discover 検出** | `/init` | ワークスペースをスキャン、サーフェス境界をマッピング、共通カタログ (`CMN-*`) を抽出して Anti-Copy-Paste Guard を起動。 |
| **2.1. Plan 計画策定** | `/help-plan` | `inition-inventory.md`、設定、現状を分析して段階的な Action Plan を策定し、関連 User Flow を網羅的に検証。 |
| **2.2. Template 学習** | `build-template-code` | Golden Sample（最もクリーンな模範モジュール）を自動分析し、プロジェクト設計に即したカスタムコード生成テンプレートを作成。 |
| **3. コード考古学** | `/trace` *(Maintain)*<br>`/legacy` *(Rebase)* | • `/trace`: `source-code` をスキャンしてロジックを照合し仕様書を生成。<br>• `/legacy`: `source-legacy` を読み取り専用で参照し、仕様・テンプレートを `source-code` へ抽出移行。 |
| **4. 仕様策定** | `/spec`, `/grill` | 画面/機能ごとの Leaf Bundle 仕様を作成し、業務ロジックを対抗質疑。 |
| **5. 設計 ＆ API** | `/prototype`, `/api-spec` | インタラクティブな HTML プロトタイプを生成し、API 契約書 (`01-backend-spec.yaml`) を厳格定義。 |
| **6. テスト自動化** | `/testcase`, `testcase:gen` | `TC-*.yaml` マトリクスを構築し、E2E Playwright 自動テストスイートを生成。 |
| **7. 結合連携** | `/wire` | フロントエンドと実 API を接続し、仕様 ↔ コード間の監査を実行して完了。 |

![テスト仕様マトリクスから E2E Playwright 自動テストへの変換](../assets/overview-testing-e2e.png)

---

## 📚 参考資料

- 📖 **[プロジェクトドキュメント (GitHub)](https://github.com/ShanYuCoder/Doc-CoSquad)** — GitHub リポジトリ上で詳細なドキュメントを参照。
- ⚙️ **ワークフローディレクトリ [workflows/](https://github.com/ShanYuCoder/Doc-CoSquad/tree/main/workflows/)** — 各開発フェーズ、運用ガイドライン、標準プロトコル (`SSOT_AGENT_PROTOCOL.md`、trace、legacy、help-plan、grill-bqa、testcase)。
