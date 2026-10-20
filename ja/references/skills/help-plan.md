# Skill: `/help-plan`

## スキル名 (Name)
`help-plan` (High-Precision Implementation Planning & User Flow Navigation Advisor)

## 使用方法 (Command/Trigger)
- スラッシュコマンド実行：**`/help-plan <要件説明 / CR / バグ詳細>`**
- 新規要件、CR、またはバグ改修時に実行。事前ソースコード調査とエンティティごとの垂直フェーズ分割を強制し、質の高い開発計画を策定。

## コア哲学：「機械が量を網羅し、人間が質を決定する」

1. **AI は「量」（網羅性と監査）を担保する：**
   - **完全な情報量 100%：** 曖昧な要約や手抜き、**プレースホルダー (`[file1]`, `[test-command]`, `TODO`, `...`) を徹底的に排除**。
   - **自律的監査チェックリスト：**
     - *UI 画面:* 画面タイトル、パンくず、ルーティング、入力項目（型・バリデーション規則）、ボタン、状態管理（Loading, Disabled, Empty, Error）。
     - *データベース (最重要、見落とし厳禁):* テーブル名、カラム定義、制約（主キー、外部キー、Unique、Nullable、デフォルト値）、インデックス、トランザクション、論理削除、マイグレーションファイル。
     - *API 契約:* エンドポイント、HTTP メソッド、リクエスト/レスポンス DTO、クエリパラメータ、HTTP ステータスコード（200, 400, 401, 403, 404, 422, 500）。
     - *テスト ＆ 異常系:* 正常系、異常系、境界値（Off-by-one, 空リスト, 競合状態）、セキュリティ（IDOR, RBAC, マルチテナント）。
   - **根拠ある選択肢の提示 (A / B / C)：** 情報不足や仕様の曖昧さがある場合、AI は具体的な選択肢を提示：
     - **選択肢 A (Recommended):** 現行アーキテクチャに適合した最適解。
     - **選択肢 B (Alternative):** トレードオフを明示した代替案。
     - **選択肢 C (Log as Tech Debt):** QA バックログ (`qa/`) に技術的負債として記録。

2. **人間は「質」（正確性と最終意思決定）を担保する：**
   - 担当者（BA / Dev / QA）が提示された情報の正確性をレビュー。
   - 提示された選択肢から選定し、論理的整合性を確認して **Proceed** ボタンを押下。

## 鉄則：プレースホルダーの絶対禁止 (ZERO PLACEHOLDER POLICY)
- `[file1]`, `[test-command]`, `TODO` 等の表記は一切禁止。
- すべてのファイルパスはワークスペース内の実在する実パスであること。
- テーブル名、カラム名、クラス名、関数名は事前コード調査により実コードから抽出すること。
- テスト検証コマンドは 100% そのまま実行可能な CLI コマンドであること。

## コンテキストベースの垂直フェーズ分割 (Context-Based Vertical Phasing)

> [!CAUTION]
> **「水平ウォーターフォール」の罠を回避せよ：**
> 「Phase 1: 6 画面をざっと調査、Phase 2: 詳細分析」といった表面的な分割は禁止。
> **エンティティ / 画面 / フローごとにフェーズを独立させ、1 画面ごとに完全なドキュメントとテストのサイクルを完了させること。**

- **ステップ 0 — 必須の事前実地調査 (Deep Reconnaissance):**
  - 計画を作成する前に、DB マイグレーション、モデル、コントローラー、コンポーネントの実コードを読み込む。
  - `inition-inventory.md` と照合し、対象画面 (`W-*`) および関連業務フロー (`FLOW-*`) を特定。
- **Phase 0 — 全体ナビゲーションマップ (Master Navigation Map):**
  - コア画面、外部サーフェスの影響画面、DB エンティティ、関連業務フローの一覧。
- **Phase 1 — データベース基盤とマイグレーション (Database Foundation):**
  - テーブル構造、カラム型、外部キー制約、インデックス、必要なマイグレーションを定義。
- **Phase 2..N — 画面ごとの独立した垂直スライス (1 画面ごとに 1 フェーズ):**
  - **1 画面ごとにドキュメント ＆ テストの完全サイクルを完遂**：
    1. 実コード（View + Controller + DB）を調査（行番号まで明記）。
    2. UI 項目、API DTO、DB クエリを 100% 監査（不足時は A/B/C を提示）。
    3. `/trace /spec` (または `/spec`) で `W-*.bundle.yaml` を作成。
    4. `/grill-bqa` および `/grill-dev` で仕様を対抗質疑。
    5. `/testcase` で `TC-*.yaml` を生成。
    6. 検証コマンドを実行：`coSquad audit spec`, `coSquad split`, `coSquad audit testcase`。
    7. Phase Gate: フェーズレポートを提示し、承認が得られるまで待機。
- **Phase K — 外部サーフェスの影響画面:**
  - 影響を受ける別サーフェスの画面を個別に調査・更新。
- **Phase M — 業務フローの統合と検証 (`FLOW-01` -> `FLOW-N`):**
  - 5 つの接続リンクを網羅する `FLOW-*.md` を作成し、`coSquad audit flow` を実行。
- **Phase P — TDD 実装と E2E 検証 (コード実装が含まれる場合):**
  - Red -> Green -> Wire -> `coSquad audit e2e`。

## クライアントネイティブ連携
- **Google Antigravity IDE**: Artifact `implementation_plan.md` に `RequestFeedback: true` を付与し、**"Proceed"** ボタンを表示。
- **Cursor**: `.cursor/plans/[task-slug].plan.md` に出力し、**"Build"** / **"Do Plan"** を起動。
- **Claude Code**: `.claude/plans/[task-slug].md` に出力し、確認プロンプトを起動。
