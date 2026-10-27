# Skill: `/grill`

## Name
`grill`

## Usage (Command/Trigger)
- Call via slash command: `/grill <target-or-request>`
- **Unified Quality Audit & Adversarial Grilling Engine:** Automatically analyzes the target artifact or prompt context to determine which project stage to grill:
  - **Stage 1 (Screen Feature):** `/grill <W-*.bundle.yaml>` or `/grill W-01` $\rightarrow$ Unified pass combining Business Depth (BQA) and Engineering Codegen readiness (Dev).
  - **Stage 2 (Backend API):** `/grill 01-backend-spec.yaml` $\rightarrow$ Endpoint contracts, DTO schemas, and DB entity mappings.
  - **Stage 3 (Hub PRD):** `/grill overview/index.md` or `/grill surfaces/admin/index.md` $\rightarrow$ Goals, Background, Scope in/out, operational areas.
  - **Stage 4 (Testcase & QA):** `/grill TC-01.yaml` $\rightarrow$ Test matrix facets, boundary tests, negative scenarios.
  - **Stage 5 (Wire & Code):** `/grill wire` $\rightarrow$ FE ↔ BE live integration, mock removal, assertion validity.

## Key Feature: Instant Tech Debt Resolution
- During the `AskQuestion` interrogation wizard, every question provides the option: **`Log as Tech Debt (Pending)`**.
- If a question cannot be resolved immediately, or the member wants to defer decision:
  - The Agent **automatically generates a QA ticket** at `qa/<SHORT>_NNNN.yaml` using `.coSquad/templates/qa.yaml`.
  - The ticket records the context, recommended proposal, and sets status to `pending`.
  - The grilling pass completes successfully with zero blockers! Pending tickets are resolved later via `/qa`.

## Input
- Path to target artifact (`.bundle.yaml`, `01-backend-spec.yaml`, `TC-*.yaml`, `index.md`), or prompt describing the screen/API to review.

## Output
- Quality audit verification via CoSquad CLI audit commands.
- Interactive question-and-answer wizard with concrete proposals (`(Recommended)`).
- Automatically generated Tech Debt tickets in `qa/<SHORT>_NNNN.yaml` for any deferred or unanswered questions.
- Automatically split and rendered documentation artifacts.

---

## Example Prompts

### Screen Feature Spec Grill (Unified BQA + Dev)
```text
/grill surfaces/admin/ADM-01/settlement-export/settlement-export.bundle.yaml

Audit both business logic (validations, 4-tier error outcomes) and engineering readiness (codegen profile, tags, endpoint mapping). Any unresolved questions should be logged as tech debt.
```

### Backend API Contract Grill
```text
/grill surfaces/admin/ADM-01/login/api/01/01-backend-spec.yaml
```

### Domain Architecture PRD Grill
```text
/grill overview/index.md
```
