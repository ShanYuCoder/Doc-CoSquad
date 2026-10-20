# 🌟 BỨC TRANH MỤC TIÊU & ĐỊNH HƯỚNG TƯƠNG LAI (NORTH STAR GOAL)

> **Tài liệu kim chỉ nam (North Star Document)**: Mọi cải tiến, kiến trúc và tính năng của nền tảng sau này đều phải chiếu theo tài liệu này để đối chiếu, đánh giá và hoàn thiện.

---

## 1. Tuyên ngôn Sứ Mệnh (Core Vision & Mission)

Nền tảng này **không đơn thuần là một công cụ viết tài liệu hay sinh spec tĩnh**. 

Sứ mệnh cốt lõi là **giải phóng toàn diện con người trong mô hình Agile T-Shaped Team**:
- **Với Non-Tech (BA, QA, PO, Stakeholder):** Trao "siêu năng lực kỹ thuật" để họ tự chủ làm được **70–80% công việc** ở mọi giai đoạn (từ thám hiểm code hiện trạng, ra quyết định kiến trúc, đến sinh code phát triển tính năng mới/CR) mà không cần lập trình viên kè kè hỗ trợ.
- **Với Dân Tech (Coder / Developer):** Giải phóng họ khỏi sự tẻ nhạt, đồng thời bổ sung hai "bảo mẫu chất lượng" song hành: **1 Chị BA sắc sảo** uốn nắn nghiệp vụ và **1 Em Gái QA kỹ tính** chặn đứng mọi lỗi tiềm ẩn trước khi code xuất xưởng.

```mermaid
graph TD
    subgraph "Mô Hình Agile T-Shaped Co-Pilot"
        A["Non-Tech: BA / QA / PO / Stakeholder"] <-->|"Chủ động 70-80% công việc| SuperPlatform["NỀN TẢNG SIÊU NĂNG LỰC<br/>(AI Engineering & T-Shape Co-Pilot)"]
        SuperPlatform <-->|"Worker chăm chỉ + Chị BA + Em Gái QA"| B["Tech: Coder / Developer"]
    end

    subgraph "Cơ Chế Phẫu Thuật 5 Tầng Mã Nguồn"
        SuperPlatform --> L1["Tầng 1: UI View & Template"]
        L1 --> L2["Tầng 2: Client State & Transform"]
        L2 --> L3["Tầng 3: Route, Middleware & Validation"]
        L3 --> L4["Tầng 4: Service & Thuật Toán Nghiệp Vụ"]
        L4 --> L5["Tầng 5: Model, DB Schema & Migrations"]
    end

    subgraph "Sản Phẩm Đầu Ra Cho Con Người"
        SuperPlatform --> O1["Bảng biểu nghiệp vụ & Sơ đồ Mermaid trong sáng"]
        SuperPlatform --> O2["Quyết định trắc nghiệm: (Recommended) + Alt + Tech Debt"]
        SuperPlatform --> O3["Tự động sinh code mới (CR / Screen Feature)"]
        SuperPlatform --> O4["Ma trận kiểm thử TC-*.yaml & Error Storming Matrix"]
    end
```

---

## 2. Cách Nền Tảng Giải Phóng Từng Đối Tượng

### 2.1. Giải phóng Non-Tech (BA, QA, PO, Stakeholders) — Tự chủ 70–80%

Người làm sản phẩm và nghiệp vụ nắm rất chắc giá trị người dùng và luồng vận hành, nhưng không có nghĩa vụ phải đi đọc cú pháp AST, SQL migration phức tạp, Vue store hay regex validation khô khan. Nền tảng đảm nhiệm toàn bộ phần nặng nhọc nhất:

1. **Lặn sâu 5 tầng mã nguồn thực tế (Không suy đoán lịch sử Git commit):**
   - **Tầng 1 (UI View):** Bóc tách từng component, input, nút bấm, cột bảng, dialog, điều kiện `v-if`, cờ `disabled`.
   - **Tầng 2 (Client State):** Theo dõi reactive state, payload gửi lên, formatters client.
   - **Tầng 3 (Route & Validation):** Đọc tường tận FormRequest, regex, middleware xác thực, HTTP status codes.
   - **Tầng 4 (Service & Thuật toán):** Truy vết từng nhánh rẽ `if/else`, vòng lặp tính toán, công thức trừ hoa hồng/thuế, các điểm gọi API đối tác ngoài (`Call External API`).
   - **Tầng 5 (Model & DB Schema):** Soi chiếu bảng vật lý, khóa ngoại, kiểu dữ liệu `$casts`, quan hệ Model và Accessor.
