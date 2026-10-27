# Cấu trúc Workspace & Tài nguyên SSOT

Khi chạy lệnh `coSquad setup [workspace]` và khởi chạy `pnpm docs:build` (hoặc `coSquad build`), CoSquad sinh ra bộ khung cấu trúc **SSOT (Single Source of Truth)** chuẩn mực.

Giao diện web VitePress sẽ đọc trực tiếp các thư mục và file Markdown này trên máy local để toàn bộ team (BA, Dev, QA, Lead) cùng tra cứu và làm việc trên một nguồn thông tin duy nhất.

> [!NOTE]
> **Phân biệt phạm vi tài liệu:**
> Cấu trúc thư mục dưới đây (`overview/`, `architecture/`, `surfaces/`,...) là khung **SSOT của dự án phần mềm mục tiêu** do lệnh `coSquad setup` khởi tạo cho team của bạn để phát triển sản phẩm. Khung này hoàn toàn độc lập với trang tài liệu hướng dẫn sử dụng của bản thân bộ công cụ CoSquad (đã được tinh gọn thành 1 file README duy nhất).

---

## Tổng quan cấu trúc thư mục trên Disk

```text
my-workspace/
├── overview/               # Tầm nhìn, mục tiêu sản phẩm và phạm vi phát hành
├── architecture/           # Tài liệu kiến trúc hệ thống chuẩn Arc42 & ERD
├── surfaces/               # Phân vùng bề mặt ứng dụng, màn hình & common
│   ├── common/             # UI Patterns, model-data, rules dùng chung hệ thống (1 cấp phẳng .md)
│   └── <surface-name>/     # Từng bề mặt nghiệp vụ cụ thể (admin, portal, mobile,...)
│       ├── common/         # (Tùy chọn) Dùng chung trong surface (tự động ẩn nếu rỗng)
│       └── <module-name>/  # Module nghiệp vụ ({surfaceCode}-{id}, e.g. ADM-01)
│           ├── common/     # (Tùy chọn, tự động ẩn nếu rỗng)
│           ├── user-flows/ # Các User Flows có Step 1 bắt đầu tại module này (tự động ẩn nếu rỗng)
│           └── <feature>/  # Tính năng (S-*, J-*, H-* phẳng 1 cấp, chứa bundle.yaml & spec.md)
├── .coSquad/registries/   # Danh mục Design Tokens, UI Components và Capabilities trong Workspace SSOT
├── qa/                     # Hòm thư giải quyết thắc mắc nghiệp vụ giữa các thành viên
├── source-code/            # Mã nguồn chính đang hoạt động & phát triển (Submodules)
└── source-legacy/          # Mã nguồn cũ phục vụ khảo cổ (STRICTLY READ-ONLY)
```

---

## Ý nghĩa từng thư mục hiển thị trên Docs Web

### 1. `overview/` — Tầm nhìn & Phạm vi sản phẩm
- **Nội dung:** Chứa file `overview/index.md` định nghĩa tổng quan về sản phẩm.
- **Vai trò:**
  - Định nghĩa mục tiêu kinh doanh, bài toán sản phẩm cần giải quyết.
  - Phân loại các nhóm người dùng (*Actors & Personas*).
  - Ranh giới phạm vi tính năng theo từng mốc phát hành (Release Scope / Milestones).
- **Người phụ trách chính:** Product Owner (PO), Business Analyst (BA), Project Manager.

