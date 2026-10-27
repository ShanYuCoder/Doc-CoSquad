# 🛠 CLI Commands & Agent Skills Reference

This document catalogs the complete suite of execution commands (Commands), Model Context Protocol (MCP) tools, and AI Skills (Skills) provided by CoSquad.

## Installing the CoSquad CLI

**Prerequisites:** Node.js **≥ 24**. Installing from **npm** does not pull VitePress/esbuild; installing from **Git** requires `--allow-build=@shanyucoder/cosquad`.

**Team Workflow:** Install globally (or use `npx -y -p @shanyucoder/cosquad@latest coSquad …`) → **`cd` into target project repository** → **`coSquad init`** (or `coSquad setup`). Invoking `coSquad` without arguments prints help text; it does not automatically execute init in the current directory.

**Recommended — Global via pnpm from npm registry** (Linux, macOS, WSL, **Windows PowerShell** — identical commands):

```bash
pnpm add -g @shanyucoder/cosquad@latest
```

| OS | Post-Installation Steps |
| --- | --- |
| Linux / macOS / WSL | Run `pnpm setup` if necessary; binaries are typically linked to `~/.local/share/pnpm`. |
| Windows | Run `pnpm setup` → open a new terminal → verify with `where.exe coSquad` or `coSquad --version`. |

| Alternative Methods | Command |
| --- | --- |
| **GitHub global** (development / unreleased) | `pnpm add -g github:ShanYuCoder/CoSquad --allow-build=@shanyucoder/cosquad` |
| **npx (on-demand)** | `npx -y -p @shanyucoder/cosquad@latest coSquad <command>` |
| **npm global** | `npm install -g @shanyucoder/cosquad@latest` |
| **Dev dependency** | `pnpm add -D @shanyucoder/cosquad@latest` → `pnpm exec coSquad …` |
| **Bash script** (Unix / WSL / Git Bash) | `curl -fsSL https://raw.githubusercontent.com/ShanYuCoder/CoSquad/main/install.sh \| bash` |

| **CLI Updates** | `coSquad update` — updates via npm `@latest` if installed from registry; or Git / `install.sh` / dev clone |
| **Check Before Update** | `coSquad update --check` |

Uninstall: `coSquad uninstall`.

For detailed initialization steps: [README § Installation](/readme).

---

## ⚙️ Core Processing Commands (CoSquad CLI)

CoSquad organizes development execution into three primary engines: **Docs Engine**, **Code Engine**, and **Test Engine**:

### Docs Engine (Specification & Documentation Management)
Commands managing documentation assets, splitting specification bundles, and rendering Markdown/OpenAPI interfaces.

| CoSquad Command | Description |
|------------------|-------------|
| `coSquad split` | Splits `.bundle.yaml` → `ir/design.yaml`, `ir/spec.yaml`, `ir/generated/spec.md` (+ `data-wire.md`). |
| `coSquad split_all` | Scans and splits all Bundle YAML files across the repository. |
| `coSquad render` | Re-renders UI Design Specs from YAML into Markdown (Data Dictionary & State Matrix). |
| `coSquad dev` | VitePress dev server: launches the local documentation hub (port **5173**). Serves the entire unified SSOT architecture (overview, architecture, surfaces, cases, and scenarios). |
| `coSquad build` | Runs `vitepress build` to produce the static documentation site bundle. |
| `coSquad publish` | Publishes documentation assets and generates `CATALOG.md`. |
| `coSquad publish manual` | Synchronizes User Manual (`.md`) files to Google Docs with quota protection and E2E visual evidence. |
| `coSquad openapi_gen` | Generates or updates OpenAPI fragments from `01-backend-spec.yaml` (`--spec` path). |
| `coSquad openapi_render` | Consolidates individual OpenAPI YAML fragments into `docs/api-spec/api.yaml`. |
| `coSquad openapi_build_ui` | Builds a static Swagger UI interface for the Documentation Hub. |
| `coSquad api:check` | Validates `01-backend-spec.yaml` prior to backend code generation. Defaults cwd to docs hub. |

*(Example: `coSquad split_all`)*

### Hub Paths Resolution Order (Config, Env, CLI)

Codegen, `dev`/`build`, `api:check`, and engine scripts resolve root pointers in the following order:

1. Explicit command-line flags: `--docs-root`, `--tests-docs`, `--e2e-root`, `--project-root`
2. MCP environment variables: `COSQUAD_DOCS_ROOT`, `COSQUAD_TESTS_DOC`, `COSQUAD_E2E_ROOT`, `COSQUAD_PROJECT_ROOT`
3. Configuration file `.coSquad/config.json`: `frontend.docsRoot` / `backend.docsRoot` (and corresponding tests/e2e paths)

Example: `coSquad gen:dry --docs-root docs/integration`.

### Audit & Harness (PR Workflow)

