# Kỹ năng: `/help-plan`

## Tên
`help-plan` (Implementation Planning & Spec Docs Recovery Orchestrator)

## Vai Trò Cốt Lõi: CHỈ KHÔI PHỤC & ĐẶC TẢ TÀI LIỆU DOCS
`/help-plan` là **Bộ Điều Phối & Lập Kế Hoạch ĐỘC QUYỀN cho Khối Docs (Docs Suite)**. 

> [!CRITICAL]
> **RANH GIỚI BẮT BUỘC: CHỈ DÀNH CHO SPEC & DOCS RECOVERY:**
> - `/help-plan` **CHỈ** lập kế hoạch khảo sát, khôi phục và hoàn thiện bộ tài liệu đặc tả SSOT (`feature.bundle.yaml`, `01-backend-spec.yaml`, `FLOW-*.md`, `data-models.md`).
> - **TUYỆT ĐỐI KHÔNG CÓ PHASE CODE, KHÔNG CÓ PHASE TEST VÀ KHÔNG CÓ PHASE WIRE.**
> - Mọi phase trong kế hoạch đều phân rã theo màn hình và flow, gọi trực tiếp các kỹ năng chuyên trách của Khối Docs.

Mục tiêu của `/help-plan`:
1. Nhận yêu cầu từ người dùng (dù là việc nhỏ hay bài toán lớn gồm 15 màn hình + 10 flows).
2. **Kỹ thuật AST Skeletonization & Phân Tích Bán Kính Tác Động (Blast Radius Triage)**:
   - Trước khi bóc tách phase, không ném cả nghìn dòng code raw gây quá tải ngữ cảnh (Context Overload). Trích xuất bộ xương AST (AST Skeletonization): chữ ký hàm, class, route decorators, export interface.
   - Quét đồ thị phụ thuộc Upstream / Downstream (Ai gọi nó? Nó gọi service/DB/API nào?) để khoanh vùng bán kính ảnh hưởng thực tế (Blast Radius).
3. **Ranh Giới Màn Hình Chuẩn URL & Cô Lập Surface (URL-Centric Screen Slicing):**
   - **Surface LUÔN ĐỨNG TRÊN URL (Surface Isolation Boundary):** Khi dự án phân chia surfaces theo roles/portals (ví dụ: `admin`, `merchant`, `buyer`, `staff`), nếu hai roles truy cập cùng một URL path giống hệt nhau (ví dụ: cùng có `/profile`, `/orders`, `/dashboard`):
     - **BẮT BUỘC PHẢI LẬP KẾ HOẠCH TÁCH THÀNH 2 PHASES ĐỘC LẬP VÀ 2 BẢN SPEC MÀN HÌNH (`W-*`) RIÊNG BIỆT DƯỚI TỪNG SURFACE TƯƠNG ỨNG (`surfaces/<surface-1>/...` và `surfaces/<surface-2>/...`)**.
     - **TUYỆT ĐỐI KHÔNG ĐƯỢC GỘP CHUNG GIỮA CÁC SURFACE:** Các surfaces đại diện cho các đối tượng actor khác nhau, phân quyền RBAC khác nhau, phạm vi dữ liệu và kịch bản nghiệp vụ khác nhau hoàn toàn.
     - Mọi quy tắc "Ranh giới chuẩn URL", "Gộp Create + Edit", và "Gộp trùng lặp 70–80%" **CHỈ ÁP DỤNG NỘI BỘ TRONG CÙNG 1 SURFACE**.
   - Một màn hình (`W-*`) tương ứng với 1 URL Route hoặc 1 Viewport làm việc hoàn chỉnh bên trong Surface đó.
   - **Tuyệt đối KHÔNG xé lẻ** form trong trang, table data list, hay thanh tabs nội bộ thành các phase riêng biệt. Tất cả nằm chung trong 1 phase màn hình cha.
   - **Gộp Create + Edit thành 1 Phase Duy Nhất (Chỉ trong cùng 1 Surface)**: Nếu Create và Edit dùng chung form/fields, gom thành 1 màn hình `W-*` với nhánh kịch bản kép (`create: POST...`, `edit: PUT...`).
   - **Gộp màn hình trùng lặp 70–80% (Chỉ trong cùng 1 Surface)**: Phát hiện các màn hình copy-paste clone để gom thành 1 phase với kịch bản đa hình (Polymorphic).
   - **Cổng Phê Duyệt Tách/Gộp**: Nếu có $\le 5$ quyết định tách/gộp nội bộ surface, hỏi qua `AskQuestion` modal. Nếu $\ge 6$, lập bảng "Consolidation & Splitting Proposal" trong kế hoạch để member duyệt trước khi bấm Proceed/Build. Tách theo Surface là bất biến, không đưa vào danh sách gộp.
