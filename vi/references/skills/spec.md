# Skill: `/spec`

## Tên
`spec`

## Prep (trước session spec)

Quy trình chuẩn bị Phase 0: [phase-0-setup.md](../../workflows/phase-0-setup.md) — `/init` → Phase 0 → `/spec` hoặc `/legacy /spec`.

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/spec <module-id/slug/draft-id>`
- **Lệnh hợp nhất (Unified Command):** Điểm vào duy nhất cho cả tạo mới lẫn cập nhật đặc tả chức năng:
  - **Tự động nhận diện (Create vs Update):**
    - **Nếu bundle CHƯA có:** Tự động kích hoạt **Create Mode** (khởi tạo đặc tả ban đầu từ template).
    - **Nếu bundle ĐÃ có:** Tự động kích hoạt **Update Mode** (trước đây là `/spec`): thực hiện delta update, patch minimal YAML, gắn `#update:*`, tăng `specRevision`, audit, split và render.
- Khi có thêm cờ `/legacy`: Đọc source cũ và ghi `specOrigin: legacy`.

## Input (Dữ liệu đầu vào)
- User Prompt (mô tả yêu cầu bằng text hoặc Change Request / feedback review).
- Feature Slug hoặc Screen ID (ví dụ: `S-ADM-01-01`, `order-list`, legacy `W-ADM-ORD-01`).
- File requirement dạng Markdown (nếu có) được tạo sẵn trong thư mục module hoặc feature.
- File template mẫu toolkit: [`templates/shared/feature.bundle.yaml`](../../../templates/shared/feature.bundle.yaml) + [`bundle-authoring.md`](../../../templates/shared/bundle-authoring.md) (khi Create).
- File bundle hiện hữu `*.bundle.yaml` + các file IR đọc tham chiếu `ir/generated/spec.md`, `ir/design.yaml`, `ir/spec.yaml` (khi Update).
- PRD map: harness `spec-prd-lite.md` · fields `successMetrics`, `nonGoals` (tùy chọn khi có thông tin).

## Output (Kết quả mong đợi)
- File `*.bundle.yaml` chứa thông tin chức năng tại thư mục phẳng 1 cấp: `surfaces/<surface>/<module>/<feature-slug>/`. (Tuân thủ cấu trúc [feature.bundle.yaml](../../../templates/shared/feature.bundle.yaml).)
- Thư mục được đặt theo tên feature slug phẳng trực tiếp dưới module (không lồng nhiều cấp số `01/01/02`). Màn hình con/phụ mô tả luồng truy cập trong §1 Overview.
- Quá trình chạy tool `coSquad split` sẽ sinh ra các file trung gian trong `ir/` và `coSquad render` sinh ra `ir/generated/spec.md`.
- Unresolved questions chuyển thành file `qa/<id>.yaml` (tagged `#tech-debt:Q-*`).

## Description / Ý nghĩa
- **Lệnh hợp nhất đặc tả cốt lõi trong Phase 1 (Design).**
- **Cơ chế tự động phân nhánh:**
  - **Khi bundle đã tồn tại:** Coi là yêu cầu Update. Đọc `ir/generated/spec.md` (read-only), patch YAML cục bộ vào `*.bundle.yaml`, gắn tag `#update:*`, tăng `specRevision`, cập nhật `featureStatus: need-update` nếu là wire, bảo toàn ma trận xử lý lỗi (`onSuccess`, `onCommonError`, `onSpecificError`, `#err:*`) và `legacyEvidence`, sau đó chạy `coSquad audit spec`, `coSquad split` và `coSquad render`.
  - **Khi bundle chưa có:** Coi là Create mới. Phỏng vấn yêu cầu, xác định antiGoals, testing seams, nhận diện kiểu trang, author đầy đủ bundle theo từng Zone.
