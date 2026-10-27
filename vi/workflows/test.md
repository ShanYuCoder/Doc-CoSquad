# Workflow — Test (tests-docs & E2E)

**Phạm vi (SSOT):** lane **Code + test** — **tests-docs hub** (`TC-*`, `SC-*`), grill plan, gate, render user case cho QA/Dev, automation trên **e2e-root**.

**Không viết ở đây:** schema TC chi tiết, env, lệnh đầy đủ → [artifacts/index.md](../artifacts/index.md) · Playwright layout → [artifacts/index.md](../artifacts/index.md#workspace-code-repositories).

**Thuộc macro:** [index.md#full-cycle](./index.md#full-cycle) · phase **2b Tests** · Gate: [gates.md](./gates.md#close-one-function) (bước 3–4, 7–8).

---

## Test cycle (Phase 2b) {#test-cycle}

```mermaid
flowchart TD
  subgraph DOCS["Docs hub (nghiệp vụ)"]
    B["*.bundle.yaml\nuserStories · AC"]
    VP["ir/generated/spec.md"]
  end

  subgraph HUB["Tests-docs hub"]
    SC["/testcase → SC-*"]
    TC["/testcase → TC-*.yaml"]
    REN["cases:render → TC-*.md"]
    GTG["/grill\ncases:gate --strict"]
  end

  subgraph E2E["e2e-root (FE/BE repo)"]
    GEN["testcase:gen"]
    T["/test"]
    GT["/grill"]
  end

  B --> TC
  VP -.->|đối chiếu| TC
  SC --> TC
  TC --> REN --> GTG
  GTG --> GEN --> T --> GT

  classDef docs fill:#D1FAE5,stroke:#059669,color:#064E3B
  classDef hub fill:#FDE68A,stroke:#D97706,color:#92400E
  classDef e2e fill:#E0E7FF,stroke:#4338CA,color:#312E81

  class B,VP docs
  class SC,TC,REN,GTG hub
  class GEN,T,GT e2e
```

---

## Ba tầng — không nhầm {#three-layers}

| Tầng | Root | SSOT | VitePress |
|------|------|------|-----------|
| **Docs & Tests Hub** | Workspace Root | `*.bundle.yaml`, `ir/*`, `cases/**`, `scenarios/**` | Port **5173** — Unified VitePress documentation hub |
| **Automation** | `e2e-root` (`source-code/...`) | `*.spec.ts`, Page Objects | Không phải plan SSOT |

**Coverage toàn project:** mỗi function leaf docs có `TC-*` mirror path; cross-flow có `SC-*` + `audit scenario`; gate `--strict` buộc **traceability** về bundle.

Hướng dẫn author: [harness/tests/templates/tpl-testcase-plan.md](../../harness/tests/templates/tpl-testcase-plan.md) (init → tests hub).

---

## SSOT đọc/ghi {#ssot-reading}

| Vai trò | Đọc (review / walkthrough) | Ghi |
|---------|----------------------------|-----|
| BA / PO | Docs VitePress `spec.md` (AC, scenarios) | Không author `TC` — gap → `/spec` |
| QA | Tests VitePress `TC-*.md` (bước, ma trận, trace) | `/testcase`, `/testcase` trên YAML |
| Dev FE | `TC-*.md` + `ir/design.yaml` (`testIds`) | `/test`, không sửa plan YAML tùy tiện |
| Lead release | `cases:gate --strict` JSON | Không bypass trace/matrix |

**Grill testcase** đọc **toàn bộ** `*.bundle.yaml` — không tách `ir/spec` + `ir/design` khi thiết kế coverage.

**Excel UAT:** deliverable xuất **sau** YAML/MD chốt — [SSOT Artifacts](../artifacts/index.md).

---

## E2E lane (automation) {#test-e2e-lane}

Unit Vitest/PHPUnit — lane riêng trên repo FE/BE; không gộp vào diagram dưới.

```mermaid
flowchart TD
  SPEC["TC-*.yaml + testIds\n+ ir/design.yaml"]
  GEN["portal:gen / UI testId"]
  TCG["testcase:gen\nPO + *.spec.ts"]
  TEST["/test\ngap + green scoped"]
  VIT["test:e2e scoped"]
  GT["/grill\ntraceability"]
  LIFE["lifecycle → test"]
  DONE["E2E lane done"]

  SPEC --> GEN
  SPEC --> TCG
  GEN --> TEST
  TCG --> TEST
  TEST --> VIT
  VIT --> GT
  GT --> LIFE
  LIFE --> DONE

  GT -.->|thiếu PO/spec| TEST
```

### Ba lớp assertion (một spec E2E)

| Lớp | Mục đích |
|-----|----------|
| Functional (steps TC) | Flow, mock/real API, `data-testid` |
| Semantic (`#e2e:*`) | Layout, overflow, console |
| Axe (WCAG) | Violations nghiêm trọng |

Chi tiết: [SSOT § Workspace Code Repositories](../artifacts/index.md#workspace-code-repositories).

### `/grill` vs `/grill`

| Skill | Root | Việc |
| --- | --- | --- |
| **`/grill`** | **tests-docs** | Plan YAML: `cases:gate --strict`, `audit testcase --bundle`, matrix facet, gap spec → docs |
| **`/grill`** | **e2e-root** | TC ↔ PO ↔ `*.spec.ts`, semantic `#e2e:*` — sau `/test` green |

### Pre-wire vs post-wire

Cùng `TC-*.yaml`: `lifecycle` ≠ wire → mocks; `wire` → API thật. Handoff [wire.md § pre/post](./wire.md#pre-wire-post-wire).

**API hook:** xem [§ Grill API hook](#grill-api-hook).

---

## Grill kỹ — ba mode {#grill-modes}

Ba lộ trình **tách session** — không gộp `/grill` (hub) với `/grill` (e2e-root) trong một lệnh chat.

| Mode | SSOT plan | Grill hub | Grill automation |
|------|-----------|-----------|------------------|
| **Một màn** `W-*` | `cases/…/TC-*.yaml` (`e2e`) | `/grill` + gate | `/grill` sau `/test` |
| **Flow dài** `SC-*` | `scenarios/…/SC-*` + N× `TC` | `audit scenario` + gate cả cụm | E2E theo từng TC / thứ tự CI |
| **API hook** | `TC` `api-e2e` | `/unit` + `/grill` | `testcase:gen:api` (+ Newman tùy chọn) |

Extract agent: `harness/tests/extracts/grill-screen-tc.md`, `grill-scenario-flow.md`, `grill-api-hook.md`.

### 1 — Một màn chức năng (`W-*`) {#grill-single-screen}

Mục tiêu: coverage **đủ facet** trên **one** function leaf, trace về bundle, rồi mới codegen UI E2E.

```mermaid
flowchart TD
  B["Đọc cả *.bundle.yaml"]
  TC["/testcase → TC-*.yaml\ngenType: e2e"]
  CHK["cases:check · audit testcase --bundle"]
  REN["cases:render → TC-*.md"]
  GTG["/grill\ncases:gate --strict"]
  GEN["testcase:gen"]
  T["/test"]
  GT["/grill · audit e2e"]

  B --> TC --> CHK --> REN --> GTG --> GEN --> T --> GT
```

| # | Kiểm tra grill (plan) | Lệnh / skill |
|---|------------------------|--------------|
| 1 | Bundle có story/AC — không bịa test | STOP → `/spec` |
| 2 | `traceability` khớp `W-*`, scenarios, `AC-*`, `btn_*` | `audit testcase --bundle` |
| 3 | Union `testMatrix` facet trên màn (không chỉ happy) | `cases:gate --strict` |
| 4 | QA đọc user case trên VitePress tests hub | `cases:render` |
| 5 | `testIds.required` khớp design sau split | grill-dev / spot DOM |
| 6 | Spec chạy xanh scoped | `/test` |
| 7 | TC ↔ PO ↔ `*.spec.ts` | `/grill`, `audit e2e` |

Có thể **nhiều file** `TC-*.yaml` cùng folder (smoke + regression) — gate gộp facet theo `refs.screen`.

### 2 — Scenario flow dài (`SC-*`) {#grill-scenario-flow}

Mục tiêu: luồng **xuyên màn** bám `FLOW-*.md` trên docs — không flatten `scenarios/auth/…`.

```mermaid
flowchart TD
  FLOW["FLOW-*.md trên docs"]
  SC["/testcase → SC-*.yaml\nscreens: [W-*, …]"]
  TCs["/testcase mỗi W-*\nrefs.scenario = SC-*"]
  AUD["audit scenario"]
  GTG["grill-testcase + gate strict"]
  E2E["testcase:gen × N\nCI order / env bridge"]

  FLOW --> SC --> TCs --> AUD --> GTG --> E2E
```

| # | Kiểm tra grill | Ghi chú |
|---|----------------|---------|
| 1 | `FLOW-*.md` / `flow-*.md` tồn tại trước SC | Thin FLOW → docs `/user-flow` |
| 2 | `SC.screens[]` = mọi `S-*` (legacy `W-*`) chạm trong journey | Khớp prose FLOW |
| 3 | Mỗi `S-*` (legacy `W-*`) có `TC-*.yaml` **hoặc** defer `Q-*` (legacy `QA-*`) | `SC_SCREEN_NO_TC` |
| 4 | Mỗi TC vẫn pass trace/matrix **per screen** | `audit testcase --bundle` từng leaf |
| 5 | Walkthrough: SC + từng `TC-*.md` render | VitePress |
| 6 | Automation | Spec riêng/màn; không một file TC 50 bước |

**UI + API trong cùng journey:** hai plan — `genType: e2e` (tạo data) + `genType: api-e2e` (hook) — cùng `refs.scenario`; CI truyền `orderId` / token qua env giữa job (xem API hook).

### 3 — API hook (Playwright `request` · Newman tùy chọn) {#grill-api-hook}

Mục tiêu: kiểm HTTP **partner / webhook / public API** — SSOT contract trên docs `01`, plan trên tests-docs.

```mermaid
flowchart LR
  subgraph DOCS["Docs hub"]
    O1["01-backend-spec"]
    GAS["/grill"]
  end
  subgraph HUB["Tests-docs"]
    TA["/unit\nTC api-e2e"]
    GTG["/grill"]
  end
  subgraph RUN["e2e-root"]
    PG["testcase:gen:api\n*.api.spec.ts"]
    PW["Playwright request"]
    NM["Newman optional"]
  end

  O1 --> GAS --> TA --> GTG --> PG --> PW
  TA -.->|tag contract-postman| NM
```

| Bước | Việc | Skill / lệnh |
|------|------|----------------|
| 1 | Contract `01` + grill API | [backend.md](./backend.md) |
| 2 | Author `TC` — `apiSteps[]`, `testMatrix` (401/403/404/422…) | `/unit` · `TC.example-api.yaml` |
| 3 | Grill plan như UI TC | `audit testcase`, `cases:gate --strict` |
| 4 | Gen Playwright | `coSquad testcase:gen:api` → `tests/api-e2e/**` |
| 5 | Chạy CI | `COSQUAD_API_TEST_BASE_URL`; secret qua env |
| 6 | (Tùy) Collection đối tác | Newman trong `integrations/postman/`; tag `contract-postman` — **không** thay YAML SSOT |

| Công cụ | Vai trò |
|---------|---------|
| **Playwright `request`** (CoSquad gen) | Lane chuẩn — trace `TC` ↔ spec, `audit e2e` |
| **Newman** | Replay collection partner / HMAC phức tạp — job CI riêng, link tag trên TC |
| **BE unit** (Supertest/pytest) | Chữ ký webhook, idempotency, DLQ — bổ sung, không thay plan hub |

Portal tạo đơn + partner gọi export: SC gồm **TC UI** + **TC api-e2e** — grill `audit scenario` phải thấy cả hai.

---

## Điều kiện trước lane {#preconditions}

- Docs leaf có bundle đủ `userStories` / `acceptanceCriteria` (hoặc team chấp nhận defer có `Q-*`, legacy `QA-*`).
- `coSquad check` / split ổn trên bundle trước grill testcase hàng loạt.
- `COSQUAD_DOCS_ROOT` + `COSQUAD_TESTS_DOC` cấu hình (`coSquad doctor`).
- Path `cases/…` **mirror** `surfaces/…` — không path phẳng `cases/admin/auth/W-*` ad-hoc.

---

## Bước trong lane {#steps}

| Thứ tự | Việc | Vai trò | Skill / gate |
|--------|------|---------|----------------|
| 0 | (Tùy) Cross-flow inventory | QA / BA | `/testcase` khi có `FLOW-*.md` |
| 1 | Testcase YAML v2 | QA | `/testcase`, `cases:check` |
| 2 | Render user case | QA / any | `coSquad cases:render` → mở VitePress tests hub |
| 3 | Grill plan | QA + member | `/grill`, `audit testcase --bundle` |
| 4 | Gate tests-docs | QA / release | `cases:gate --strict` + `COSQUAD_DOCS_ROOT` |
| 5 | Gen Playwright | Dev / QA | `testcase:gen` (`genType: e2e`) |
| 5b | API hook plan | QA / Dev | `/unit`, `genType: api-e2e` |
| 6 | Implement & green | Dev | `/test`, `test:e2e` scoped |
| 7 | Grill automation | Dev + QA | `/grill` |
| 8 | Audit plan ↔ chạy | QA | `coSquad audit e2e` (policy) |

Mốc đóng leaf: [gates.md § Đóng một function](./gates.md#close-one-function) bước 3–4, 7–8.

### Nội dung `TC-*.yaml` (tóm tắt)

- `schemaVersion: 2`, `testMatrix` đủ facet, `steps`, `traceability`, `testIds.required`.
- `story` / `description` giàu nghiệp vụ — `title` ngắn; dùng `meaning`/`purpose` từ bundle khi viết bước.
- Mẫu: `harness/tests/templates/TC.example.yaml`.

### Vòng grill (ai làm gì)

| Bước | Ai | Việc |
|------|-----|------|
| Spec / testIds | BA / Dev | `ui.testIds`, `#e2e:*` khi cần |
| `portal:gen` | script | `data-testid` trên UI |
| `testcase:gen` | script | PO + `.spec.ts` |
| `/test` | Dev + AI | Fixture gap, scoped green |
| `/grill` | Dev + AI | Matrix TC ↔ PO ↔ spec |

---

## Sign-off test plan (tùy team) {#test-signoff}

Trước `testcase:gen` hàng loạt hoặc trước release IT:

| # | Mục | Kiểm tra |
|---|-----|----------|
| 1 | **Gate** | `cases:gate --strict` pass với `COSQUAD_DOCS_ROOT` |
| 2 | **Trace** | Mỗi TC có `traceability` khớp bundle screen/testcase/AC/actions |
| 3 | **Matrix** | Union facet trên màn đủ (audit / gate) — không chỉ happy path |
| 4 | **Readable** | `TC-*.md` trên VitePress — QA walkthrough không cần mở YAML |
| 5 | **Docs parity** | Spot AC trên `spec.md` ↔ `acceptanceRefs` |
| 6 | **Defer** | Gap chỉ qua `Q-*` (legacy `QA-*`) / `coverage_deferred` có chủ đích |

```text
Test plan sign-off: <screen S-*, legacy W-*> | reviewer | date | cases:gate strict OK
```

---

## Handoff {#handoff}

- **Design lùi:** gap nghiệp vụ → docs `/spec` (paste prompt từ `/grill`).
- **Wire:** post-wire E2E scoped — [wire.md](./wire.md).
- **Backend:** API-only flows — [backend.md](./backend.md) + `api-e2e` TC.

---

## Liên kết nhanh

| Chủ đề | Trang |
|--------|--------|
| Schema, mirror, API hook | [artifacts/index.md](../artifacts/index.md) |
| Skill `/testcase` | [references/skills/testcase.md](../references/skills/testcase.md) |
| `testcase:gen` / `cases:*` CLI | [references/skills/testcase.md](../references/skills/testcase.md) |
| CLI extract (agent) | [testcase-gen-cli.md](../../harness/tests/extracts/testcase-gen-cli.md) |
| Design sign-off (test entry) | [design-leaf-signoff.md](./design-leaf-signoff.md) |
| Grill một màn / SC / API hook | [§ Grill kỹ](./test.md#grill-modes) |
| `/unit` | [references/skills/unit.md](../references/skills/unit.md) |