### 2. `architecture/` — Kiến trúc hệ thống (Chuẩn Arc42)
- **Nội dung:** Khung tài liệu kiến trúc kỹ thuật tiêu chuẩn quốc tế Arc42 gồm trọn vẹn **12 phân hệ chuyên sâu** cùng mô hình dữ liệu lõi:
  - **`01-introduction/` (Giới thiệu, Mục tiêu & Hotspots):** Tổng quan bối cảnh hệ thống, mục tiêu kinh doanh cốt lõi, phạm vi kỹ thuật và phân tích các vùng rủi ro cao (*Technical Hotspots* / điểm nghẽn chịu tải, các module nghiệp vụ phức tạp nhất).
  - **`02-constraints/` (Ràng buộc kiến trúc):** Các ràng buộc kỹ thuật bất biến: công nghệ bắt buộc, giới hạn phần cứng, hạ tầng mạng, ngân sách, quy chuẩn tuân thủ pháp lý (GDPR, ISO, PCI-DSS) và tiêu chuẩn văn hóa tổ chức.
  - **`03-user-flows/` (Bối cảnh hệ thống & Luồng nghiệp vụ vĩ mô):**
    > **Phân biệt rạch ròi với `surfaces/<surface>/<module>/user-flows/`:**
    > - **`architecture/03-user-flows/`** là **Luồng nghiệp vụ tổng thể cấp hệ thống (Macro System Flows / System Context)**. Mô tả quy trình vận hành dữ liệu giữa các dịch vụ, các bounded context, hệ thống phụ hoặc đối tác bên thứ ba (ví dụ: chu trình đối soát thanh toán ngân hàng, luồng đồng bộ đơn hàng sang ERP, luồng xử lý async event-driven qua Message Queue). Tập trung vào giao thức kỹ thuật, logic dữ liệu và sự tương tác giữa các hệ thống — **hoàn toàn độc lập và không phụ thuộc vào giao diện hay màn hình người dùng**.
    > - Trong khi đó, **`surfaces/<surface>/<module>/user-flows/`** là **Hành trình thao tác trực tiếp của người dùng (UI User Journeys)**. Gắn liền với các màn hình, tương tác giao diện (click button, submit form, navigation, hiển thị modal/thông báo) xuyên qua các bề mặt ứng dụng (`portal`, `admin`, `mobile`).
  - **`04-solution-strategy/` (Chiến lược giải pháp):** Các quyết định chiến lược định hình cấu trúc toàn hệ thống: lựa chọn mô hình kiến trúc (Clean Architecture, DDD, Event-Driven, Microservices vs Monolith), chiến lược phân vùng dữ liệu (SQL vs NoSQL), chiến lược cache đa tầng và sơ đồ luồng dữ liệu (*Data Flow Mermaid*).
  - **`05-building-blocks/` (Khối cấu trúc tĩnh / Building Block View):** Phân rã cấu trúc tĩnh của hệ thống theo cấp độ (C4 Model Containers & Components): danh sách các service, module, thư viện nội bộ, trách nhiệm của từng khối và quan hệ phụ thuộc tĩnh giữa chúng.
  - **`06-runtime/` (Khung cảnh thời gian thực / Runtime View):** Mô tả hành vi động và tương tác runtime giữa các khối kiến trúc trong các kịch bản quan trọng: sơ đồ tuần tự (*Sequence Diagram*), luồng khởi động hệ thống, cơ chế đồng bộ/bất đồng bộ, xử lý tranh chấp dữ liệu khi concurrency cao.
  - **`07-deployment/` (Kiến trúc triển khai / Deployment View):** Mô tả hạ tầng máy chủ vật lý/ảo hóa, các môi trường (Dev, Staging, Production), cấu hình container (Docker, Kubernetes), mạng (VPC, Load Balancer, CDN, API Gateway) và quy trình tự động hóa CI/CD.
  - **`08-cross-cutting/` (Các quy chuẩn xuyên suốt / Cross-Cutting Concepts):** Bộ tài liệu quy chuẩn kỹ thuật áp dụng thống nhất cho toàn bộ hệ thống:
    - `security.md`: Cơ chế xác thực (Authentication), phân quyền (RBAC/ABAC), mã hóa dữ liệu (at-rest & in-transit), phòng chống tấn công OWASP.
    - `integration.md`: Quy tắc gọi API nội bộ và tích hợp bên thứ ba (REST, gRPC, Webhook, Retry, Circuit Breaker).
    - `observability.md`: Tiêu chuẩn ghi log tập trung, theo dõi số liệu (Metrics) và truy vết phân tán (Tracing OpenTelemetry).
    - `conventions.md`: Coding convention, quy tắc đặt tên, cấu trúc commit Git và quy trình Review/PR.
    - `configuration.md`: Cơ chế quản lý biến môi trường, bảo mật secrets (Vault, Secrets Manager) và dynamic configuration.
  - **`09-decisions/` (Sổ quyết định kiến trúc — ADR):** Lưu trữ các bản ghi quyết định kiến trúc (*Architecture Decision Records* — `ADR-{NNN}-{slug}.md`). Ghi nhận lại bối cảnh, các phương án cân nhắc, lý do đưa ra quyết định kỹ thuật và hệ quả của nó — giúp toàn team hiểu rõ "vì sao hệ thống lại làm như vậy".
  - **`10-quality/` (Mục tiêu chất lượng):** Yêu cầu phi chức năng (Non-Functional Requirements - NFR) được lượng hóa cụ thể: thời gian phản hồi (p95, p99 latency), thông lượng chịu tải (Throughput/RPS), tính sẵn sàng (Availability 99.99%), khả năng mở rộng (Scalability) và khả năng phục hồi thảm họa (Disaster Recovery RTO/RPO).
  - **`11-risks/` (Rủi ro & Nợ kỹ thuật — Risk Register):** Sổ theo dõi rủi ro kiến trúc (*Risk Register*), các điểm nghẽn tiềm ẩn và danh mục nợ công nghệ (*Technical Debt*) kèm theo phương án dự phòng và lộ trình khắc phục.
  - **`12-glossary/` (Từ điển thuật ngữ):** Chuẩn hóa ngôn ngữ chung (*Ubiquitous Language*): định nghĩa chính xác và thống nhất các thuật ngữ chuyên ngành kỹ thuật và danh từ nghiệp vụ trong dự án, đảm bảo PO, BA, Dev, QA và AI Agent đều hiểu đúng một nghĩa duy nhất, triệt tiêu mọi nhầm lẫn.
  - **`model/` (Mô hình dữ liệu & C4 DSL):**
    - `data-models.md`: Sơ đồ thực thể quan hệ ERD (`erDiagram` Mermaid) định nghĩa toàn bộ bảng, trường dữ liệu, khóa chính/ngoại và quan hệ ràng buộc.
    - `workspace.dsl`: Mô hình cấu trúc kiến trúc hệ thống theo chuẩn C4 Model bằng Structurizr DSL.
