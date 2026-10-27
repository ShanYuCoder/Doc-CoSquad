# Kỹ năng: `/trace`

## Tên
`trace`

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/trace` hoặc dùng kết hợp `/trace /spec`.
- Dành riêng cho kịch bản **Maintain** (bảo trì và phát triển tiếp codebase hiện có).

## Input (Dữ liệu đầu vào)
- **Thư mục đọc:** `source-code/` (mã nguồn đang chạy của dự án).
- Tài liệu kiến trúc hiện có trong `architecture/`.

## Output (Kết quả mong đợi)
- **Thư mục ghi:** `source-code/` (và các file spec SSOT tương ứng).
- Quét và đối chiếu trực tiếp code thực tế trong `source-code/` để trích ngược Data Model, API contract, state logic vào Leaf Bundle spec.
- Mọi code mới sinh ra hoặc sửa đổi được cập nhật trực tiếp vào `source-code/`.

## Quy tắc bắt buộc
- **Tự giác điều tra (Autonomous Fact-Finding Guard):** Tuyệt đối không hỏi người dùng vị trí file router, controllers, hay schema nằm ở đâu; tự động rà quét và phân tích mã nguồn.
- **Quy trình Reverse-Engineering 3 Tầng bắt buộc (Kiro SDD Engine):**
  1. *Tầng 1: Ranh giới & Điểm vào (System Boundaries & Entry Points):* Chốt cứng URL routes, HTTP verbs, FormRequests, query params và middleware bảo mật trước khi vào sâu.
  2. *Tầng 2: Dòng dữ liệu & Đột biến trạng thái (Data Flow & State Mutation):*
     - Lần theo payload từ Controller vào Service $\to$ Model $\to$ DB. Trích xuất **CÔNG THỨC TOÁN HỌC THÔ** và máy trạng thái.
     - **Cơ chế tìm kiếm Backend (Search Form Mechanics):** Bóc tách chi tiết từng trường tìm kiếm được map vào cột DB nào (`users.name`, `order_code`), toán tử truy vấn (`LIKE %keyword%`, `=`, `BETWEEN`, `IN`), chuẩn hóa chuỗi (trim, lowercase/ILIKE), và index tối ưu (B-Tree, GIN trgm).
     - **Nguồn dữ liệu Master cho Selectbox & Autocomplete:** Chỉ rõ endpoint API nạp options (`GET /api/v1/master/categories`), chiến lược nạp (mount vs lazy debounce 300ms), ánh xạ `valueKey` & `labelKey`, quan hệ phân cấp phụ thuộc (chọn Tỉnh $\to$ nạp Huyện), và cơ chế cache.
     - **Đặc tả File Export:** Khi màn hình có xuất file (Excel, CSV, PDF, JSON), bắt buộc mô tả: định dạng file, bảng mã (`UTF-8 with BOM`), danh sách cột & header, định dạng hiển thị (tiền tệ, ngày tháng), dòng tổng cộng/thống kê (Summary `SUM`/`COUNT`), giới hạn số bản ghi và cơ chế xử lý (tải trực tiếp qua HTTP stream hay chạy bất đồng bộ qua Queue job gửi link tải).
  3. *Tầng 3: Ràng buộc ngầm, Logic động & Quy tắc bất biến (Dynamic Rules & Invariants):*
     - **Quy tắc Giao diện & Logic Động ("Nếu A thì B" - Dynamic Rules):** Khảo sát toàn bộ hành vi phản ứng có điều kiện:
       - *Ẩn/Hiện (Visibility):* Nếu chọn phương thức thanh toán là `BANK_TRANSFER` thì hiển thị khối tài khoản và bắt buộc đính kèm ủy nhiệm chi; nếu là `CASH` thì ẩn.
       - *Bắt buộc/Tùy chọn (Validation toggle):* Nếu trạng thái duyệt là `REJECTED` thì trường `reject_reason` bắt buộc nhập; bỏ bắt buộc nếu là `APPROVED`.
       - *Khóa/Mở (Disabled state):* Nếu tài khoản là `EXTERNAL_SSO` thì khóa đổi mật khẩu/email.
       - *Tự động điền (Auto-calculation):* Khi thay đổi số lượng hoặc đơn giá thì tự động tính lại thành tiền.
     - *Ràng buộc ngầm (Implicit Contracts):* Vạch trần sự phụ thuộc vào global state, biến môi trường, async queues, webhooks, audit logs.
     - *Quy tắc bất biến (Invariant Property Rules):* Các quy tắc nghiệp vụ bất di bất dịch tuyệt đối không được vi phạm khi refactor (ví dụ: tiền hoàn không vượt quá số tiền thanh toán gốc).
- **Quy định về Bằng chứng Truy vết (Evidence Ledger):**
  - Bằng chứng truy vết mã nguồn (`evidenceLedger:`) được ghi nhận chi tiết trong bundle YAML và Phase Reports để phục vụ engine kiểm thử cơ học (`coSquad audit spec`).
  - **TUYỆT ĐỐI KHÔNG render Evidence Ledger ra tài liệu Markdown (`spec.md`)** nhằm giữ cho tài liệu đặc tả của dự án luôn sạch sẽ, súc tích, dễ đọc và tập trung vào nghiệp vụ/kỹ thuật cho stakeholders và developers.
- **AST Skeletonization (Chống quá tải ngữ cảnh Context Overload):** Khi đọc các file code lớn, Agent rút trích bộ xương cú pháp (class, method signatures, docstrings, imports, quan hệ gọi hàm) để nắm Big Picture trước khi zoom sâu vào thân hàm (`view_file#L...-L...`). Rà soát cả Upstream callers và Downstream callees.
- **Ranh giới màn hình chuẩn theo URL & Cô lập Surface (Chống xé nhỏ manh mún `W-*`):**
  - **Surface LUÔN ĐỨNG TRÊN URL (Surface Isolation):** Khi hệ thống chia surfaces theo roles/portals (ví dụ: `admin`, `seller`, `buyer`), nếu hai roles truy cập cùng một URL path giống hệt nhau (ví dụ: cùng có `/orders`): **BẮT BUỘC PHẢI TÁCH THÀNH 2 BẢN SPEC MÀN HÌNH (`W-*`) RIÊNG BIỆT NẰM Ở 2 SURFACE TƯƠNG ỨNG (`surfaces/<surface-1>/...` vs `surfaces/<surface-2>/...`)**. TUYỆT ĐỐI KHÔNG ĐƯỢC GỘP CHUNG GIỮA CÁC SURFACE.
  - Các quy tắc "Ranh giới theo URL", "Gộp Create + Edit", và "Gộp trùng lặp 70–80%" **CHỈ ÁP DỤNG NỘI BỘ TRONG CÙNG 1 SURFACE**.
  - Đơn vị chuẩn trong 1 surface: **Màn hình URL**. Form trong page và Table list thuộc về trang đó, **TUYỆT ĐỐI KHÔNG tách thành ID riêng**.
  - **Gộp Create + Edit thành 1 ID duy nhất (`W-*` - Chỉ trong cùng 1 Surface)** với 2 routes và submit phân nhánh (`create: a`, `edit: b`).
  - **Gộp code duplicate 70–80% (Chỉ trong cùng 1 Surface)** vào 1 ID, mô tả khác biệt trong interaction cases / scenarios.
  - **Interactive Confirmation Gate:** Khi có các cặp gộp/tách trong surface, hỏi Member qua modal `AskQuestion` ($\le 5$) hoặc bảng Plan ($\ge 6$) để Member duyệt trước. Tách theo Surface là ranh giới kiến trúc bất biến, không đưa vào danh sách gộp.