2. **Làm sạch rác kỹ thuật & Bản địa hóa:**
   - Chuyển toàn bộ logic if/else, quan hệ DB và công thức toán thành bảng biểu nghiệp vụ (Business Rules Table), quy tắc tiếng Việt/Anh chuẩn mực và sơ đồ Mermaid trực quan.
3. **Cơ chế ra quyết định đa chiều (Decision Protocol):**
   - Tuyệt đối không hỏi cụt lủn những câu hỏi kỹ thuật vô nghĩa ("Dùng cascade hay restrict?", "Redux dispatch gì?").
   - Luôn đưa ra bộ lựa chọn 4 phương án rõ ràng để người dùng tự tin bấm duyệt:
     - `(Recommended)`: Phương án chuẩn hóa tối ưu nhất cả về nghiệp vụ lẫn kỹ thuật.
     - `Alternative`: Phương án thay thế nếu có ràng buộc thời gian hoặc tài nguyên.
     - `Log as Tech Debt (QA)`: Phương án ghi nhận nợ kỹ thuật để xử lý sau.
     - `Other`: Cho phép nhập ý kiến tùy biến.
4. **Không chỉ Reverse mà còn Forward (Code thay họ khi làm mới / CR):**
   - Khi có Change Request (CR) hoặc phát triển màn hình mới, Agent không bắt người dùng đi code mà tự động sinh mã nguồn (scaffolding, form handling, validation, API client), nối dây hoàn chỉnh và cập nhật SSOT.

---

### 2.2. Đi cùng Coder / Dân Tech — Bộ Ba Quyền Năng

Đối với developer, công cụ không phải là một linter khó chịu, mà là một đội ngũ đồng hành đắc lực:

#### 👷 1. Một Ông Worker Chăm Chỉ
- Tự động gánh vác các tác vụ tẻ nhạt: sinh boilerplate, đồng bộ contract OpenAPI/SSOT, sinh mock API server, format code, tạo schema database.
- Tốc độ cao, chuẩn xác 100% theo quy chuẩn kiến trúc đã định nghĩa.

#### 👩‍💼 2. Một Chị BA Sắc Sảo
- **Uốn nắn & Hỏi vặn không ngừng:**
  > *"Này anh, anh bấm nút [Lưu] rồi nếu người dùng bấm tiếp phát nữa trong lúc mạng lag thì sao? Đã có debounce và khóa concurrency chưa?"*  
  > *"Khách sạn này thuộc diện miễn thuế thì công thức trừ hoa hồng có tính VAT vào không? Trong spec chưa thấy anh ghi!"*
- **Ép Coder làm rõ Acceptance Criteria (AC) 4 chiều:**
  1. **Hiển thị (Display & State):** Trạng thái tải (loading), rỗng (empty), quyền xem/ẩn.
  2. **Kiểm tra hợp lệ (Validation):** Ràng buộc định dạng, độ dài, biên giá trị, mã lỗi 422.
  3. **Luồng chuẩn (Happy Path):** Luồng xử lý chính khi mọi dữ liệu hợp lệ.
  4. **Luồng ngoại lệ (Unhappy Path):** Mạng lag, mất quyền, xung đột dữ liệu (409), lỗi hệ thống (500).
- **Quy định rõ Anti-Goals:** Những hành vi nghiêm cấm hệ thống thực hiện.
- **Chuyển hóa ngôn ngữ:** Dịch các thuật ngữ kỹ thuật khô khan thành ngôn ngữ sản phẩm gần gũi với người dùng.

#### 👩‍🔬 3. Một Em Gái QA Kỹ Tính
- **Soi từng ngóc ngách kiểm thử qua các skill chuyên biệt (`/grill-bqa`, `/testcase`, `errorStorming`):**
  > *"Anh code xong API rồi nhưng em test thấy chưa có mã lỗi 422 khi truyền chuỗi rỗng nhé!"*  
  > *"Role Staff có được xem trường này không anh? Em thấy code đang trả về cả mật khẩu đã hash kìa, sửa ngay đi!"*
- **Tự động lập ma trận kiểm thử (`TC-*.yaml`):**
  - Rà soát an toàn bảo mật RBAC, IDOR, rò rỉ dữ liệu nhạy cảm.
  - Kiểm tra trạng thái rỗng (empty state), phân trang, bộ lọc biên.
  - Quét bão lỗi hệ thống (**Error Storming Matrix**: 400, 401, 403, 404, 409, 422, 500).