- Brainstorm 2 mặt dữ liệu cốt lõi: 
  - **Business:** Khối `userStories` chuyên sâu (Primary Story, `screenAccess` hỗ trợ 3 loại: `directRoute` cho URL trực tiếp, `sidebarMenu` cho menu trái đa cấp + text label, `contextualAction` cho nút bấm kích hoạt từ màn hình A, Screen Handoff từ màn nào sang màn nào, 5 kịch bản chi tiết: Tải dữ liệu, Nhập liệu/Validate, Nộp thành công, Ngoại lệ/Lỗi, Tác vụ ngầm, và Acceptance Criteria).
  - **Kỹ thuật:** Phân định rõ ràng trên từng element giữa `meaning` (**Ý nghĩa nghiệp vụ**) và `purpose` (**Mục đích thao tác**).
- Mọi rule validation bắt buộc đi kèm trường `messages` tiếng Việt cụ thể.
- Mọi hành động tương tác (Actions) phải định nghĩa rõ: `validateFormBeforeSubmit`, `feedback` (loadingText, disableWhileSubmitting), `apiRefs`, `onSuccess` (toast, navigation handoff, backgroundTrigger), `onSpecificError` (map lỗi 422, 409 conflict, 403), `onCommonError`.
- **Đặc tả API kết nối (Endpoints):** Giữ bảng danh mục router gọn nhẹ (Mã, Method, Path, Purpose) và gắn link router sang OpenAPI Contract (`./api.md` hoặc `/api-ui/`).
- **Trường ẩn & Thuộc tính kỹ thuật trên màn hình (Hidden & Tech-Derived Fields):**
  - Mô tả trực tiếp trên **item** của màn hình (`sections[].items[]`):
    - Đánh dấu `hidden: true` (hoặc `kind: hidden` / `kind: technical_derived`) cho các trường màn hình lưu trong state nhưng không hiển thị trên UI.
    - Gắn nguồn API trả về qua `apiSource` (ví dụ `GET /api/v1/records/{id} -> data.lock_version`).
    - Nêu rõ logic kỹ thuật hoặc công thức tính toán qua `techDerived` (phân biệt rạch ròi với dữ liệu thừa thãi do query `SELECT *` không dùng).
    - Giải thích mục đích nghiệp vụ / cơ chế sử dụng qua `purpose` / `meaning` (như dùng cho Optimistic Locking, cờ kiểm soát nút bấm, state machine...).
- **Tuyệt đối không** sinh nội dung ra file `.md` bằng tay hay sửa trực tiếp `ir/*`, mà phải luôn ghi vào `*.bundle.yaml` và để engine `coSquad split` lo việc chuyển đổi sang `ir/spec.yaml` và `ir/generated/spec.md`.

## Data model (Phase 0 → leaf)