**SSOT Audit Matrix:** [audit-commands.md](./audit-commands.md). **Release Gates:** [workflows/gates.md](../workflows/gates.md). Output: JSON stdout with `gaps[]`.

| Command | Summary |
|---------|---------|
| `coSquad audit` | Displays help: `spec`, `flow`, `api`, `testcase`, `fe-be`, `scenario`, `e2e`, `legacy`. |
| `coSquad audit spec …` | Audits UI/spec bundle + UX affordances. Supports `--type` page profile. |
| `coSquad audit api …` | Audits `01-backend-spec.yaml` / API contract specifications. |
| `coSquad audit flow …` | Audits `FLOW-*.md` user journey sections and screen references. |
| `coSquad audit testcase …` | Audits `TC-*.yaml`; cross-references bundles via `--bundle`. |
| `coSquad audit fe-be …` | Validates alignment between `apiRef` in UI spec and `01-backend-spec.yaml`. |
| `coSquad audit scenario …` | Audits scenario `screens[]` vs `cases/**`; `--tests-docs` / `COSQUAD_TESTS_DOC`. |
| `coSquad audit e2e …` | Audits test plan coverage against Playwright test files; `--e2e-root`. |
| `coSquad audit legacy …` | Audits legacy adoption inventory. |
| `coSquad harness sync` | Synchronizes skills, rules, and MCP configurations from `.coSquad/config.json` (`agents[]`). |
| `coSquad harness sync --full-docs` | On FE/BE repos: syncs the complete docs harness (default syncs only consumer subset). |
| `coSquad harness sync --agent=cursor` | Syncs only the specified agent. |
| `coSquad doctor` | Validates `.coSquad/config.json`, MCP env, repo-map drift, skills, and toolkit health. |
| `coSquad doctor --fix` | Runs `harness sync` (+ creates `AGENTS.md` if missing) then re-verifies. |
| `coSquad update` | Updates CLI package version. |
| `coSquad update --check` | Checks current version against latest without downloading. |

---

### Harness Architecture (Common + Per-Agent)

| Layer | Source | Destination |
|-------|--------|-------------|
| **Common** | `harness/common`, `shared`, `docs`/`fe`/`be`/`tests` | `.coSquad/harness/staging/<cache>/bundle` (built once per config) |
| **Materialize** | Staging bundle | `.cursor/`, `.claude/`, `.agents/`, `.antigravity/` |
| **Agent Overlay** | `harness/agents/<agent>/` (supplemental rules/skills) | Merged into corresponding agent directory |
| **MCP** | `agent-profiles` | Cursor/Claude/Kiro → `mcp.json`; Gemini → `.agents/mcp.json`; Antigravity IDE → `.antigravity/mcp_config.json` |

---

### Skills — Harness (Agent) vs Web Documentation {#skills-harness-vs-docs}

| Layer | Location | Audience & Purpose |
| --- | --- | --- |
| **Agent Runtime** | `harness/**/SKILL.md` in CoSquad package → synchronized to `.cursor/skills`, `.agents/`, `.antigravity/skills` | Executed via slash commands inside IDE/CLI chat |
| **Human Documentation** | [references/skills/](./skills/spec.md) (VitePress) — outlines slash command syntax, inputs/outputs, prompt templates | Onboarding reference for BAs, QAs, and Developers |

---

### Test Engine (Testing & Quality Assurance)
Analyzes YAML test scenario matrices, generating Markdown reports and measuring test coverage.

| CoSquad Command | Description |
|------------------|-------------|
| `coSquad cases:render` | Renders Testplan YAML matrices into Markdown on the Tests Hub. |
| `coSquad cases:check` | Validates YAML syntax and schema compliance for testplans. |
| `coSquad cases:gate` | Quality release gate: schema v2 + TC audit + bundle trace (`--strict`, `--docs-root`, `--json`). |
| `coSquad cases:coverage` | Computes test coverage to detect specifications missing test scenarios. |
| `coSquad testcase:gen` | Scaffolds Playwright E2E UI automation from TC YAML (`genType: e2e`). |
| `coSquad testcase:gen:api` | Scaffolds Playwright API test hooks (`request`) from TC YAML (`genType: api-e2e`) → `tests/api-e2e/`. |
| `coSquad e2e-registry` | Inspects and validates Playwright test registries. |
| `coSquad tests:publish` | Publishes tests-docs hub artifacts and catalogs. |
| `coSquad testcase:gen --id TC-*` | Resolves testcase from hub → emits Playwright code according to `e2eRoot`. |
| `coSquad repo-maps check` | Verifies hub config pointers against `platform-repos.local.json`. |
| `coSquad repo-maps align` | Interactive alignment wizard updating both config and local repo maps. |
| `coSquad repo-maps sync --from-config` | Writes repo maps from `.coSquad/config.json`. |
| `coSquad repo-maps fanout` | Broadcasts repo mappings from docs hub across all initialized checkouts. |

