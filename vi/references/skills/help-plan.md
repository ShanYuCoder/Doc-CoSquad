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
2. Quét nhanh `inition-inventory.md` để khoanh vùng danh sách màn hình và user flows liên quan.
3. **Chia nhỏ phạm vi (Modular Breakdown)**: Không gom toàn bộ 15 màn hình vào một phase khổng lồ để làm lướt ("cưỡi ngựa xem hoa"). Chia kế hoạch thành từng phase nhỏ độc lập theo từng màn hình (`W-*`) và từng flow (`FLOW-*`).
4. **Tái sử dụng 100% trọn bộ Kỹ năng chuyên trách của Docs Suite**:
   - **Khảo cổ & Rà soát mã nguồn (BẮT BUỘC CHECK CẢ BACKEND ĐỂ BÓC TÁCH LOGIC XỬ LÝ ẨN):**
     - Giao diện UI chỉ là bề nổi. Hơn **80% nghiệp vụ quan trọng** (công thức tính toán, điều kiện rẽ nhánh `if/else`, trạng thái máy state machine, ràng buộc DB transaction, xử lý bất đồng bộ queue/event) nằm ẩn sâu trong **Backend**!
     - Bắt buộc đào sâu cả **Frontend + Backend** qua trọn vẹn 5 tầng mã nguồn: UI View/State, FormRequest/Validators, Service/Algorithms/Branches, DB Queries/Relations, Async Events/Queues để bóc tách 100% logic ẩn, tuyệt đối không để sót.
     - Dự án Maintain (`source-code/`): Gọi **`/trace`** kèm skill đích: `/trace /spec`, `/trace /user-flow`, `/trace /api-spec`.
     - Dự án Rebase (`source-legacy/`): Gọi **`/legacy`** kèm skill đích: `/legacy /spec`, `/legacy /user-flow`, `/legacy /api-spec`.
   - **Đặc tả Màn hình:** Gọi **`/spec`** (tạo mới) hoặc **`/update-spec`** (cập nhật).
   - **Kiến trúc & Luồng Dữ liệu:** Gọi **`/user-flow`**, **`/db-erd`**, **`/architecture`**, **`/background-logic`**.
   - **Hợp đồng API Backend:** Gọi **`/api-spec`**, **`/api-update`**, **`/openapi`**.
   - **Phản biện SSOT (Grill Review):** Gọi **`/grill-bqa`**, **`/grill-dev`**, **`/grill-api-spec`**, **`/grill-docs`**.
   - **Kiểm định Cơ học CLI:** Chạy `coSquad audit spec`, `coSquad split`, `coSquad audit flow`, `coSquad audit api`, `coSquad api:check`.

## Cách Dùng (Command/Trigger)
- Gọi qua slash command: **`/help-plan <mô tả yêu cầu / CR / bug fix>`**

## Cấu Trúc Kế Hoạch Khôi Phục Tài Liệu Mẫu do `/help-plan` Sinh Ra

```markdown
# 🧭 Docs Recovery Plan: [Tên Nhiệm Vụ]

> **Phạm vi & Phân loại:**
> - **Chế độ:** `[Maintain (/trace) | Rebase (/legacy) | Greenfield (/spec)]`
> - **Màn hình chính:** `[W-01, W-02, W-03, ...]` (Liệt kê từng màn riêng biệt)
> - **Màn hình liên đới surface khác:** `[W-EXT-01, ...]`
> - **User Flows:** `[FLOW-01, FLOW-02, ...]`
> - **Bảng DB liên quan:** `[table_a, table_b, ...]`

---

## 🗺️ Lộ Trình Phân Chia Theo Màn Hình & Flow

| Phase | Đối tượng | Phân loại | Kỹ năng Docs chuyên trách đảm nhiệm |
| :---: | :--- | :---: | :--- |
| **Phase 1** | Cơ sở dữ liệu & ERD | DB | `/db-erd`, khảo sát models/migrations |
| **Phase 2** | Màn hình `W-01` | Screen | `/trace /spec` (hoặc `/legacy /spec`), `/grill-bqa`, `/grill-dev` |
| **Phase 3** | Màn hình `W-02` | Screen | `/trace /spec` (hoặc `/legacy /spec`), `/grill-bqa`, `/grill-dev` |
| **Phase 4** | Màn liên đới `W-EXT-01` | Screen | `/trace /spec` (hoặc `/update-spec`), `/grill-bqa` |
| **Phase 5** | Hợp đồng API | API | `/trace /api-spec` (hoặc `/api-spec`), `/grill-api-spec` |
| **Phase 6** | User Flows | Flows | `/trace /user-flow` (hoặc `/legacy /user-flow`) |

---

## 🚀 Kế Hoạch Hành Động Chi Tiết

### Phase 2: Màn Hình `W-01` (Trọn Vẹn Chu Trình Docs)
- [ ] **2.1. Đào sâu 5 tầng mã nguồn thật:** Đọc kỹ component, controller, service logic, DB queries của `W-01` để trích xuất đầy đủ mọi điều kiện ẩn, validation và nhánh rẽ, đảm bảo **tuyệt đối không để sót thiếu logic**.
- [ ] **2.2. [GỌI SKILL: /trace /spec (hoặc /legacy /spec / /spec)]:** Khảo cổ và sinh spec `W-01.bundle.yaml`. Chạy `coSquad audit spec` && `coSquad split`.
- [ ] **2.3. [GỌI SKILL: /grill-bqa & /grill-dev]:** Phản biện 4 tầng outcome lỗi và chuẩn hóa tag component.
- [ ] **2.4. Phase Gate:** Báo cáo hoàn thành `W-01`, DỪNG chờ duyệt trước khi qua màn `W-02`.

### Phase 3: Màn Hình `W-02` (Trọn Vẹn Chu Trình Docs)
- [ ] Lặp lại chu trình: `/trace /spec` $\rightarrow$ `/grill-bqa` $\rightarrow$ `/grill-dev`.
```

## Tích Hợp Client-Native
- **Google Antigravity IDE**: Ghi vào Artifact `implementation_plan.md` kèm `RequestFeedback: true` để kích hoạt nút **"Proceed"**.
- **Cursor**: Ghi vào `.cursor/plans/[task-slug].plan.md` kích hoạt **"Build"** / **"Do Plan"**.
- **Claude Code**: Ghi vào `.claude/plans/[task-slug].md` kích hoạt xác nhận `[Y/n]`.
