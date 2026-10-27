# Skill: `/api-spec`

## Name
`api-spec`

## Usage (Command/Trigger)
- Call via slash command: `/api-spec <page-id/slug>` (supports `--be-only` flag).
- **Unified Command:** Single entrypoint for both authoring new API contracts and updating/syncing existing API contracts.
  - **Create Mode (Auto-detected when `01-backend-spec.yaml` is absent):** Authors new backend API contract trio.
  - **Update / Sync Mode (Auto-detected when `01-backend-spec.yaml` already exists):** Executes controlled API sync (formerly `/api-spec`), diffing `ir/design.yaml`, applying surgical patches, incrementing `feature.version`, and regenerating OpenAPI via `coSquad openapi_gen`.

## Input
- Portal-backed: Reads `design.actions`, `apiRefs`, and nested items from `ir/design.yaml` (or bundle if un-split).
- Hierarchical reuse search: Sibling `api/<seq>/` → LCA `common/yaml/` → adjacent modules on surface.
- For Updates: Existing `01-backend-spec.yaml` + latest `ir/design.yaml` (or requirement diff).

## Output
- **System Common APIs (`CMN-API-*`):** Stored under `architecture/04-common-apis/` (Upload, OTP, Master Data, etc.).
- **Domain Shared APIs (`API-{SURF}-{DOMAIN}-{NN}`):** Stored under `architecture/apis/<domain>/` (Shared across Detail, Edit, List screens).
- **Feature Private APIs:** Stored under `surfaces/<Surface>/<Module>/<feature-slug>/api/<seq>/` (Exclusive to a single screen).
- Contract SSOT: `01-backend-spec.yaml` (template `backend-api.yaml`; authoring guide `tpl-api-contract.md`).
- Sibling OpenAPI: `02-openapi.yaml` via `coSquad openapi_gen`.
- Rendered review view: `ir/generated/api.md` via `coSquad render`.

## Description
- Contract-First Backend API specification skill (Unified Create & Update).
- **Automatic Create vs. Update Detection:**
  - **If contract exists:** Diffs requirements, applies surgical edits to `01`, updates `changeLog`, regenerates `02-openapi.yaml`.
  - **If contract is new:** Scans reuse hierarchy, authors full trio, audits contract, generates OpenAPI.
- **Integrated Domain Hashtags:**
  - `#call-external`: When integrating third-party systems (payment, SMS, mailer), documents `externalCalls[]`.
  - `#cross-entity-service`: When coordinating across aggregates/domains, documents `services[]`.
- **Agent Registry Lookup Interlock (MANDATORY):** Automatically consults `api.registry.json` and `architecture/apis/` before issuing new IDs. If an endpoint (e.g. `GET /orders/{id}`) was pre-declared at the `/module` tier, the agent reuses the existing ID, eliminating duplicate definitions and merge conflicts.
- Enforces explicit action suffixes (`/create`, `/update`, `/delete`, `/detail`, `/list`).
- Error storming: Applies `#err:*` tags based on endpoint characteristics (not-found + IDOR for `{id}`, validation for POST/PUT).

## Related Skills
- **Preceding:** `/spec` (portal-backed) or BE requirements.
- **Subsequent:** `/api-spec` (generate `02`) → `/grill` → `/api` (BE code repo).
- **Consolidated:** Fully consolidates and eliminates `/api-spec`, `#call-external`, and `#cross-entity-service`.

## Important Notes
- Always resolve questions via AskQuestion / Tech Debt into `qa/` — never write `openQuestions` in YAML.
- **Never author Markdown manually** — compile via `coSquad render`.
- Validate via `coSquad audit api <01-path>` — never run `coSquad check` on `01`.

---

## Example Prompt

```text
/api-spec

Surface: admin-portal · Module: ADM-01 · Scope: Order Management Endpoints
```