- **Vai trò:** Bản đồ kỹ thuật số toàn diện chuẩn quốc tế giúp định hình toàn bộ chuẩn mực kỹ thuật của hệ thống, bảo đảm mọi lập trình viên và Agent AI phát triển mã nguồn đồng nhất, tránh việc mỗi người code một kiểu.
- **Người phụ trách chính:** Solution Architect, Technical Lead.

### 3. `surfaces/` — Phân vùng Bề mặt, Tính năng & Cấu trúc Phẳng
- **Nội dung:** Quản lý toàn bộ cấu trúc giao diện người dùng và nghiệp vụ tương tác, chia thành các bề mặt cụ thể (`admin`, `portal`, `mobile`,...) cùng các module nghiệp vụ (`{surfaceCode}-{id}`) và tính năng/màn hình phẳng 1 cấp (`<feature-slug>/`).
- **Cấu trúc `common/` tinh gọn (1 cấp phẳng .md):**
  - Tại `surfaces/common/`: Chứa các quy tắc dùng chung cho **toàn bộ hệ thống** dưới dạng các file `.md` phẳng (không lồng thư mục con `patterns/`, `yaml/`, `code/`, `data-model/`). Bao gồm: UI Patterns, `model-data.md`, `model-derived-data.md`, `api-health.md`, `ui-empty-state.md`.
  - Tại `surfaces/<surface>/common/` hoặc `<module>/common/`: (Tùy chọn) Chứa quy tắc dùng chung cho riêng surface hoặc module đó. **Tự động ẩn khỏi sidebar VitePress nếu thư mục rỗng**.
- **Cấu trúc `user-flows/` và Quy tắc Phân định Sở hữu (Step 1 Ownership):**
  - **Không để `user-flows/` ở cấp root `surfaces/` hay `<surface>/`**:
    - **Luồng toàn hệ thống / Cross-surface**: Được lưu trữ tập trung tại [`architecture/03-user-flows/FLOW-*.md`](../../architecture/03-user-flows/) dưới dạng Technical `sequenceDiagram`.
    - **Luồng người dùng thuộc Module**: Lưu trữ tại `surfaces/<surface>/<module>/user-flows/FLOW-*.md`.
    - **Quy tắc Step 1 Ownership**: Bước đầu tiên (màn hình bắt đầu trigger luồng) thuộc module nào thì toàn bộ file flow và scenario của luồng đó nằm trong thư mục `user-flows/` của module đó.
    - Thư mục `user-flows/` của module sẽ **tự động ẩn khỏi sidebar VitePress nếu rỗng**.
