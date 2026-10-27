# Skill: `/spec`

## Name
`spec`

## Usage (Command/Trigger)
- Call via slash command: `/spec <module-id/slug>`
- **Unified Command:** Single entrypoint for both authoring new specs and updating existing specs.
  - **Create Mode (Auto-detected when bundle is absent):** Authors functional specifications for a new screen/feature from scratch (Greenfield).
  - **Update Mode (Auto-detected when `*.bundle.yaml` already exists):** Executes controlled spec delta (formerly `/spec`), applying surgical patches, incrementing `specRevision`, and syncing via `coSquad split` + `coSquad render`.

## Input
- User requirements, business rules, UI mockups/screenshots, wireframes, or descriptive bullet points (for Create Mode).
- Review comments, change requests (CR), or QA discoveries on existing screens (for Update Mode).
- Target Screen context: Owning Surface (`surfaces/<surface>/`), Module (`{surfaceCode}-{id}`), and Screen Code (`S-*`) or feature slug.
- Local common components registry (`.coSquad/registries/design.registry.json`).

## Output
- Leaf Bundle YAML file: `<slug>.bundle.yaml` located at `surfaces/<surface>/<module>/<feature-slug>/<slug>.bundle.yaml` (1-tier flat under module).
- IR artifacts generated via `coSquad split`: `ir/design.yaml` and `ir/spec.yaml`.
- Rendered business Markdown specification: `ir/generated/spec.md` (and `data-wire.md` if persisted entities exist).
- Unresolved questions routed directly to `qa/<id>.yaml` (tagged `#tech-debt:Q-*`).

## Description
- **Unified Core Specification Skill in Phase 1 (Design).**
- **Automatic Create vs. Update Detection:**
  - **If bundle exists at target path:** Treats request as an update. Reads `ir/generated/spec.md` (read-only), creates minimal YAML patch on `*.bundle.yaml`, tags `#update:*`, bumps `specRevision`, sets `featureStatus: need-update` if wire, preserves error matrices, runs audit, split, and render.
  - **If bundle does NOT exist:** Guides requirement elicitation, anti-goals, testing seams, page type detection, and authors full bundle from `.coSquad/templates/feature.bundle.yaml`.
- Structures human and business requirements into a deterministic, machine-readable Single Source of Truth (SSOT).
- Enforces strict data modeling: binds inputs to `db.schema` / `db.field` or tags computed columns with `#derived-data`.
- Maps UI elements to reusable components via `#ui:`, `#shell:`, `#composable:`, or marks missing components with `#needs-component:`.
- Binds user actions to backend API contracts using `apiRef` or `#reuse-api` + `reuseFrom`.

## Related Skills
- **Preceding:** `/spec`, `/module`, `/user-flow`, `/db-erd` (Phase 0).
- **Subsequent:** `/grill` (Business Review), `/grill` (Codegen readiness), `/testcase`.
- **Consolidated:** Fully consolidates and eliminates the separate `/spec` skill.

## Important Notes
- **Never write Markdown manually** — always generate via `coSquad render`.
- **Never edit `ir/*` or `ir/generated/*` directly** — all updates must be made to `*.bundle.yaml`.
- **Never store `openQuestions` in YAML** — use AskQuestion in-session or record tech debt in `qa/`.
- Always run `coSquad audit spec <bundle> --type <profile>` to ensure structural compliance before proceeding.

---

## Example Prompt

```text
/spec

Surface: admin-portal · Module: ADM-01 · Screen: S-ADM-01-01 (Order Listing)
Scope: Display paginated order table with date-range filters, order status dropdown, and batch export action.
```