- **Phase 0:** ERD tổng = `/db-erd` → `<LCA>/common/db-erd.md` — **không** thay bằng `entities: []` trên bundle. Workflow: [architecture-data.md](../../workflows/architecture-data.md).
- **Trên bundle:** `spec.entities` / `spec.relationships` (subset ER) + `design.sections[].items[].db` (`schema`, `field`, `enumMapping`) + list `columns[].key` ↔ DB hoặc `#derived-data`. Chi tiết: [bundle-authoring.md § Data model](../../../templates/shared/bundle-authoring.md#data-model--phase-0-erd-vs-screen-detail).
- Sau `split`: entity + `db` → `ir/design.yaml` (BA `ir/generated/spec.md` không render cột DB).

## Các Skill liên quan
- **Trước đó:** `/db-erd` (khi entity/bảng mới) · `/module` · `/user-flow`.
- **Sau đó:**
  - Kéo theo `/testcase` để đội test chuẩn bị kịch bản E2E.
  - Sẽ bị review và xác nhận lại bởi `/grill` (về Business), `/grill` (về Gen Code), `/grill` (Xung đột).
- **Hợp nhất hoàn toàn:** Thay thế và xóa bỏ hoàn toàn skill `/spec` riêng lẻ.

## Chú ý quan trọng
- **Luật AskQuestion Tech Debt:** Nếu gặp thông tin phân vân, phải hiển thị Form hỏi người dùng (phải bao gồm tuỳ chọn `"Log as Tech Debt"`). Nếu người dùng chọn ghi nợ, phải đẩy thông tin vào file `qa/<SHORT>_NNNN.yaml` thay vì cố tình tự suy diễn (Hallucinate).
- Không được đưa cấu hình CSS cụ thể (màu sắc, border, padding) vào spec trừ khi là case cực kỳ đặc biệt.
- Yêu cầu dùng ngoặc kép hoặc block YAML (`|`) cho tất cả các chuỗi chứa dấu hai chấm `:` hoặc ngoặc vuông `[]`.
- **Quy tắc Trình bày Layout (Không làm vỡ giao diện VitePress):**
  - **CHỈ DUY NHẤT Mục 3: CHI TIẾT THÀNH PHẦN & PHẦN TỬ GIAO DIỆN (UI Elements & Fields Dictionary)** được sử dụng bảng Markdown.
  - Tất cả các mục khác (Mục 6.1 Danh mục API, External API calls, Phân quyền RBAC, Cơ chế tìm kiếm Backend, Master Data, Quy tắc giao diện động) **đều được trình bày dưới dạng danh sách gạch đầu dòng / số thứ tự**:
    - **6.1 Danh mục API:** `1. <Tên API / ID>: <Method>` kèm `- Endpoint Path: ...`, `- Contract / OpenAPI: [Xem OpenAPI / Contract](./api.md) | [OpenAPI Explorer](/api-ui/)`, `- Mục đích nghiệp vụ: ...`.
    - **External API calls:** `1. <URL / Endpoint> (<Đối tác / Provider>): <Mô tả>` kèm `- Dịch vụ gọi: ...`, `- Timeout / Retry: ...`, `- Chi tiết: ...`. Nếu không phân tích được gì thì cung cấp full URL.
  - **TUYỆT ĐỐI KHÔNG render Evidence Ledger vào tài liệu Markdown (`spec.md`, `index.md`):** Khối `evidenceLedger:` chỉ dùng để audit cơ học trong YAML và báo cáo tiến độ trên chat thread, không bao giờ render ra docs.
- Việc tìm kiếm và sử dụng template có sẵn (Common Pattern như Delete Flow, CRUD) là điều bắt buộc.

---

## Example prompt (mẫu gọi)

**Quy tắc:** một session = một command · chat mới khi đổi phase · cập nhật `.harness/progress.md` nếu có.

**Khi nào:** Có requirement mới, hoặc refine spec đã có.

```text
/spec

Surface: {admin-web}
Module: {ADM-01}
Function slug: {hotel-list}
Requirement: {mô tả ngắn: list + search + pagination + row actions}

Tham chiếu:
- Common UI: --id {UI-CMN-*} (surfaces/common/code/…)
- 1 slug = 1 function; không gộp create/update vào cùng folder

Scope IN: `base-docs` + `base-tests`, harness notes
Scope OUT: pages/, components/, mocks/, E2E, unit

Làm:
1. Nếu ir/design.yaml đã có → verify gap (layout, actions, validation)
2. Nếu mới → draft bundle dưới surfaces/<surface>/<module>/<slug>/feature.bundle.yaml
3. Testcase round 1 khớp acceptance
4. pnpm coSquad:render && pnpm coSquad:publish
5. Câu treo → qa/<SHORT>_… (không openQuestions trên YAML)

Handoff: gap chưa rõ → /grill-with-docs · UI → /prototype
```

**Variant — tách function slug:**

```text
/spec

Tách slug mới: {hotel-create} từ {hotel-list} trong cùng module.
Chỉ scope create form + validation + API POST. Link dependency trong notes của list.
```

---
