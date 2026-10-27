# Audit & gap check (CLI ↔ engine)

**SSOT tra cứu:** lệnh `coSquad audit *` — script deterministic, stdout **JSON** (`gaps[]`, `confirms[]`, mã gap theo engine).

**Khi chạy (gate, phase):** [workflows/gates.md](../workflows/gates.md) · **đóng một function:** [gates.md § close-one-function](../workflows/gates.md#close-one-function).

**Cài / env:** `COSQUAD_DOCS_ROOT`, `COSQUAD_TESTS_DOC`, `--e2e-root` → [cli-and-commands.md](./cli-and-commands.md).

---

## Gọi lệnh

```text
coSquad audit <kind> [args…]
coSquad audit:<kind> [args…]    # legacy alias
coSquad audit                   # help
```

`pnpm run coSquad:audit:<kind>` sau `coSquad init` (nếu repo inject script npm).

---

## Bảng 1:1 lệnh ↔ engine

| Kind | Lệnh | Engine | Input chính | Flags / env |
| --- | --- | --- | --- | --- |
| **spec** | `coSquad audit spec` | `engines/spec/lib/audit-bundle-gaps.mjs` | `*.bundle.yaml` (UI/spec) | `--type list \| create \| detail \| admin-crud \| auth \| change-password \| public` |
| **hub-prd** | `coSquad audit hub-prd` | `engines/docs/lib/audit-hub-prd.mjs` | `overview/index.md`, surface/module `index.md` | — |
| **risks** | `coSquad audit risks` | `engines/docs/lib/audit-risks-catalog.mjs` | **`architecture/11-risks/risk-register.md`** (ưu tiên) hoặc `index.md` | Cột hạn mức / nhu cầu / chênh lệch trên register |
| **flow** | `coSquad audit flow` | `audit-flow-gaps.mjs` | `FLOW-*.md` | — |
| **api** | `coSquad audit api` | `audit-api-gaps.mjs` | API / integration `*.bundle.yaml` | — |
| **testcase** | `coSquad audit testcase` | `audit-testcase-gaps.mjs` | `TC-*.yaml` (v2) hoặc legacy plan | `--bundle <foo.bundle.yaml>` cross-ref bundle |
| **fe-be** | `coSquad audit fe-be` | `audit-fe-be-alignment.mjs` | UI `*.bundle.yaml` | `--backend-spec …/01-backend-spec.yaml` (mặc định resolve cạnh surface) |
| **scenario** | `coSquad audit scenario` | `audit-scenario-coverage.mjs` | `SC-*.yaml` / scenario md | `--tests-docs <hub>` hoặc `COSQUAD_TESTS_DOC` |
| **e2e** | `coSquad audit e2e` | `audit-e2e-coverage.mjs` | Playwright (`e2eRoot` config/MCP hoặc `--e2e-root`) + TC plan | `--id TC-*` / screen / suite, `--tests-docs`, `--screen S-*`, `--strict`; hoặc `TC-*.yaml` paths |
| **legacy** | `coSquad audit legacy` | `audit-legacy-gaps.mjs` | `adoption-inventory.md` + optional target id | `<target-id>` |

---

## Output & exit code

- Mặc định in **JSON** pretty-printed ra stdout (dùng trong grill / agent đọc `gaps[]`).
- Engine có thể set `criticalGaps` / `warningGaps`; CI gate thường dùng **`cases:gate`** cho tests-docs, không gộp tất cả audit vào một lệnh.
- Đọc gap UX spec: `UX_*`, `CONFIRM_UX_*`, `uxAffordanceGaps` trong report `audit spec`.
- FE↔BE: mã `FEBE_*` trong `audit fe-be`.
- Scenario: `SC_SCREEN_NO_TC` khi `screens[]` chưa có `TC-*.yaml` (hoặc defer có `Q-*`, legacy `QA-*`).

---

## Ví dụ (copy-paste)

### FE / fullstack (portal bundle)

```bash
coSquad audit spec surfaces/admin/ADM-01/01/S-ADM-01-01.bundle.yaml --type list
coSquad audit testcase cases/foo/TC-W-001.yaml --bundle surfaces/foo/W-001.bundle.yaml
coSquad audit fe-be surfaces/foo/W-001.bundle.yaml
coSquad audit scenario scenarios/admin/SC-login.yaml
coSquad audit e2e --id TC-DEMO-001
coSquad audit e2e --screen S-ADM-01-01
```

### Backend-only (API spec)

```bash
coSquad audit api surfaces/partner-gateway/acme/export/api/01/01-backend-spec.yaml
coSquad audit spec surfaces/admin/ADM-01/list/feature.bundle.yaml --type list   # nếu có UI portal
coSquad audit fe-be surfaces/admin/ADM-01/list/feature.bundle.yaml            # khi có cả FE bundle + 01
coSquad audit testcase cases/partner/TC-partner-export.yaml \
  --bundle surfaces/partner-gateway/acme/export/api/01/01-backend-spec.yaml
```

### Release gate tests-docs (`cases:gate`)

Không thay `audit *` — gom schema v2, audit TC, trace bundle, facets, coverage:

```bash
coSquad cases:gate --strict
```

### Legacy

```bash
coSquad audit legacy my-legacy-target
```

---

## Liên quan (không thay `audit *`)

| Lệnh | Vai trò |
| --- | --- |
| `coSquad cases:gate` | Release gate tests-docs: schema v2 + `audit testcase` + trace bundle + screen facets + `cases:coverage` (`--strict`, `--docs-root`, `--no-coverage`) |
| `coSquad cases:check` | Syntax / schema TC nhanh |
| `coSquad check` / `split` | IR ↔ bundle đồng bộ trước testcase |
| `coSquad doctor` | Config, MCP, env placeholder |

---

## Skill thường bắt audit (inventory)

| Skill | Audit bắt buộc / khuyến nghị |
| --- | --- |
| `/spec`, `/grill` | `audit spec` |
| `/api-spec` | `audit api` |
| `/user-flow` | `audit flow` |
| `/grill-hub-prd` | `audit hub-prd` |
| `/risk-register` | `audit risks` → `risk-register.md` |
| `/testcase`, `/grill` | `cases:gate`, `audit testcase --bundle`, `audit scenario` |
| `/testcase` | `audit scenario` |
| `/wire` | `audit e2e`, `audit fe-be`, `audit scenario` (khi SC) |
| `/grill wire` | Cùng chuỗi — verify-only sau `/wire`; gap → `/spec`, `/api-spec`, `/grill`, `/test` |
| `/init`, `/legacy` | `audit legacy` |

Cập nhật engine: sửa `bin/lib/audit-run.mjs` (`AUDIT_ENGINES`) + test `test/audit-run.test.mjs` + bảng trên.
