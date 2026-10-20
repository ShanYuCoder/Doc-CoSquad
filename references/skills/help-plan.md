# Skill: `/help-plan`

## Name
`help-plan` (Implementation Planning & Spec Docs Recovery Orchestrator)

## Strict Role: Spec & Docs Recovery ONLY
`/help-plan` is the **Planner & Orchestrator EXCLUSIVELY for the CoSquad Docs Suite**.

> [!CRITICAL]
> **MANDATORY BOUNDARY: SPEC & DOCS RECOVERY ONLY:**
> - `/help-plan` strictly authors plans for investigating, recovering, and finalizing SSOT spec documentation (`feature.bundle.yaml`, `01-backend-spec.yaml`, `FLOW-*.md`, `data-models.md`).
> - **STRICTLY ZERO CODE, ZERO TESTCASE, AND ZERO WIRING PHASES.**
> - All phases in the generated plan break down by screen and flow, delegating directly to dedicated Docs skills.

Its sole purpose is to:
1. Receive requirements from members (whether a minor fix or a large legacy rebase spanning 15 screens and 10 flows).
2. Rapidly triage `inition-inventory.md` to identify touched screens and candidate user flows.
3. **Modular Scope Breakdown**: Avoid grouping 15 screens into one massive phase. Structure the plan screen-by-screen (`W-*`) and flow-by-flow (`FLOW-*`).
4. **Re-use 100% of the Dedicated CoSquad Docs Skill Family**:
   - **Archaeology / Code Scanners:**
     - Maintain projects (`source-code/`): Dispatches **`/trace`** (`/trace /spec`, `/trace /user-flow`, `/trace /api-spec`).
     - Rebase projects (`source-legacy/`): Dispatches **`/legacy`** (`/legacy /spec`, `/legacy /user-flow`, `/legacy /api-spec`).
   - **Screen Specifications:** Dispatches **`/spec`** (new screens) or **`/update-spec`** (updates).
   - **Architecture & User Flows:** Dispatches **`/user-flow`**, **`/db-erd`**, **`/architecture`**, **`/background-logic`**.
   - **API Contracts:** Dispatches **`/api-spec`**, **`/api-update`**, **`/openapi`**.
   - **SSOT Grilling & Review:** Dispatches **`/grill-bqa`**, **`/grill-dev`**, **`/grill-api-spec`**, **`/grill-docs`**.
   - **Mechanical Quality Gates:** Runs `coSquad audit spec`, `coSquad split`, `coSquad audit flow`, `coSquad audit api`, `coSquad api:check`.

## Trigger / Usage
- Call via slash command: **`/help-plan <requirement / CR / bug description>`**

## Client-Native Delivery
- **Google Antigravity IDE**: Deliver as Artifact `implementation_plan.md` with `RequestFeedback: true` to trigger the native **"Proceed"** button.
- **Cursor**: Write to `.cursor/plans/[task-slug].plan.md` to trigger **"Build"** / **"Do Plan"**.
- **Claude Code**: Write to `.claude/plans/[task-slug].md` to trigger confirmation prompt `[Y/n]`.
