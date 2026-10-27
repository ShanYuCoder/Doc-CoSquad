# Phase 0 — Data model & ERD

**Phạm vi:** mô hình dữ liệu **trước** `/spec` leaf — cùng nhóm Phase 0 với `/spec` (Product & Surface), `/module`, `/user-flow`.

**Không viết ở đây:** field/column từng màn (Design) · contract BE đầy đủ (lane 2c `01`) · migration SQL.

**Macro:** [index.md § Phase 0](./index.md#phase-0-data-model) · Design handoff: [design.md § Data](./design.md#data-model-two-stages).

---

## Ba tầng (không gộp một file)

| Tầng | Khi | Skill / artifact | Độ chi tiết |
|------|-----|------------------|-------------|
| **1 — ERD tổng** | Module mới, entity/bảng mới, đổi ownership, cross-module | `/db-erd` → `<LCA>/common/db-erd.md` | Entity, quan hệ, trường **chính**, owner module / surface |
| **2 — Screen binding** | Từng `S-*` / leaf bundle | `/spec` → `spec.entities` + `design.sections[].db` | Cột/form ↔ **table.column**; list `columns[].key` ↔ DB hoặc `#derived-data` |
| **3 — Contract BE** | Sau design inventory ổn | `/api-spec` → `01-backend-spec.yaml` | `modules[].entities[]`, `fields[]`, endpoint — SSOT codegen BE |

Tầng 1 = **Phase 0**. Tầng 2 = **Phase 1 Design**. Tầng 3 = **2c** (có thể draft sớm trong `/grill`).

Prose bổ trợ (không thay ERD): [`model-derived-data.md`](../../../templates/project-skeleton/surfaces/common/model-derived-data.md).

---

## Thứ tự Phase 0 (gợi ý)

```text
/spec (+ operational areas & surfaces)
    → /module (module boundary, Depends on)
    → /user-flow (FLOW-* touch data)
    → /db-erd (ERD tại LCA — xem /common)
    → (optional) /architecture khi gọi service/aggregate khác module
```

**LCA** cho `db-erd.md`: [Skill: /common](../references/skills/common.md) — cùng quy tắc với `common/`.

---

## Khi bắt buộc `/db-erd`

- Module / cluster **mới** hoặc thêm **bảng/entity** dùng chung.
- Đổi **quan hệ** (1-n, n-n) hoặc **ownership** (tenant, aggregate).
- Legacy adopt: map schema cũ → entity nghiệp vụ (`/legacy /db-erd`).

**Có thể skip** (nhảy thẳng Design): sửa màn trong module đã có `db-erd.md` ổn định, **không** thêm bảng/cột persisted mới — chỉ UI/validation/copy.

---

## Nội dung tối thiểu `db-erd.md`

- Mermaid `erDiagram`.
- Mỗi entity: tên nghiệp vụ, **owner** (module/surface), PK logic, vài attribute chính.
- Cardinality + ghi chú delete/soft-delete nếu product quan tâm.
- Link tới `FLOW-*` / module tiêu thụ entity — **không** paste ER vào từng bundle.

---

## Handoff sang Design (`/spec`)

Agent **đọc** (walk LCA) `common/db-erd.md` trước khi ghi `db:` trên field.

Trên leaf bundle:

1. **`spec.entities` / `spec.relationships`** — subset entity của màn (tóm tắt, không thay ERD).
2. **`design.sections[].db`** — `schema` (table hoặc tên entity ER), `field` (column), `enumMapping` nếu có.
3. **`spec.ui.list.columns[].key`** — khớp `field` hoặc tag `#derived-data` trong `common/model-derived-data.md`.
4. **`bind.field`** — tên payload/API; grill-dev + `01` phải cùng hướng.

Chi tiết authoring: [bundle-authoring.md § Data model](../../templates/shared/bundle-authoring.md#data-model--phase-0-erd-vs-screen-detail).

Sau split: `entities` + layout `db` → **`ir/design.yaml`** (không vào `ir/spec.yaml` business MD).

**Review member:** `ir/generated/data-wire.md` (gom theo bảng, hỗ trợ multi-table) + optional `design.dataModel.tables[]` trên bundle — [tpl-screen-data-wire.md](../../templates/shared/tpl-screen-data-wire.md). Audit: `coSquad audit spec` → `warnings` `category: db`.

---

## Ba tên hay lệch (cố ý tách vai)

| Khái niệm | Ví dụ | Vai trò |
|-----------|--------|---------|
| Entity ER (diagram) | `Customer`, `Order` | `db-erd.md` |
| Table / schema (physical) | `customers`, `orders` | `design.db.schema`, `01` `table:` |
| Codegen entity | `CustomerEntity` | `gen.codegen.entity`, OpenAPI model name |

Giữ map trong `01` hoặc comment ngắn trên bundle — không engine enforce.

---

## Gap đã biết (process, không gate)

- `audit spec` chưa verify ERD ↔ `db:` (có thể thêm **warnings** sau).
- **Team review (VitePress):** `spec.md` (gồm **bảng cột list**) + sibling `data-wire.md` — không bắt BA mở `ir/design.yaml`. Dev implement vẫn dùng `ir/design` + `01`.

---

## Skill & reference

- Harness: `/db-erd` · Hub: [references/skills/db-erd.md](../references/skills/db-erd.md)
