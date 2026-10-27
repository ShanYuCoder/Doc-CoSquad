# Kỹ năng: `/legacy`

## Tên
`legacy`

## Cách dùng (Command/Trigger)
`/legacy` vận hành theo hai chế độ chính:
1. **Chế độ A — Quét khảo cổ & Lập danh mục (Độc lập):** Gọi lệnh `/legacy` hoặc `/legacy scan` để quét toàn bộ mã nguồn cũ, phân loại đa chiều các surface, bóc tách danh mục modules/màn hình/APIs/luồng nghiệp vụ và phát hiện các mẫu dùng chung (Common Catalog Candidates `CMN-*`).
2. **Chế độ B — Hiện đại hoá màn hình đích (Companion / Modifier):** Gọi kèm các skill tạo artifact mục tiêu:
   - `/legacy /spec` (Hiện đại hoá bundle đặc tả màn hình `W-*`)
   - `/legacy /user-flow` (Hiện đại hoá luồng nghiệp vụ đa bước / cross-surface `FLOW-*`)
   - `/legacy /api-spec` (Hiện đại hoá hợp đồng backend API `01-backend-spec.yaml`)

## Dữ liệu đầu vào (Input)
- Thư mục mã nguồn cũ: `source-legacy/` (**TUYỆT ĐỐI CHỈ ĐỌC — READ-ONLY**).
- Chế độ A: Toàn bộ cây thư mục router, controller, view, service, model của dự án cũ.
- Chế độ B: Các file vật lý của đúng 1 tính năng màn hình (`W-*`).

## Kết quả đầu ra (Output)
- **Đầu ra Chế độ A:** File `adoption-inventory.md` và `common-plan.md` đặt trực tiếp tại root workspace.
- **Đầu ra Chế độ B:** Hồ sơ đặc tả SSOT hiện đại (`.bundle.yaml`, `FLOW-*.md`, `01-backend-spec.yaml`) đặt tại `surfaces/` và mã nguồn mới tại `source-code/`.

## Các nguyên tắc bất khả xâm phạm
- **`source-legacy/` TUYỆT ĐỐI CHỈ ĐỌC:** Không bao giờ chỉnh sửa, tạo mới hay xoá file trong thư mục này.
- **Bắt buộc Brainstorming sâu (Chống "quét vèo cái rồi đi"):** Agent là kiến trúc sư phần mềm, trước khi chốt danh mục phải dành một pass phân tích, suy ngẫm kỹ về luồng nghiệp vụ, cấu trúc layout, lý do gộp màn hình và ghi lại trong `## 0. Architectural Brainstorming & Synthesis Rationale`.
- **Ranh giới màn hình chuẩn theo URL & Cô lập Surface (Chống xé nhỏ manh mún `W-*`):**
  - **Surface LUÔN ĐỨNG TRÊN URL (Surface Isolation):** Khi dự án phân chia surfaces theo roles/portals (ví dụ: `admin`, `merchant`, `buyer`, `staff`), nếu hai roles truy cập cùng một URL path giống nhau (ví dụ: cùng có `/profile`, `/orders`, `/dashboard`): **BẮT BUỘC PHẢI TÁCH THÀNH 2 BẢN ĐẶC TẢ SPEC MÀN HÌNH (`W-*`) RIÊNG BIỆT NẰM Ở 2 SURFACE TƯƠNG ỨNG (`surfaces/<surface-1>/...` và `surfaces/<surface-2>/...`)**. TUYỆT ĐỐI KHÔNG ĐƯỢC GỘP CHUNG GIỮA CÁC SURFACES.
  - Các quy tắc "Ranh giới theo URL", "Gộp Create + Edit", và "Gộp trùng lặp 70–80%" **CHỈ ÁP DỤNG NỘI BỘ TRONG CÙNG 1 SURFACE**.
  - Đơn vị chuẩn trong 1 surface: **Màn hình URL (Route / URL boundary)**.
  - Form trong page là một section của page, Table list là thành phần dữ liệu trong page list — **TUYỆT ĐỐI KHÔNG tách thành ID riêng**.
  - **Điều kiện duy nhất để tách ID riêng trong 1 trang:**
    1. *Modal lớn:* Che phủ $\ge 80\%$ màn hình với lifecycle và submit độc lập.
    2. *Tabs lớn:* Cả page được thiết kế là một tabs container lớn (không phải section tabs nhỏ), VÀ container có $\ge 10$ tabs/items.