---

### Code Engine (Code & Unit Test Generation)
Generates idiomatic frontend components, backend APIs, and unit test suites across supported languages (Node.js, Python, PHP, C#, etc.).

| CoSquad Command | Description |
|------------------|-------------|
| `coSquad gen` | Generates frontend UI components. |
| `coSquad unit-gen` | Generates frontend unit test suites (Jest/Vitest). |
| `coSquad api-gen` | Generates backend API routes, controllers, and services. |
| `coSquad api-unit-gen` | Generates backend unit test suites (Pytest, PHPUnit, xUnit). |
| `coSquad contract-gen` | Generates shared TypeScript types and DTO contracts. |
| `coSquad gen-css` | Generates CSS Variables from Design Tokens. |
| `coSquad build-template-code --sample=<dir>` | Analyzes an existing golden sample module to generate code template plans. |
| `coSquad build-template-code --yes` | Writes code templates (`.hbs`, `.stub`, `.j2`, `.scriban`) into adapter directories. |

*(All code generation commands support `:dry` preview mode without touching the disk, e.g., `coSquad api-unit-gen:dry`)*

#### Stacks & Adapters Compatibility Matrix

| Category | Out-of-the-Box (OOTB) Adapters | Custom Stacks (via Golden Sample) |
| --- | --- | --- |
| **Frontend** | `nuxt4` (Nuxt 4), `nextjs` (Next.js), `dotnet-line` (DotNet Line Client) | Use `coSquad build-template-code --sample=<dir>` or skill `/adopt` to extract architectural DNA and generate templates for Vue 3, React, Angular, Svelte, etc. |
| **Backend** | `nestjs` (NestJS), `fastapi` (FastAPI), `laravel` (Laravel), `dotnet-integration` (DotNet) | Point to any clean golden sample module; CoSquad extracts project patterns and generates templates (`.hbs`, `.stub`, `.j2`, `.scriban`) automatically. |


---

## 🛠 Model Context Protocol (MCP) Tools

CoSquad exposes full platform capabilities through its unified MCP server: **`coSquad`** (`bin/coSquad-mcp.mjs`).

```json
{
  "mcpServers": {
    "coSquad": {
      "command": "node",
      "args": ["/path/to/coSquad/bin/coSquad-mcp.mjs"],
      "env": {
        "COSQUAD_DOCS_ROOT": "/absolute/path/to/ssot-docs",
        "COSQUAD_TESTS_DOC": "/absolute/path/to/tests-hub",
        "COSQUAD_E2E_ROOT": "/absolute/path/to/automation-root",
        "COSQUAD_ADAPTER": "nextjs",
        "COSQUAD_BE_ADAPTER": "nestjs",
        "COSQUAD_PROJECT_ROOT": "/absolute/path/to/code-repo"
      }
    }
  }
}
```

### 1. Documentation Tools (`cosquad_docs_*`)
| MCP Tool Name | Key Parameters | Functionality |
|---|---|---|
| `cosquad_docs_list_ids` | `docsRoot`, `kind`, `prefix` | Scans and lists architectural IDs (`MODULE`, `FLOW-*`, `S-*`, `C-API-*`, `DEP-*`, `ADR-*`). |
| `cosquad_docs_route` | `topic`, `docsRoot` | Routes a business query to the appropriate documentation file in the docs hub. |
| `cosquad_docs_get_element` | `id`, `docsRoot` | Retrieves detailed information and content for an architectural element by ID. |
| `cosquad_docs_deps_of` | `id`, `docsRoot` | Traces dependencies that this element relies on. |
| `cosquad_docs_dependents_of` | `id`, `docsRoot` | Finds other elements depending on this element. |
| `cosquad_docs_orphans` | `docsRoot` | Identifies orphaned documentation files or unlinked IDs in arc42. |
| `cosquad_docs_validate_links` | `docsRoot` | Audits and reports broken markdown links in the docs hub. |
| `cosquad_docs_bundle_split` | `paths`, `projectRoot` | Splits `*.bundle.yaml` into `ir/design.yaml`, `ir/spec.yaml` and emits `ir/generated/<slug>.md`. |
| `cosquad_docs_bundle_merge` | `paths`, `projectRoot` | Merges IR changes back into the parent `*.bundle.yaml`. |
| `cosquad_docs_bundle_check` | `paths`, `projectRoot` | Validates synchronization between bundle and IR files in CI. |
| `cosquad_docs_bundle_split_all` | `projectRoot` | Scans and splits all bundle YAML files across the repository. |
| `cosquad_docs_docs_render` | `projectRoot`, `yamlRoot`, `mdRoot` | Re-renders UI Design Specs into Markdown Data Dictionaries. |
| `cosquad_docs_docs_publish` | `projectRoot` | Compiles and emits `CATALOG.md` with links updated in `README.md`. |

### 2. Frontend Codegen Tools (`codegen_*`, `common_*`, `unit_*`)
| MCP Tool Name | Key Parameters | Functionality |
|---|---|---|
| `codegen_gen` | `adapter`, `docsRoot`, `argv` | Generates frontend UI components based on adapter (Next.js, Nuxt4, DotNet Line). |
| `codegen_gen_dry` | `adapter`, `docsRoot`, `argv` | Dry-run frontend UI component generation without writing files. |
| `unit_gen` | `adapter`, `docsRoot`, `argv` | Generates frontend unit tests (Jest/Vitest). |
| `unit_gen_dry` | `adapter`, `docsRoot`, `argv` | Dry-run frontend unit test generation. |
| `common_gen` | `adapter`, `docsRoot`, `argv` | Generates reusable UI molecules from `surfaces/<surface>/common`. |
| `common_gen_dry` | `adapter`, `docsRoot`, `argv` | Dry-run common UI extraction. |
| `codegen_registry_validate` | `projectRoot` | Validates integrity of frontend codegen registry. |
| `unit_registry_validate` | `projectRoot` | Validates integrity of frontend unit test registry. |

### 3. Backend Codegen Tools (`api_*`)
| MCP Tool Name | Key Parameters | Functionality |
|---|---|---|
| `api_gen` | `adapter`, `argv` | Generates backend API Controllers/Routes/Services from `01-backend-spec.yaml`. |
| `api_gen_dry` | `adapter`, `argv` | Dry-run backend API code generation. |
| `api_unit_gen` | `adapter`, `argv` | Generates backend API unit tests (Pytest, PHPUnit, xUnit). |
| `api_unit_gen_dry` | `adapter`, `argv` | Dry-run backend API unit test generation. |
| `api_registry_validate` | `projectRoot` | Validates integrity of backend API codegen registry. |
| `api_unit_registry_validate`| `projectRoot` | Validates integrity of backend API unit test registry. |

### 4. Testing Automation Tools (`cases_*`, `testcase_*`)
| MCP Tool Name | Key Parameters | Functionality |
|---|---|---|
| `cases_render` | `testsRoot`, `docsRoot` | Renders testplan YAML files into Markdown on the Tests Hub. |
| `cases_check_plans` | `testsRoot` | Validates syntax and schema compliance of YAML test scenarios. |
| `cases_check_coverage` | `testsRoot`, `docsRoot` | Identifies specifications lacking corresponding test scenario coverage. |
| `testcase_gen` | `testsRoot`, `docsRoot`, `argv` | Scaffolds Playwright E2E test suites from IEEE 29119 test matrices. |
| `testcase_gen_dry` | `testsRoot`, `docsRoot`, `argv` | Dry-run Playwright E2E code generation. |
| `e2e_registry_validate` | `projectRoot` | Inspects and validates Playwright E2E test registry. |

### 5. ArtifactGraph MCP Tools (`artifactgraph_*`)
| MCP Tool Name | Key Parameters | Functionality |
|---|---|---|
| `artifactgraph_analyze` | `specPath` or `bullets` | Preflight gap and tag analysis prior to review/codegen. |
| `artifactgraph_grill_check` | `specPath`, `bullets` | Checks grill recommendations and `#missing_info` candidates. |
| `artifactgraph_parity_check` | `moduleDir`, `findingsPath` | Detects parity drift across legacy fields. |
| `artifactgraph_recommend_command` | `commandKey`, `spec` | Recommends allowlisted commands (`genDry`, `unitGen`, etc.). |
| `artifactgraph_allowlist_check` | `commandKey` | Verifies commandKey presence in workspace configuration. |
| `artifactgraph_remember` | Decisions payload | Records reviewer choices and consensus decisions. |
| `artifactgraph_rebuild` | — | Rebuilds SQLite cache from `registries/*.json`. |
| `artifactgraph_gaps` | — | Emits gap summary from index. |
| `artifactgraph_api_reuse_check` | `apiPath` | Detects duplicate API routes before authoring new specs. |
| `artifactgraph_suggest_tags` | `text` | Suggests canonical tags from lexicon. |
| `artifactgraph_status` | — | Reports index status and registry counts. |

---

## Quick Execution Examples

```bash
# Split and render specification assets
coSquad split -- surfaces/admin/ADM-01/<slug>/feature.bundle.yaml
coSquad render
coSquad publish
coSquad dev

# Scaffold Frontend components
coSquad gen:dry --docs-root ~/workspace/base-docs -- --spec …/ir/design.yaml
coSquad gen

# Scaffold Backend API code
coSquad api-gen:dry -- --spec …/api/01/01-backend-spec.yaml
coSquad api-gen
```