- **Cấu trúc Màn hình trong Module (Phẳng 1 Cấp — 1-Tier Flat):**
  - Tất cả các màn hình/tính năng trong module đều nằm trực tiếp ở tầng 1: `surfaces/<surface>/<module>/<feature-slug>/` (không chia nhỏ 3 cấp số như `01/01/02`).
  - Màn hình phụ/con (Create, Edit, Detail, Drawer) khai báo rõ luồng truy cập trong §1 Overview của spec (VD: "Vào từ màn hình danh sách ➔ Bấm nút [Tạo mới]").
- **Người phụ trách chính:** BA, Frontend Dev, Backend Dev, QA.

### 4. `.coSquad/registries/` — Danh mục Linh kiện & Capabilities dùng chung (Workspace SSOT)
- **Nội dung:** Chứa các file từ điển JSON (`design.registry.json`, `be-capabilities.registry.json`). Toàn bộ lưu trữ tập trung tại Workspace SSOT, không lưu vào repo code.
- **Vai trò:**
  - Lưu trữ danh sách các linh kiện giao diện sẵn có của dự án (`components/ui`, layout, buttons, table).
  - Lưu trữ danh mục các capability/service backend có thể tái sử dụng.
  - Giúp Agent AI nhận diện được những gì dự án đã có để ưu tiên tái sử dụng, không sinh thừa hoặc cảnh báo sai.

### 5. `qa/` — Hòm thư Thắc mắc & Đóng câu hỏi
- **Nội dung:** Chứa file `qa/index.md` tổng hợp các câu hỏi mở (*Open Questions*).
- **Vai trò:**
  - Nơi QA hoặc Dev ghi nhận các điểm mơ hồ về mặt nghiệp vụ khi đọc spec.
  - BA hoặc PO phản hồi và chốt phương án trực tiếp tại đây với skill `/qa`.
  - Đảm bảo mọi thắc mắc đều có lời giải đáp và được lưu vết rõ ràng trước khi đóng tính năng.

---

## Hai thư mục Mã nguồn trong Workspace

| Thư mục | Trạng thái | Mục đích & Quy tắc |
| :--- | :--- | :--- |
| **`source-code/`** | **Read / Write** | Chứa các repository mã nguồn chính đang chạy (FE, BE, Microservices). Đây là nơi toàn bộ code mới sinh ra và các thay đổi được commit. |
| **`source-legacy/`** | **Strictly READ-ONLY** | Chứa mã nguồn cũ để phục vụ việc khảo cổ nghiệp vụ trong kịch bản Rebase. **Tuyệt đối cấm sửa đổi hoặc copy code thô** từ thư mục này. |

---

## Quy ước Đặt ID Chuẩn cho Artifacts trong Hệ Thống (ID Naming Conventions & Taxonomy)

Nhằm đảm bảo sự ngắn gọn, tiện dụng, giúp các thành viên trong team (BA, Dev, QA, PO) dễ dàng trao đổi, đối chất và truy vết chéo (*traceability*) mà không bị rườm rà dài dòng, CoSquad áp dụng quy chuẩn đánh ID thống nhất cho toàn bộ artifacts:

### 1. Phân cấp Surface (Kênh / Cổng ứng dụng)
- **Quy tắc:** Không cần đánh ID số. Sử dụng **Tên Surface** + **Mã viết tắt (`surfaceCode`)** (từ 1 đến 4 chữ cái in hoa).
- **Ví dụ:**
  - `admin` $\rightarrow$ `ADM` (hoặc `AD`)
  - `tenant` $\rightarrow$ `TA`
  - `line` $\rightarrow$ `L`
  - `customer` $\rightarrow$ `CUS`
  - `merchant` $\rightarrow$ `MER`

### 2. Phân hệ Nghiệp vụ / Module
- **Cấu trúc:** `{surfaceCode}-{id}`
- **Quy tắc:** Mỗi module trong từng Surface được đánh số thứ tự gồm **2 chữ số**, tăng dần bắt đầu từ `01`.
- **Ví dụ:**
  - `ADM-01` (Module Xác thực & Quản trị tài khoản)
  - `ADM-02` (Module Quản lý Đơn hàng)
  - `TA-01`, `TA-02` (Các module thuộc Surface Tenant)