4. **Chia nhỏ phạm vi (Modular Breakdown)**: Không gom toàn bộ 15 màn hình vào một phase khổng lồ để làm lướt ("cưỡi ngựa xem hoa"). Chia kế hoạch thành từng phase nhỏ độc lập theo từng màn hình URL (`W-*`) và từng flow (`FLOW-*`).
5. **Động Cơ SDD 3 Tầng Kiro (Spec-Driven Reverse-Engineering)**:
   - Mỗi phase màn hình/flow phải tuân thủ 3 tầng đào sâu:
     - *Tầng 1 (System Boundaries):* Route URL, HTTP verbs, Auth/Middleware gates, Entry handlers.
     - *Tầng 2 (Data Flow & State Mutation):* Dữ liệu từ Request payload $\rightarrow$ FormRequest validation $\rightarrow$ Service algorithms $\rightarrow$ DB Transactions & State transitions.
     - *Tầng 3 (Implicit Contracts & Invariant Property Rules):* Khám phá global state ẩn, biến môi trường, cron/queues, và chốt các **Quy tắc Bất Biến (Invariant Property Rules)** tuyệt đối không được vi phạm khi tái cấu trúc.
6. **Vòng Lặp Tự Kiểm Chứng Phản Biện (Self-Correction Critic Loop)**:
   - Lượt 1 (Drafting): Tạo bản phác thảo Spec đầu tiên.
   - Lượt 2 (Challenging - Senior Auditor): Đọc lại mã gốc tìm edge case bỏ sót, điểm mù logic, hoặc giả định sai.
   - Lượt 3 (Refining): Hoàn thiện bản đặc tả SSOT sắc bén, chuẩn xác 100%.
7. **Tái sử dụng 100% trọn bộ Kỹ năng chuyên trách của Docs Suite**:
   - **Khảo cổ & Rà soát mã nguồn:** Duy trì (`source-code/`) dùng **`/trace`**, Tái thiết (`source-legacy/`) dùng **`/legacy`**.
   - **Đặc tả Màn hình:** Gọi **`/spec`**.
   - **Kiến trúc & Luồng Dữ liệu:** Gọi **`/user-flow`**, **`/db-erd`**, **`/architecture`**.
   - **Hợp đồng API Backend:** Gọi **`/api-spec`**.
   - **Phản biện SSOT (Grill Review):** Gọi **`/grill`**.
   - **Kiểm định Cơ học CLI:** Chạy `coSquad audit spec`, `coSquad split`, `coSquad audit flow`, `coSquad audit api`, `coSquad api:check`.

## Cách Dùng (Command/Trigger)
- Gọi qua slash command: **`/help-plan <mô tả yêu cầu / CR / bug fix>`**

## Cấu Trúc Kế Hoạch Khôi Phục Tài Liệu Mẫu do `/help-plan` Sinh Ra

