# Skill: `/api-spec`

## Tên
`api-spec`

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/api-spec <page-id/slug>` (hỗ trợ cờ `--be-only`).
- **Lệnh hợp nhất (Unified Command):** Điểm vào duy nhất cho cả tạo mới lẫn cập nhật/đồng bộ hợp đồng API:
  - **Tự động nhận diện (Create vs Update):**
    - **Nếu `01-backend-spec.yaml` CHƯA có:** Tự động chạy **Create Mode** (khởi tạo bộ trio hợp đồng API mới).
    - **Nếu `01-backend-spec.yaml` ĐÃ có:** Tự động chạy **Update / Sync Mode** (trước đây là `/api-spec`): diff với `ir/design.yaml`, patch cục bộ `01`, tăng `feature.version`, sinh lại `02-openapi.yaml` qua `coSquad openapi_gen`.

## Input (Dữ liệu đầu vào)
- Portal: đọc `design.actions`, `apiRefs`, nested items từ `ir/design.yaml` (hoặc bundle nếu chưa split).
- Quét reuse theo thứ tự: sibling `api/<seq>/` → LCA `common/yaml/` → module lân cận trên surface.
- Khi Update: File `01-backend-spec.yaml` hiện hữu + `ir/design.yaml` mới nhất (hoặc yêu cầu BE-only).

## Output (Kết quả mong đợi)
- API **System Common (`CMN-API-*`):** Thư mục `architecture/04-common-apis/` (Upload, OTP, Master Data...).
- API **Domain Shared (`API-{SURF}-{DOMAIN}-{NN}`):** Thư mục `architecture/apis/<domain>/` (Dùng chung cho nhiều màn hình trong Domain như Detail, Edit, List...).
- API **Feature Private:** Thư mục `surfaces/<Surface>/<Module>/<feature-slug>/api/<seq>/` (Chỉ dùng cho API siêu đặc thù của 1 màn hình).
- File contract SSOT: `01-backend-spec.yaml` (mẫu [`backend-api.yaml`](../../../templates/shared/backend-api.yaml); hướng dẫn đọc [`tpl-api-contract.md`](../../../templates/shared/tpl-api-contract.md)).
- API **reuse:** `#reuse-api` + `reuseFrom` trên action/item trong `ir/design.yaml` — **không** tạo trio mới.
- `02-openapi.yaml` qua `coSquad openapi_gen`; team đọc `ir/generated/api.md` sau `coSquad render`.

## Description / Ý nghĩa
- Thiết kế hợp đồng Backend tập trung (Contract-First API Design - Hợp nhất Create & Update).
- **Tự động phân nhánh Create / Update:**
  - **Khi contract đã có:** Đối chiếu thay đổi từ FE, patch tối thiểu `01`, cập nhật `changeLog`, tái sinh `02-openapi.yaml`.
  - **Khi contract chưa có:** Quét reuse, tạo trio mới, audit kiểm tra tính toàn vẹn.
- **Tích hợp Domain Hashtags:**
  - `#call-external`: Khi gọi dịch vụ bên thứ ba (cổng thanh toán, SMS, mailer), khai báo `externalCalls[]`.
  - `#cross-entity-service`: Khi điều phối qua nhiều aggregates hoặc domain services, khai báo `services[]`.
- **Agent Registry Lookup Interlock (BẮT BUỘC):** Agent AI tự động tra cứu `api.registry.json` và thư mục `architecture/apis/` trước khi cấp ID. Nếu endpoint (vd: `GET /orders/{id}`) đã được pre-declare ở tầng `/module`, Agent bắt buộc dùng lại ID có sẵn thay vì cấp ID mới gây trùng lặp/conflict.
- **Reuse first** · **URI có hậu tố hành động** · **Error storming** (`#err:*`, `errorStorming`).

## Các Skill liên quan
- **Trước:** `/spec` (portal) hoặc requirement BE-only.
- **Sau:** `/api-spec` (gen `02`) → `/grill` → bộ code `/api`.
- **Hợp nhất hoàn toàn:** Thay thế và xóa bỏ hoàn toàn `/api-spec`, `#call-external` và `#cross-entity-service`.

## Chú ý quan trọng
- AskQuestion + Tech Debt → `qa/` — không `openQuestions` trong YAML.
- **Không sinh Markdown tay** — `coSquad render` → `ir/generated/api.md`.
- Audit: `coSquad audit api` trên `01` — không `coSquad check` trên `01`.
- SSOT template duy nhất: `backend-api.yaml`.

---

## Example prompt (mẫu gọi)

**Quy tắc:** một session = một command · chat mới khi đổi phase · cập nhật `.harness/progress.md` nếu có.

```text
/api-spec

Surface: {admin-web} · Module: {ADM-01} · Scope: {mô tả ngắn}
```