### 3. Tính năng / Feature trực thuộc Module
Trong mỗi module, các tính năng được phân biệt bằng **tiền tố 1 chữ cái**, và **chuỗi số tăng dần là thống nhất (Unified Sequence) bắt đầu từ 01**:
- **`S-*` (Screen - Màn hình giao diện):** `S-{surfaceCode}-{idModule}-{idFeature}`
  - Ví dụ: `S-ADM-01-01` (Màn hình Danh sách Đơn hàng), `S-ADM-01-02` (Màn hình Tạo & Chỉnh sửa Đơn hàng).
- **`J-*` (Job - Tiến trình xử lý tự động / Background Worker / Console Cron):** `J-{surfaceCode}-{idModule}-{idFeature}`
  - Ví dụ: `J-ADM-01-03` (Job đồng bộ trạng thái đơn hàng định kỳ).
- **`H-*` (Hook - Tích hợp webhook / Outbound 3rd-party API Hook):** `H-{surfaceCode}-{idModule}-{idFeature}`
  - Ví dụ: `H-ADM-01-04` (Webhook nhận thông báo thanh toán từ cổng thanh toán bên thứ ba).
- **Quy tắc Tăng số Không Trùng lặp (Unified Sequence Principle):**
  - Số thứ tự tính năng `{idFeature}` tăng liên tục từ `01` cho tất cả các loại feature trong cùng một module.
  - *Ví dụ:* Nếu module `ADM-01` đã có màn hình `S-ADM-01-01` và `S-ADM-01-02`, thì Job tiếp theo **không được** đánh là `J-ADM-01-01` mà bắt buộc phải tăng lên `J-ADM-01-03`, Hook tiếp theo là `H-ADM-01-04`.
- **API Nội bộ (Internal APIs):**
  - Khai báo theo HTTP Method + Route trong `01-backend-spec.yaml` (ví dụ `GET /admin/orders`), có thể dùng tiền tố `API` hoặc không cần đánh ID riêng nếu là API nội bộ phục vụ trực tiếp màn hình đó.

### 4. Thông điệp, Cảnh báo & Popup Xác nhận (Messages & Alerts)
- **Quy tắc:** Các text label thông thường của form item (nhãn trường, placeholder, tiêu đề cột) **không cần đánh ID**.
- **Bắt buộc đánh ID:** Đối với tất cả **Alert thông báo** (thành công, cảnh báo), **Message lỗi** (validate form, lỗi xử lý process, lỗi hệ thống), và **Modal Popup confirm / dialog thông báo**:
  - **Cấu trúc:** `Msg-{surfaceCode}-{idModule}-{idScreen}-{idMsg}` (mỗi chỉ số gồm 2 chữ số).
  - **Ví dụ:**
    - `Msg-ADM-01-01-01`: "Vui lòng nhập ngày bắt đầu trước ngày kết thúc" (Lỗi validate form lọc của màn hình S-ADM-01-01).
    - `Msg-ADM-01-01-02`: "Bạn có chắc chắn muốn hủy đơn hàng này không?" (Confirm popup hủy đơn).
    - `Msg-ADM-01-01-03`: "Hủy đơn hàng thành công" (Toast thông báo kết quả).

### 5. Chức năng Xuất / Tải File (Export & Download Files)
- **Cấu trúc:** `F-{surfaceCode}-{idModule}-{idFile}` (mỗi chỉ số gồm 2 chữ số).
- **Ý nghĩa:** Định danh các chức năng xuất dữ liệu báo cáo (Excel, CSV, PDF) hoặc template download import dữ liệu.
- **Ví dụ:**
  - `F-ADM-01-01`: File Excel báo cáo doanh thu theo kỳ.
  - `F-ADM-01-02`: File mẫu CSV import danh sách đơn hàng đối soát.

### 6. Luồng Người Dùng (User Flows)
- **Cấu trúc:** `flow-{surfaceCode}-{idModule}-{id}` (chữ thường hoặc không phân biệt hoa thường, 2 chữ số mỗi phần).
- **Quy tắc Phân định:** Áp dụng nguyên tắc **Step 1 Ownership** — bước đầu tiên của luồng bắt đầu tại module nào thì file luồng lưu trữ tại `surfaces/<surface>/<module>/user-flows/flow-{surface}-{module}-{id}.md`.
- **Ví dụ:**
  - `flow-adm-01-01`: Luồng đăng nhập và cấp lại mật khẩu quản trị viên.
  - `flow-ta-02-01`: Luồng thanh toán và xuất hóa đơn điện tử cho tenant.

