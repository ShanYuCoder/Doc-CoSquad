# Kỹ năng: `/module`

## Tên
`module`

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/module`
- **Tự động nhận diện 3 tầng phân cấp miền nghiệp vụ từ Prompt:** Skill `/module` tự động phân tích prompt và ngữ cảnh workspace để biết chính xác cần xây dựng hoặc cập nhật tầng nào:
  - **Tầng 1 — Overview (Tổng quan hệ thống):** Kích hoạt khi prompt nói về tầm nhìn, bối cảnh kinh doanh, mục tiêu tổng thể, hoặc các khu vực vận hành (`overview/index.md` & `overview/operational-areas/<slug>.md`).
  - **Tầng 2 — Surfaces (Kênh tương tác & Cổng phân quyền):** Kích hoạt khi prompt nói về các kênh người dùng, touchpoints, role portals (`surfaces/<surface>/index.md`).
  - **Tầng 3 — Modules (Hộp chức năng nghiệp vụ):** Kích hoạt khi prompt nói về các hộp chức năng cụ thể, Module (`surfaces/<surface>/<module>/index.md`).
  - **Khởi tạo chuỗi (Cascade Greenfield):** Khi yêu cầu khởi tạo toàn bộ cây sản phẩm từ đầu, tự động dựng tuần tự: Tầng 1 $\rightarrow$ Tầng 2 $\rightarrow$ Tầng 3.

## Dữ liệu đầu vào (Input)
- Nội dung prompt mô tả bối cảnh hệ thống, kênh tương tác, hoặc phạm vi phân rã module.
- Tùy chọn: Định danh Surface hoặc mã module `{surfaceCode}-{id}` (ví dụ: `ADM-01`, `TA-01`).

## Kết quả đầu ra (Output)
- **Đầu ra Tầng 1:** `overview/index.md` (Goals, Background, Scope in/out, Bảng Operational Areas) và các file chi tiết `overview/operational-areas/<slug>.md`.
- **Đầu ra Tầng 2:** `surfaces/<surface>/index.md` khai báo `surfaceCode` (2–4 ký tự viết hoa) và phân loại 2 chiều (Role + Channel).
- **Đầu ra Tầng 3:**
  - File hub module: `surfaces/<surface>/<module>/index.md` (ví dụ: `surfaces/admin/ADM-01/index.md`) khai báo Goals, Scope, Features overview (`S-*`, `J-*`, `H-*`), Depends on.
  - Các thư mục tính năng phẳng 1 cấp: `surfaces/<surface>/<module>/<feature-slug>/` (màn hình `S-*`, job `J-*`, hook `H-*`).
  - Thư mục chuẩn: `common/` (dùng chung nội bộ module) và `user-flows/` (quy tắc Step 1 Ownership).
  - **Hard-Gate:** TUYỆT ĐỐI KHÔNG có thư mục `api/` ở gốc module (`<module>/api/`). Mọi API contract thuộc về thư mục màn hình trực tiếp gọi nó.

## Description / Ý nghĩa
- Hợp nhất toàn bộ quy trình thiết kế phân rã miền nghiệp vụ (Phase 0) vào duy nhất một skill thông minh.
- Loại bỏ hoàn toàn sự rườm rà khi phải nhớ riêng lẻ từng lệnh `/spec`, `/spec`, `/module`.

---

## Mẫu Prompt gọi lệnh

### Tầng 1: Xây dựng Tổng quan Hệ thống & Khu vực vận hành
```text
/module

Hãy xây dựng hồ sơ tổng quan hệ thống (overview) và các khu vực vận hành cốt lõi cho nền tảng chuỗi cung ứng B2B: đặt mục tiêu kinh doanh, phạm vi in-scope/out-of-scope và các operational areas (Thu mua, Kho bãi, Vận chuyển).
```

### Tầng 2: Xây dựng Kênh tương tác (Surface)
```text
/module

Xây dựng surface cho Cổng Tích Hợp Đối Tác B2B (surfaceCode: PRT) trên nền tảng Web SPA, định nghĩa các nhóm người dùng, phạm vi bảo mật và ranh giới nghiệp vụ.
```

### Tầng 3: Xây dựng Module chức năng
```text
/module ADM-01

Surface: surfaces/admin/
Tạo module ADM-01 (Quản lý Khách sạn) bao gồm các màn hình và job: Danh sách khách sạn (S-ADM-01-01), Chi tiết/Chỉnh sửa (S-ADM-01-02), và Job đồng bộ phòng (J-ADM-01-03).
```