- **Bắt chặt các case biên đặc biệt:** Đảm bảo code chạy ổn định dưới điều kiện tải, mất kết nối, dữ liệu dị biệt.

---

## 3. Kiến Trúc Cấu Trúc SSOT Không Thể Phá Vỡ (Inviolable Laws)

Để hiện thực hóa mục tiêu trên mà không bị thoái hóa chất lượng:

| Nguyên tắc | Mô tả chi tiết |
| :--- | :--- |
| **Vị trí Backend API Spec** | Backend API Spec **CHỈ ĐƯỢC PHÉP** nằm tại màn hình tiêu thụ dữ liệu (`surfaces/<surface>/<module>/<screen-feature>/api/01/`). **Tuyệt đối cấm** đặt tại thư mục gốc module (`CMP-*/api/`). |
| **Độ Sâu & Nhịp Độ (Pace Floor)** | Mỗi phiên phân tích `/trace` hoặc `/legacy` chỉ thực hiện cho **đúng 1 Screen Feature (`W-*`)**, kéo dài **30–60 phút** phẫu thuật tỉ mỉ từng dòng code. Nghiêm cấm quét lướt hời hợt cả module. |
| **Bằng Chứng Mã Nguồn Thật** | Mọi đặc tả nghiệp vụ phải có dẫn chứng đường dẫn file và khoảng dòng (`file:line-range`). Cấm đoán mò lịch sử commit git. |
| **Cây Thư Mục VitePress Đầy Đủ** | Menu điều hướng phải hiển thị xuyên suốt: `Surface` $\rightarrow$ `Module (CMP-*)` $\rightarrow$ `Screen Feature` $\rightarrow$ `Spec / Data Model / Design / Cases` + `Backend API Spec` + `User Flows`. |

---

## 4. Định Vị Thương Hiệu Mới — Cạnh Tranh Sòng Phẳng Với "Superpower"

### 4.1. Vì sao cái tên "CoSquad" không còn phù hợp?
- Cái tên **CoSquad** gợi liên tưởng hạn hẹp đến:
  - Một thư viện bảng dữ liệu (Data Grid UI).
  - Một trình vẽ lưu đồ (Flowchart/BPMN).
- Bản chất hiện tại của nền tảng đã vươn lên thành một **Hệ Thần Kinh AI Kỹ Thuật Phần Mềm Toàn Năng**, mang lại **siêu năng lực (Superpower)** cho cả team kỹ thuật lẫn phi kỹ thuật.

### 4.2. Bảng Đề Xuất Tên Mới Đối Trọng

| Tên Đề Xuất | Ý Nghĩa & Điểm Nhấn Thương Hiệu | Khí Chất Cạnh Tranh |
| :--- | :--- | :--- |
| **OmniDev** *(hoặc OmniForge)* | **Omni** (Toàn năng, thấu suốt 5 tầng mã nguồn) + **Dev** (Công xưởng phần mềm). Biểu trưng cho sự hiểu biết toàn diện từ DB đến UI. | Đối trọng trực diện, chuyên nghiệp cho doanh nghiệp lớn. |
| **SuperAgile** | Biến mô hình Agile thành siêu năng lực thực thụ: BA, QA, Dev cùng sở hữu T-shaped capability vượt trội. | Nhấn mạnh vào văn hóa giải phóng sức mạnh đội ngũ. |
| **HyperGrid / HyperDev** | Nâng cấp từ "Flow" lên "Hyper" (Tốc độ vượt bậc, đa chiều). Giữ lại di sản quen thuộc nhưng ở đẳng cấp siêu việt. | Dễ chuyển giao từ thương hiệu cũ. |
| **TitanFlow** *(hoặc TitanDev)* | Sức mạnh khổng lồ của Titan, kiên cố, bất khả xâm phạm về mặt kiểm thử và kiến trúc SSOT. | Cảm giác mạnh mẽ, vững chắc, không lỗi lầm. |
| **CogniForge** | **Cognitive** (Nhận thức, thấu hiểu nghiệp vụ) + **Forge** (Lò luyện code tự động). Tôn vinh khả năng dịch mã máy thành tri thức con người. | Đậm chất AI Agentic Coding tiên tiến. |

> 💡 **Khuyến nghị hàng đầu (Top Pick):**
> 1. **OmniDev** (nếu hướng tới một nền tảng kỹ thuật công nghệ toàn diện).
> 2. **SuperAgile / SuperDev** (nếu muốn đối đầu trực diện với cái tên *Superpower*).