- **Gộp Create + Edit thành 1 ID duy nhất (`W-*` - Chỉ trong cùng 1 Surface):** Nếu form tạo và sửa có cùng cấu trúc field, bắt buộc tạo DUY NHẤT 1 Screen Feature ID cho cả hai. Khai báo 2 routes (`/create` và `/:id/edit`), tại nút submit mô tả phân nhánh: `Create: gọi POST...`, `Edit: gọi PUT...`. Không tách riêng 2 ID rồi tạo common form.
- **Gộp màn hình duplicate 70–80% (Chỉ trong cùng 1 Surface):** Kể cả khi code cũ copy thành 2 file riêng, nếu phân tích thấy giống nhau 70–80% thì gom vào 1 Screen ID, mô tả phần khác biệt trong các interaction cases / scenarios.
- **Interactive Hỏi ý kiến Member (AskQuestion / Phân tách Plan):**
  - Agent **TUYỆT ĐỐI KHÔNG** tự ý âm thầm quyết định gộp hay tách mà không hỏi ý kiến Member.
  - Khi phát hiện các cặp Create + Edit, màn hình duplicate 70–80%, hoặc modal/tabs nghi vấn nội bộ surface:
    - *Phạm vi nhỏ ($\le 5$ quyết định):* Bật câu hỏi qua modal `AskQuestion` trực tiếp trên thread chat để Member chọn:
      - Option 1 (Recommended): `(Recommended) Gộp chung thành 1 Screen Feature ID (W-*) [Dùng spec đa hình với dual-routes & submit phân nhánh]`
      - Option 2: `Tách riêng từng màn hình ID (W-*) độc lập`
    - *Phạm vi lớn ($\ge 6$ quyết định):* Lập bảng đề xuất gộp/tách trong Implementation Plan (`.plan.md` hoặc `adoption-inventory.md`) chia theo Phase để Member review và duyệt tập trung. Ranh giới chia theo Surface là cố định và không gộp chéo.
- **Chỉ Common (`CMN-UI-*`) mới quét nhỏ chi tiết:** Các component tái sử dụng nhiều nơi (Breadcrumb, FilterBar, ConfirmModal) mới lập danh mục riêng; không xé lẻ component nội bộ của trang.
- **Chống sao chép nguyên xi (Anti-Copy-Paste):** Nghiêm cấm copy-paste code cũ sang dự án mới. Kế thừa các mẫu dùng chung từ Common Catalog (`CMN-*`).
- **Sàn phạm vi cứng (Chế độ B):** Đúng 1 tính năng màn hình (`W-*`) cho mỗi lần chạy (bao gồm toàn bộ URL page, form và bảng của trang đó).
- **Hard-Gate: Cấm dừng ở Controller (Anti-Controller-Stop):** Controller chỉ là router chuyển tiếp. Agent bắt buộc phải lần sâu vào Service (bóc tách công thức toán học thô), Model (fillable, casts, relationships, accessors) và DB Migrations/DDL (kiểu cột, ràng buộc, chỉ mục):
  * **Trích xuất chi tiết cấu trúc cột vật lý (`columns[]`):** Tên trường, kiểu dữ liệu chuẩn SQL (`BIGINT UNSIGNED`, `VARCHAR`, `TINYINT`, `DECIMAL`), `nullable`, `unsigned`, `autoIncrement`, `default`, `primaryKey`, `unique`, `index`, `foreignKey: { references, onDelete }`.
  * **Bảng giải nghĩa trị số enum / tinyint (`enumValues:`):** Giải nghĩa toàn bộ mã số/chuỗi enum sang ý nghĩa nghiệp vụ (ví dụ: `0: DRAFT, 1: PENDING, 2: APPROVED, 3: REJECTED`).
  * **Ánh xạ giao diện sang CSDL:** Map 100% control giao diện và cột hiển thị với CSDL qua `db: { schema, field, enumMapping }`.
  * **Truy vết Background Jobs & Console Schedules:** Dò quét các tác vụ ngầm (`app/Jobs/*`, `Console/Commands/*`, `routes/console.php`, Celery, Spring) và author dùng `templates/shared/job.bundle.yaml` (`kind: background-job`).
  * **Truy vết Webhooks & API Integration Hooks:** Dò quét các webhook controllers (IPN thanh toán, callbacks đối tác) và author dùng `templates/shared/integration.bundle.yaml` (`kind: webhook-inbound`).