- **Vòng lặp tự kiểm chứng 3 lượt (Self-Correction Critic Loop):**
  - Lượt 1 (Drafting): Soạn thảo spec ban đầu.
  - Lượt 2 (Challenging): Đóng vai Senior Auditor phản biện: *"Đã dừng ở controller chưa? Có bỏ sót edge case hoặc HTTP status 401/403/422 nào không? Các tác dụng phụ ngầm (job, email) có bị thiếu không?"*.
  - Lượt 3 (Refining): Hoàn thiện spec với đầy đủ trích dẫn Evidence Ledger dòng code trước khi chạy engine audit.
- **Duyệt trọn vẹn Chuỗi 5 mắt xích User Flow:** Phải trace luồng Upstream (điều kiện kích hoạt), Primary (thao tác màn hình), Downstream side-effects (job ngầm, email, kho), Failure & Rollback (hủy/lỗi), và Ranh giới Bảo mật (Auth, Tenant).
- **Bắt buộc điều tra sâu tầng Model / Entity khi mapping Database:** Tuyệt đối không dừng lại ở Controller hay Service. Agent **BẮT BUỘC phải mở và đọc sâu xuống các file Model / Entity** (`app/Models/*`, `@Entity`, etc.) và migration DDL:
  * Trích xuất chính xác tên bảng vật lý (`schema`), ORM model class (`modelClass`), vai trò (`roleOnScreen`).
  * Khai báo chi tiết danh sách cột vật lý `columns[]`: tên trường, kiểu dữ liệu chuẩn (`BIGINT UNSIGNED`, `VARCHAR`, `TINYINT`, `DECIMAL`), `nullable`, `unsigned`, `autoIncrement`, `default`, `primaryKey`, `unique`, `index`, khóa ngoại `foreignKey: { references, onDelete }`.
  * **Bảng giải nghĩa trị số enum / tinyint (`enumValues:`):** Giải nghĩa cặn kẽ từng mã số/chuỗi enum sang ý nghĩa nghiệp vụ (ví dụ: `0: DRAFT, 1: PENDING, 2: APPROVED, 3: REJECTED`).
  * Map 100% control giao diện và cột hiển thị với CSDL thông qua `db: { schema, field, enumMapping }`.
