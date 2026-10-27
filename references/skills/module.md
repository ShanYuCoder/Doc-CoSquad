# Skill: `/module`

## Name
`module`

## Usage (Command/Trigger)
- Call via slash command: `/module`
- **Intelligent 3-Tier Domain Hierarchy:** `/module` automatically analyzes the Member's prompt and workspace context to determine which architectural tier to build or update:
  - **Tier 1 — Overview:** Triggered when the prompt describes system vision, high-level scope, business goals, or operational areas (`overview/index.md`).
  - **Tier 2 — Surfaces:** Triggered when the prompt describes interaction channels, portals, or touchpoints (`surfaces/<surface>/index.md`).
  - **Tier 3 — Modules:** Triggered when the prompt specifies a cohesive functional domain box or module ID (`surfaces/<surface>/<module>/index.md`).
  - **Full Cascade:** Triggered when initializing the full product tree from scratch (Tier 1 $\rightarrow$ Tier 2 $\rightarrow$ Tier 3).

## Input
- Prompt text specifying system vision, business context, interaction surfaces, or module domain boundaries.
- Optional target identifiers (e.g. Surface name or module ID `{surfaceCode}-{id}` like `ADM-01`).

## Output
- **Tier 1 Output:** `overview/index.md` (Goals, Background, Scope in/out, Operational Areas table) and `overview/operational-areas/<slug>.md`.
- **Tier 2 Output:** `surfaces/<surface>/index.md` declaring `surfaceCode` (2–4 uppercase letters) and dual-dimension classification (Role + Channel).
- **Tier 3 Output:**
  - Module hub doc: `surfaces/<surface>/<module>/index.md` (e.g. `surfaces/admin/ADM-01/index.md`) declaring Goals, Scope, Features overview (`S-*`, `J-*`, `H-*`), Depends on.
  - 1-tier flat feature directories directly under module: `surfaces/<surface>/<module>/<feature-slug>/` (screens `S-*`, jobs `J-*`, hooks `H-*`).
  - Reserved directories: `common/` (module-scoped) and `user-flows/` (Step 1 ownership rule).
  - **Hard-Gate:** ZERO `api/` directory at module root (`<module>/api/` is strictly forbidden).

## Description
- Unifies the entire Phase 0 domain modeling workflow into a single prompt-responsive skill.
- Eliminates the need to remember separate commands (`/spec`, `/spec`, `/module`) by understanding the semantic tier from user intent.

---

## Example Prompts

### Tier 1: Defining System Overview & Operational Areas
```text
/module

Draft the master system overview and operational areas for an enterprise B2B supply chain platform. Define business goals, scope boundaries, and core operational areas (Procurement, Warehousing, Distribution).
```

### Tier 2: Defining an Interaction Surface
```text
/module

Define the interaction surface for our Partner B2B Integration Gateway (surfaceCode: PRT) on Web SPA channel, documenting user personas, security scope, and core responsibility boundaries.
```

### Tier 3: Defining a Functional Module
```text
/module ADM-01

Surface: surfaces/admin/
Create module ADM-01 (Hotel Management) containing flat features for Hotel List (S-ADM-01-01), Hotel Detail/Edit (S-ADM-01-02), and Room Sync Job (J-ADM-01-03).
```