- **Evidence Ledger trong bundle YAML (Không render ra Markdown docs):** Mọi tài liệu đặc tả phải trích dẫn chính xác đường dẫn file và dòng code từ tất cả các tầng đã khảo sát vào block `evidenceLedger:` của bundle YAML và Phase Report để audit. **TUYỆT ĐỐI KHÔNG render Evidence Ledger ra tài liệu Markdown (`spec.md`)** để tài liệu hiển thị trên Docs Hub luôn sạch sẽ, gọn gàng cho Stakeholder/Developer.
- **Bóc tách tương tác sâu (Export, Search, Master Data & Dynamic Rules):**
  - *Xuất file (Export Specs):* Định dạng (`.xlsx`, `.csv`, `.pdf`), mã hóa ký tự (`UTF-8 with BOM`), danh sách cột & header, định dạng hiển thị, dòng tổng cộng/thống kê (Summary `SUM`/`COUNT`), giới hạn số bản ghi và cơ chế xử lý (sync stream vs async background queue).
  - *Tìm kiếm backend (Search Mechanics):* Tìm theo cái gì, map vào cột DB nào, toán tử truy vấn (`LIKE`, `=`, `BETWEEN`, `IN`), chuẩn hóa (trim, lowercase), và index tối ưu.
  - *Dữ liệu Master cho Selectbox / Autocomplete:* Endpoint API nạp options, chiến lược nạp (mount vs lazy debounce), ánh xạ `valueKey` & `labelKey`, phụ thuộc phân cấp (Cascading dropdowns), và cache.
  - *Quy tắc động ("Nếu A thì B" - Dynamic Rules):* Quy tắc ẩn/hiện theo điều kiện, quy tắc bắt buộc/tùy chọn (validation toggle), trạng thái khóa/mở (disabled), và tự động tính toán (auto-calculations).
- **Phân loại API bên ngoài:** Mọi lệnh gọi ra dịch vụ bên thứ 3 (Thanh toán, SMS, OAuth, Vận chuyển) bắt buộc phải ghi rõ `Call External API: <Nhà cung cấp>`.

---

## Mẫu Prompt gọi lệnh

### Chế độ A: Khảo cổ tổng quan & Quét Common Catalog
```text
/legacy

Hãy quét sâu mã nguồn trong source-legacy/, phân loại 2 chiều các surfaces, phát hiện các mẫu UI/API trùng lặp để đề xuất danh mục CMN-* và lập danh mục chức năng vào adoption-inventory.md.
```

### Chế độ B: Hiện đại hoá một màn hình cụ thể
```text
/legacy /spec S-ADM-01-01

Surface: surfaces/admin/ · Module: ADM-01
Khảo sát sâu mã nguồn cũ tại source-legacy/app/Http/Controllers/SettlementController.php, lần sâu vào SettlementService, model Settlement và file migration tương ứng để tạo spec bundle S-ADM-01-01.
```