- **Bắt buộc truy vết Background Jobs & Queue Workers:** Dò quét toàn bộ `app/Jobs/`, `Console/Commands/`, `routes/console.php`, `Kernel.php`, Celery tasks, Spring `@Scheduled`. Ghi nhận các tác vụ bất đồng bộ vào `asyncJobs: []` hoặc author bundle riêng bằng template `job.bundle.yaml` (`kind: background-job`).
- **Bắt buộc truy vết Webhook & API Integration Hooks:** Dò quét toàn bộ webhook controllers, IPN callbacks (thanh toán, vận chuyển, đối tác) và cơ chế verify chữ ký HMAC, replay protection; author bundle riêng bằng template `integration.bundle.yaml` (`kind: webhook-inbound`).
- **Vòng lặp Trace điều hướng bằng Audit (Audit-Driven Targeted Trace Loop):** Dựa trên kết quả chạy lệnh audit spec của engine (`audit spec`), nếu còn thiếu công thức hoặc database mapping (`MISSING_CALCULATION_FORMULA`, `CONFIRM_DB_*`), Agent lập tức lần theo tín hiệu thiếu sót để trace sâu tiếp vào file xử lý tương ứng cho đến khi 0 critical gaps.
- **Thực tế code là Chân lý tối thượng:** Đoạn code đang chạy là ground truth; ghi nhận ngay các điểm mâu thuẫn giữa mô tả yêu cầu/ticket và thực tế code vào bảng đối chiếu.
- **Chỉ đọc và ghi trên `source-code/`**: Không tìm kiếm hay đụng chạm vào thư mục `source-legacy/`.
- Luôn giữ tính nhất quán giữa tài liệu kiến trúc SSOT và mã nguồn thực thi đang phát triển.

## Description / Ý nghĩa
- Trong dự án bảo trì, việc dev tự viết spec từ đầu rất dễ bỏ sót các logic ngầm, validation ẩn hoặc edge-cases đã tồn tại trong code.
- `/trace` giúp Agent đóng vai trò "thám tử", dò ngược từ implementation thực tế ra spec chuẩn SSOT (`W-*.bundle.yaml`, `01-backend-spec.yaml`, `FLOW-*.md`), bảo đảm việc phát triển tính năng mới không làm gãy vỡ hệ thống cũ.

---

## Example prompt (mẫu gọi)

```text
/trace /spec

Surface: admin
Màn hình: Quản lý đơn hàng (Order Management)
Hãy quét controller và view tương ứng trong source-code/ để trích xuất đầy đủ spec, data model và API contract hiện có.
```
