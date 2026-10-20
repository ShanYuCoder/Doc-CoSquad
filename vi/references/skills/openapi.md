# Skill: `/openapi`

## Tên
`openapi` — CLI: `coSquad openapi_gen`, `coSquad openapi_render`, `coSquad openapi_build_ui`

## Cách dùng (Command/Trigger)
- Slash: `/openapi`
- Một file: `coSquad openapi_gen --spec surfaces/.../api/<seq>/01-backend-spec.yaml`
- Quét hub: `coSquad openapi_gen` (mọi `01` dưới `surfaces/`)
- Gộp hub: `coSquad openapi_render` → `docs/openapi/api.yaml`
- UI tĩnh (tùy hub): `coSquad openapi_build_ui`

## Input (Dữ liệu đầu vào)
- **`01-backend-spec.yaml`** — SSOT duy nhất cho nội dung OpenAPI.

## Output (Kết quả mong đợi)
- `02-openapi.yaml` cạnh `01` (OpenAPI 3.0.3).
- Sau `openapi_render`: fragment gộp vào `docs/openapi/api.yaml`.
- Sau `coSquad render` (docs hub): `ir/generated/api.md` trên leaf — bảng endpoint cho BA/Dev (không thay `02`).

## Description / Ý nghĩa
- OpenAPI trong CoSquad là **artifact docs**, không phải output codegen BE.
- Luồng: **Docs (01) → 02 → merge hub** — không ngược từ source code stack (`nestjs --openapi`, v.v.).
- Codegen BE: `coSquad api-gen` đọc `01`, không sở hữu file `02`.

Chuỗi gates (thường chạy trong `/grill-api-spec`):

```text
coSquad api:check --spec …/01-backend-spec.yaml
coSquad openapi_gen --spec …/01
coSquad openapi_render
coSquad render
```

Chi tiết đọc/ghi: [tpl-api-contract.md § OpenAPI](../../../templates/shared/tpl-api-contract.md#openapi-01--02--hub) · [backend.md](../../workflows/backend.md).

## Các Skill liên quan
- **Trước:** `/api-spec` hoặc `/api-update`.
- **Sau:** Review trên VitePress (`api.md` + hub OpenAPI UI nếu bật) → `/grill-api-spec` / ship.

## Chú ý quan trọng
- Thiếu schema/`$ref`/examples → **sửa `01`**, gen lại — **không** patch `02` làm SSOT.
- `--dry-run` / `--force` theo CLI khi cần thử nghiệm ghi đè.

---

## Example prompt (mẫu gọi)

```text
/openapi

Surface: {admin-web} · Module: {CMP-…} · Scope: regen 02 + openapi_render sau patch 01
```