```markdown
# 🧭 Docs Recovery Plan: [Tên Nhiệm Vụ]

> **Phạm vi & Phân loại:**
> - **Chế độ:** `[Maintain (/trace) | Rebase (/legacy) | Greenfield (/spec)]`
> - **Màn hình URL chính:** `[W-01, W-02, ...]` (Gộp Create+Edit, gom in-page form & table vào màn URL cha)
> - **Màn hình liên đới surface khác:** `[W-EXT-01, ...]`
> - **User Flows:** `[FLOW-01, FLOW-02, ...]`
> - **Background Jobs / Schedules:** `[JOB-01, JOB-02, ...]` (Queues, cron commands, queue workers)
> - **Webhooks / API Hooks:** `[INT-01, HOOK-01, ...]` (Inbound callbacks, partner webhooks)
> - **Bảng DB liên quan:** `[table_a, table_b, ...]` (kèm chi tiết physical columns & enum dictionaries)

---

## ⚖️ Bảng Đề Xuất Gom / Tách Màn Hình (Consolidation & Splitting Decisions)

| Màn hình / Endpoint gốc | Đề xuất Xử lý | ID Quy ước | Rationale (Lý do kỹ thuật) | Quyết định của Member |
| :--- | :---: | :---: | :--- | :--- : |
| `/reports/export` (form + list) | **GOM** | `W-ADM-RPT-01` | Form & table list nằm chung trang, không phải modal 80% hay tabs container $\ge 10$ | [x] Đồng ý / [ ] Tách |
| `/users/create` & `/users/:id/edit` | **GOM** | `W-ADM-USR-01` | Trùng 85% form input; rẽ nhánh `create: POST`, `edit: PUT` | [x] Đồng ý / [ ] Tách |
| `/orders/:id/big-refund-modal` | **TÁCH** | `W-ADM-ORD-02` | Modal độc lập chiếm $\ge 80\%$ viewport với state & API riêng | [x] Đồng ý / [ ] Gom |

---

## 🗺️ Lộ Trình Phân Chia Theo Màn Hình URL, Job, Integration & Flow

| Phase | Đối tượng | Phân loại | Kỹ năng Docs chuyên trách đảm nhiệm |
| :---: | :--- | :---: | :--- |
| **Phase 1** | Khảo cổ DB & Kiến trúc | DB & Flow | AST Skeletonization, `/db-erd`, Upstream/Downstream blast radius triage |
| **Phase 2** | Màn hình URL `W-01` (Gộp Create+Edit) | Screen | 3-Layer SDD, trích xuất `dataModel.tables[].columns[]` & UI `db:` mapping, `/spec`, `/grill` |
| **Phase 3** | Màn hình URL `W-02` | Screen | 3-Layer SDD, trích xuất `dataModel.tables[].columns[]` & UI `db:` mapping, `/spec`, `/grill` |
| **Phase 4** | Background Job `JOB-01` | Worker/Job | `/trace /spec` (hoặc `/legacy /spec`), dùng template `job.bundle.yaml` |
| **Phase 5** | Webhook Hook `INT-01` | Webhook/API | `/trace /spec` (hoặc `/legacy /spec`), dùng template `integration.bundle.yaml` |
| **Phase 6** | Màn liên đới `W-EXT-01` | Screen | `/trace /spec` (hoặc `/spec`), `/grill` |
| **Phase 7** | Hợp đồng API Backend | API | `/trace /api-spec` (hoặc `/api-spec`), đặc tả `modules[].entities[].fields[]` chi tiết |
| **Phase 8** | User Flows & E2E Verification | Flows | `/trace /user-flow` (hoặc `/legacy /user-flow`), kết nối 5 mắt xích (kể cả Workers & Webhooks) |

---

## 🚀 Kế Hoạch Hành Động Chi Tiết

### Phase 2: Màn Hình URL `W-01` (Gộp Create + Edit)
- [ ] **2.1. Đào sâu 3 Tầng Kiro (Spec-Driven Excavation):**
  - *Tầng 1 (Boundaries):* Quét routes `/items/create` và `/items/:id/edit`, auth guards, controller handlers.
  - *Tầng 2 (Data Flow & Mutations):* Truy vết Request validation, calculations, mutations, DB transactions.
  - *Tầng 3 (Implicit Contracts & Invariants):* Phát hiện hidden side-effects, globals, và chốt các Invariant Property Rules.
- [ ] **2.2. [GỌI SKILL: /trace /spec (hoặc /legacy /spec / /spec)]:** Khảo cổ và sinh spec `W-01.bundle.yaml` (chứa nhánh kịch bản Create + Edit). Chạy `coSquad audit spec` && `coSquad split`.
- [ ] **2.3. Vòng Lặp Tự Kiểm Chứng Phản Biện (Critic Loop):** Senior Auditor đối soát lại code gốc tìm điểm mù logic.
- [ ] **2.4. [GỌI SKILL: /grill]:** Phản biện 4 tầng outcome lỗi và chuẩn hóa tag component.
- [ ] **2.5. Phase Gate:** Báo cáo hoàn thành `W-01`, DỪNG chờ duyệt trước khi qua màn `W-02`.
```

## Tích Hợp Client-Native
- **Google Antigravity IDE**: Ghi vào Artifact `implementation_plan.md` kèm `RequestFeedback: true` để kích hoạt nút **"Proceed"**.
- **Cursor**: Ghi vào `.cursor/plans/[task-slug].plan.md` kích hoạt **"Build"** / **"Do Plan"**.
- **Claude Code**: Ghi vào `.claude/plans/[task-slug].md` kích hoạt xác nhận `[Y/n]`.
