# Skill: `/docs-hub` — bộ docs (tra cứu & CLI)

## Tên
**Bộ docs** của CoSquad — skill tra cứu Document Hub và các lệnh CLI `coSquad split` / `render` / `publish`.

## Cách dùng (Command/Trigger)
- Slash command: **`/docs-hub`** (index arc42/C4, routing ID, validate link).
- CLI (repo Document Hub hoặc sau `coSquad init`):

| Việc | Lệnh | Alias `package.json` (sau init) |
|------|------|----------------------------------|
| Split một bundle | `coSquad split <bundle.yaml>` | `pnpm coSquad:split` |
| Split toàn repo | `coSquad split_all` | `pnpm coSquad:split_all` |
| Render spec MD | `coSquad render` | `pnpm coSquad:render` |
| Publish catalog | `coSquad publish` | `pnpm coSquad:publish` / `pnpm flow:publish` |

## MCP (server `coSquad`)
Nhóm tool **`cosquad_docs_*`**: `cosquad_docs_list_ids`, `cosquad_docs_route`, `cosquad_docs_get_element`, `cosquad_docs_bundle_split`, `cosquad_docs_docs_render`, …

Biến môi trường: **`COSQUAD_DOCS_ROOT`** — đường dẫn tuyệt đối tới repo Document Hub (có `architecture/`).

## Input / Output
- **split:** `*.bundle.yaml` → `ir/design.yaml`, `ir/spec.yaml`, …
- **render:** `ir/*.yaml` → `ir/generated/*.md`, `qa/index.md`
- **publish:** Markdown hiện có → `CATALOG.md` + link đầu `README.md`

## Ý nghĩa
- Bộ docs là SSOT kiến trúc & spec; không trộn với symbol graph của repo code.
- **Index routing:** ID kiến trúc → bộ docs; symbol/call graph → CodeGraph repo tương ứng; gap/tag → ArtifactGraph local.
- Authoring skills (`/spec`, `/grill-bqa`, …) kết thúc bằng `coSquad split` (+ `render` khi cần review).

## Liên quan
- **Trước:** `/spec`, `/update-spec`, `/api-spec`, …
- **Sau:** `coSquad render` → `coSquad dev` (VitePress)

## Chú ý
- Không sửa tay `ir/generated/*.md`; sửa bundle/IR rồi `split` + `render`.
- Agent đọc `ir/design.yaml` sau split thay vì đọc cả `bundle.yaml` khổng lồ.

---

## Example prompt (mẫu gọi)

**Quy tắc:** một session = một command · chat mới khi đổi phase · cập nhật `.harness/progress.md` nếu có.

**Khi nào:** Gọi khi scope khớp mô tả skill ở trên.

```text
/docs-hub

Surface: {admin-web} · Module: {CMP-…} · Scope: {mô tả ngắn}
```