### 7. Tài nguyên Dùng Chung Qua 3 Tầng Kiến Trúc (Common Resources: `G-*` và `C-*`)
Nhằm phân định rõ ràng giữa linh kiện/logic dùng chung với tính năng nghiệp vụ độc lập, CoSquad quy định tiền tố cho 3 tầng Common:

#### 7.1. Tầng 1 — Global Common (`surfaces/common/`): Tiền tố `G-` (Global)
Áp dụng cho toàn bộ các surface trong hệ thống:
- **API dùng chung toàn hệ thống:** `G-API-{id}` (ví dụ: `G-API-01`, `G-API-02`) — API health check, xác thực token hệ thống.
- **UI dùng chung (Modal, Bảng, Dialog quy thành Screen cho tiện):** `G-S-{id}` (ví dụ: `G-S-01`, `G-S-02`) — Modal confirm xác nhận chung, modal confirm xóa bản ghi, layout báo lỗi hệ thống.
- **Message dùng chung cho tất cả surface:** `G-Msg-{id}` (ví dụ: `G-Msg-01`, `G-Msg-02`) — Cảnh báo bảo trì hệ thống, thông báo hết phiên đăng nhập.
- **Helper, Status, Error Code, Enum dùng chung:** `G-{id}` (ví dụ: `G-01`, `G-02`) — Danh mục mã lỗi HTTP chuẩn, hàm format tiền tệ, timezone converter.
- *(Lưu ý: Tầng Global Common không có Hook, Job hay Feature riêng lẻ).*

#### 7.2. Tầng 2 — Surface Common (`surfaces/<surface>/common/`): Tiền tố `C-` (Common)
Dùng chung nội bộ trong một Surface nhất định:
- **API dùng chung Surface:** `C-API-{surfaceCode}-{id}` (ví dụ: `C-API-ADM-01`, `C-API-ADM-02`) — API lấy danh mục menu của admin, API hồ sơ cá nhân surface.
- **UI dùng chung Surface (Modal, Bảng quy thành Screen):** `C-S-{surfaceCode}-{id}` (ví dụ: `C-S-ADM-01`, `C-S-ADM-02`) — Khung bộ lọc đa năng cho admin, drawer xem log hoạt động admin.
- **Message dùng chung Surface:** `C-Msg-{surfaceCode}-{id}` (ví dụ: `C-Msg-ADM-01`, `C-Msg-ADM-02`) — Thông báo từ chối quyền truy cập cấp surface.
- **Helper, Status, Error Code của Surface:** `C-{surfaceCode}-{id}` (ví dụ: `C-ADM-01`, `C-ADM-02`) — Hàm phân quyền vai trò admin, danh mục màu sắc trạng thái admin.

#### 7.3. Tầng 3 — Module Common (`surfaces/<surface>/<module>/common/`): Tiền tố `C-` (Module Common)
Dùng chung nội bộ trong một Module nhất định:
- **API dùng chung Module:** `C-API-{surfaceCode}-{idModule}-{id}` (ví dụ: `C-API-ADM-01-01`, `C-API-ADM-01-02`) — API tính toán nhanh tiền đơn hàng trong module đơn hàng.
- **UI dùng chung Module (Modal, Bảng quy thành Screen):** `C-S-{surfaceCode}-{idModule}-{id}` (ví dụ: `C-S-ADM-01-01`, `C-S-ADM-01-02`) — Modal lịch sử trạng thái đơn hàng, modal chọn sản phẩm kèm theo.
- **Message dùng chung Module:** `C-Msg-{surfaceCode}-{idModule}-{id}` (ví dụ: `C-Msg-ADM-01-01`, `C-Msg-ADM-01-02`) — Thông báo yêu cầu nhập lý do hủy đơn.
- **Helper, Status, Error Code của Module:** `C-{surfaceCode}-{idModule}-{id}` (ví dụ: `C-ADM-01-01`, `C-ADM-01-02`) — Hàm kiểm tra điều kiện chuyển trạng thái đơn hàng.

### 8. Tài nguyên Kiểm thử (QA & Test Artifacts)
- **`TC-*` (Test Case):** `TC-{surfaceCode}-{idModule}-{idTC}`
  - Ví dụ: `TC-ADM-01-01` (Kiểm thử phân trang danh sách đơn hàng), `TC-ADM-01-02` (Kiểm thử validate form tạo mới).
