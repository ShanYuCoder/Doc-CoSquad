# Skill: `/spec`

## スキル名 (Name)
`spec`

## 使用方法 (Command/Trigger)
- スラッシュコマンド実行：`/spec`
- Used when authoring functional specifications for a new screen or feature from scratch (Greenfield mode).

## 入力 (Input)
- User requirements, business rules, UI mockups/screenshots, wireframes, or descriptive bullet points.
- Screen context: Owning Surface (`surfaces/<surface>/`), Module (`{surfaceCode}-{id}`), and Screen Code (`S-*`).
- Local common components registry (`.coSquad/registries/design.registry.json`).

## 出力 (Output)
- Leaf Bundle YAML file: `<slug>.bundle.yaml` located at `surfaces/<surface>/<module>/<feature-slug>/<slug>.bundle.yaml`.
- IR artifacts generated via `coSquad split`: `ir/design.yaml` and `ir/spec.yaml`.
- Rendered business Markdown specification: `ir/generated/spec.md` (and `data-wire.md` if persisted entities exist).
- Unresolved questions routed directly to `qa/<id>.yaml` (tagged `#tech-debt:Q-*`).

## 説明・役割 (Description)
- Phase 1 設計の中核スキル。業務要件を決定論的な `S-*.bundle.yaml` へ構造化し、データモデル、UI コンポーネント、API 契約を厳格バインド。
- Markdown の直接手動編集は厳禁。`coSquad render` で自動生成。
- YAML 内への未決事項の残存は厳禁。AskQuestion または `qa/` で解決。
## 関連スキル (Related Skills)
- **Preceding:** `/spec`, `/module`, `/user-flow`, `/db-erd` (Phase 0).
- **Subsequent:** `/grill` (Business Review), `/grill` (Codegen readiness).

## 注意事項 (Important Notes)
- **Never write Markdown manually** — always generate via `coSquad render`.
- **Never store `openQuestions` in YAML** — use AskQuestion in-session or record tech debt in `qa/`.
- Always run `coSquad audit spec <bundle> --type <profile>` to ensure structural compliance before proceeding.

---

## プロンプト実行例 (Example Prompt)

```text
/spec

Surface: admin-portal · Module: ADM-01 · Screen: S-ADM-01-01 (Order Listing)
Scope: Display paginated order table with date-range filters, order status dropdown, and batch export action.
```

