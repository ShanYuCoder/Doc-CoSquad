# Skill: `/legacy`

## Name
`legacy`

## Usage (Command/Trigger)
`/legacy` operates in two distinct execution modes:
1. **Mode A — Standalone Scan & Inventory:** Call via `/legacy` or `/legacy scan` to scan legacy repositories, classify surfaces, extract modules/screens/APIs/flows, and discover Common Catalog candidates.
2. **Mode B — Target Screen Modernization (Companion Mode):** Call as a companion modifier alongside target artifact skills:
   - `/legacy /spec` (modernize screen feature spec bundles `W-*`)
   - `/legacy /user-flow` (modernize multi-step / cross-surface flows `FLOW-*`)
   - `/legacy /api-spec` (modernize backend API contracts `01-backend-spec.yaml`)

## Input
- Legacy codebase directory: `source-legacy/` (**STRICTLY READ-ONLY**).
- Mode A: Entire legacy repository tree across routers, controllers, views, services, and models.
- Mode B: Physical legacy files related to exactly ONE screen feature (`W-*`).

## Output
- **Mode A Output:** `extract-legacyion-inventory.md` and `common-plan.md` at workspace root.
- **Mode B Output:** Modernized SSOT specifications (`.bundle.yaml`, `FLOW-*.md`, `01-backend-spec.yaml`) under `surfaces/` and modern code under `source-code/`.

## Inviolable Rules
- **`source-legacy/` is STRICTLY READ-ONLY:** Never modify, add, or delete files within this folder.
- **Zero Raw Copy-Pasting:** Strictly forbidden to copy-paste legacy code into new files. Inherit reusable patterns from the Common Catalog (`CMN-*`).
- **Hard Scope Floor (Mode B):** Exactly ONE screen feature (`W-*`) per execution. Thorough extraction takes 30–60 minutes across the 5 architectural layers.
- **Hard-Gate: Anti-Controller-Stop Rule:** The Agent MUST NOT stop at the Controller. Must traverse deep into Services (extract raw math formulas), Models (attributes, `$casts`, relationships, accessors), and DB Migrations/DDL (column types, constraints, composite indexes).
- **Mandatory Evidence Ledger:** Every generated specification must cite exact physical legacy file paths and line ranges from all layers.
- **External API Taxonomy:** Outbound calls to third-party services MUST be explicitly tagged as `Call External API: <Provider>`.

---

## Example Prompts

### Mode A: Initial Archaeology & Common Catalog Scan
```text
/legacy

Scan legacy source code under source-legacy/, classify dual-dimension surfaces, identify duplicate patterns for the Common Catalog (CMN-*), and output the inventory to extract-legacyion-inventory.md.
```

### Mode B: Modernizing a Target Screen
```text
/legacy /spec S-ADM-01-01

Surface: surfaces/admin/ · Module: ADM-01
Deeply dissect legacy source code at source-legacy/app/Http/Controllers/SettlementController.php, follow into SettlementService, Settlement model, and migrations to generate the target S-ADM-01-01 spec bundle.
```