- **`SC-*` (Scenario - Kịch bản luồng kiểm thử tích hợp / E2E):** `SC-{surfaceCode}-{idModule}-{idSC}`
  - Ví dụ: `SC-ADM-01-01` (Kịch bản duyệt đơn hàng và tự động kích hoạt Job giao vận).

---

### Bảng Tổng Hợp Mã Định Danh (ID Taxonomy Cheatsheet)

| Tiền tố / Mẫu ID | Phạm vi & Loại Artifact | Ví dụ minh họa | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `{SURF}` | Surface (Kênh / Cổng) | `ADM`, `TA`, `L`, `CUS` | Viết tắt Surface (Admin, Tenant, Line, Customer) |
| `{SURF}-{NN}` | Module nghiệp vụ | `ADM-01`, `TA-02` | Module thứ 01 của Surface Admin |
| `S-{SURF}-{NN}-{MM}` | Màn hình giao diện (Screen) | `S-ADM-01-01` | Màn hình thứ 01 thuộc module ADM-01 |
| `J-{SURF}-{NN}-{MM}` | Job xử lý tự động / Cron | `J-ADM-01-03` | Background job thứ 03 thuộc module ADM-01 |
| `H-{SURF}-{NN}-{MM}` | API Hook / Tích hợp ngoài | `H-ADM-01-04` | Webhook tích hợp thứ 04 thuộc module ADM-01 |
| `flow-{SURF}-{NN}-{MM}` | Luồng người dùng (User Flow) | `flow-adm-01-01` | Luồng nghiệp vụ thứ 01 bắt đầu tại module ADM-01 |
| `Msg-{SURF}-{NN}-{MM}-{KK}` | Alert, Validate Error, Confirm Popup | `Msg-ADM-01-01-01` | Message thông báo/lỗi thứ 01 trên màn hình S-ADM-01-01 |
| `F-{SURF}-{NN}-{MM}` | File export / Template download | `F-ADM-01-01` | Mẫu xuất file Excel/PDF thứ 01 của module ADM-01 |
| `G-API-{NN}` | Global Common API | `G-API-01` | API dùng chung thứ 01 cho toàn hệ thống |
| `G-S-{NN}` | Global Common UI (Modal/Table) | `G-S-01` | Màn hình/Modal dùng chung thứ 01 toàn hệ thống |
| `G-Msg-{NN}` | Global Common Message | `G-Msg-01` | Message dùng chung thứ 01 toàn hệ thống |
| `G-{NN}` | Global Common Helper/Status | `G-01` | Helper/Status code dùng chung thứ 01 toàn hệ thống |
| `C-API-{SURF}-{NN}` | Surface Common API | `C-API-ADM-01` | API dùng chung thứ 01 của Surface Admin |
| `C-S-{SURF}-{NN}` | Surface Common UI (Modal/Table) | `C-S-ADM-01` | Màn hình/Modal dùng chung thứ 01 Surface Admin |
| `C-Msg-{SURF}-{NN}` | Surface Common Message | `C-Msg-ADM-01` | Message dùng chung thứ 01 Surface Admin |
| `C-{SURF}-{NN}` | Surface Common Helper/Status | `C-ADM-01` | Helper/Status code thứ 01 Surface Admin |
| `C-API-{SURF}-{NN}-{KK}` | Module Common API | `C-API-ADM-01-01` | API dùng chung thứ 01 của Module ADM-01 |
| `C-S-{SURF}-{NN}-{KK}` | Module Common UI (Modal/Table) | `C-S-ADM-01-01` | Màn hình/Modal dùng chung thứ 01 Module ADM-01 |
| `C-Msg-{SURF}-{NN}-{KK}` | Module Common Message | `C-Msg-ADM-01-01` | Message dùng chung thứ 01 Module ADM-01 |
| `C-{SURF}-{NN}-{KK}` | Module Common Helper/Status | `C-ADM-01-01` | Helper/Status code thứ 01 Module ADM-01 |
| `TC-{SURF}-{NN}-{MM}` | Test Case kiểm thử | `TC-ADM-01-01` | Ca kiểm thử thứ 01 thuộc module ADM-01 |
| `SC-{SURF}-{NN}-{MM}` | Scenario kịch bản kiểm thử luồng | `SC-ADM-01-01` | Kịch bản luồng E2E thứ 01 thuộc module ADM-01 |

