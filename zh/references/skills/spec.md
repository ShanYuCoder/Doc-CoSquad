# Skill: `/spec`

## 名称 (Name)
`spec`

## 使用方式 (Command/Trigger)
- 调用 Slash 命令：`/spec`
- Used when authoring functional specifications for a new screen or feature from scratch (Greenfield mode).

## 输入 (Input)
- User requirements, business rules, UI mockups/screenshots, wireframes, or descriptive bullet points.
- Screen context: Owning Surface (`surfaces/<surface>/`), Module (`{surfaceCode}-{id}`), and Screen Code (`S-*`).
- Local common components registry (`.coSquad/registries/design.registry.json`).

## 输出 (Output)
- Leaf Bundle YAML file: `<slug>.bundle.yaml` located at `surfaces/<surface>/<module>/<feature-slug>/<slug>.bundle.yaml`.
- IR artifacts generated via `coSquad split`: `ir/design.yaml` and `ir/spec.yaml`.
- Rendered business Markdown specification: `ir/generated/spec.md` (and `data-wire.md` if persisted entities exist).
- Unresolved questions routed directly to `qa/<id>.yaml` (tagged `#tech-debt:Q-*`).

## 描述说明 (Description)
- Phase 1 设计中坚技能。将业务需求结构化为确定性的 `S-*.bundle.yaml`，严格绑定数据模型、组件映射与 API 契约。
- 严禁手动编写 Markdown，由 `coSquad render` 自动编译。
- 严禁在 YAML 中遗留 `openQuestions`，通过 AskQuestion 或 `qa/` 闭环。
## 相关技能 (Related Skills)
- **Preceding:** `/spec`, `/module`, `/user-flow`, `/db-erd` (Phase 0).
- **Subsequent:** `/grill` (Business Review), `/grill` (Codegen readiness).

## 注意事项 (Important Notes)
- **Never write Markdown manually** — always generate via `coSquad render`.
- **Never store `openQuestions` in YAML** — use AskQuestion in-session or record tech debt in `qa/`.
- Always run `coSquad audit spec <bundle> --type <profile>` to ensure structural compliance before proceeding.

---

## 提示词调用示例 (Example Prompt)

```text
/spec

Surface: admin-portal · Module: ADM-01 · Screen: S-ADM-01-01 (Order Listing)
Scope: Display paginated order table with date-range filters, order status dropdown, and batch export action.
```

