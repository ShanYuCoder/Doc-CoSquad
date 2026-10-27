---
name: build-env
description: "/build-env — Tự động thiết lập môi trường Docker chuẩn hóa để chạy dự án cục bộ, hỗ trợ cả chế độ Central Gateway lẫn chế độ Full Standalone độc lập."
disable-model-invocation: true
---

# /build-env — Thiết lập Môi trường Chạy Mã nguồn Cục bộ (Docker Environment)

## 1. Triết lý thiết kế: Tính linh hoạt toàn cầu & Tri thức Gateway tổng hợp sẵn

CoSquad là công cụ mã nguồn mở công khai, được thiết kế cho các lập trình viên trên toàn cầu sử dụng đa dạng hệ điều hành (**Linux, macOS, Windows/WSL**).

### A. Tuyệt đối không quét/điều tra máy chủ (Zero Host-Gateway Sniffing)
- **Quy tắc bất biến:** Agent **TUYỆT ĐỐI KHÔNG** quét các đường dẫn trên máy chủ (như `~/gateway`, `C:\gateway`, hay `/home/*`), và **KHÔNG ĐƯỢC** cố truy cập mạng Docker máy chủ hoặc đọc file `routes.json` của máy host.
- CoSquad không thể và **không cần biết** máy chủ của thành viên hiện có những route nào.
- CoSquad cũng không mặc định rằng mọi người dùng đều đã cài đặt gateway hoặc đặt gateway ở một đường dẫn cố định.

### B. Tri thức tổng hợp sẵn về cấu trúc Gateway (Pre-Synthesized Knowledge)
Thay vì quét động môi trường của máy host, CoSquad tổng hợp sẵn **mô hình kiến trúc Gateway chuẩn doanh nghiệp** (đúc kết từ các mẫu thực chiến như `docker-external` và `docker-gateway`):
- **Định tuyến HTTP/HTTPS & Chứng chỉ SSL Wildcard:** Reverse proxy Nginx (`gateway-nginx` cổng 80/443 với TLS wildcard `*.local.com`).
- **Cơ sở dữ liệu quan hệ:** MySQL 8.4 (`mysql:3306`), MySQL 8.0 (`mysql-80:3306`), PostgreSQL 17 (`postgres:5432` / bí danh `saas-postgres`).
- **Cache & Key-Value:** Redis 7 (`redis:6379`).
- **Object Storage & Cloud Mock (S3 / SQS / SNS):** LocalStack 3.7 (`localstack:4566`) + Giao diện quản lý StackPort (`stackport:8080` / `https://stackport.local.com`). *LocalStack giả lập S3 chuẩn; dự án KHÔNG tự ý dựng thêm MinIO.*
- **Giao diện quản trị Database:** phpMyAdmin (`phpmyadmin`), pgAdmin 4 (`pgadmin`), Redis Commander (`redis-commander`).
- **Công cụ kiểm thử & Giả lập:** Mailpit (`mailpit` cổng SMTP 1025 / Web UI 8025 / `http://mail.local.com`), Mock API (`mock-api:4000`).
- **Mạng Gateway dùng chung (`GATEWAY_NETWORK_NAME`):**
  - **Lưu ý quan trọng về Network:** Tên mạng như `base_shared_net` chỉ là ví dụ từ cấu hình cá nhân của tác giả, hoàn toàn không phải chuẩn cố định toàn cục.
  - Network dùng chung này được định nghĩa trực tiếp trong **file `.env` của chính Gateway** trên máy của lập trình viên (hoặc do team hạ tầng quy định).
  - File `docker/.env` của dự án để mặc định `GATEWAY_NETWORK_NAME=base_shared_net` như một placeholder gợi ý.
  - **Yêu cầu member tự điều chỉnh:** Khi thiết lập dự án, member PHẢI mở file `.env` của Gateway trên máy mình ra kiểm tra xem tên mạng thực tế là gì, rồi cấu hình biến `GATEWAY_NETWORK_NAME` trong `docker/.env` của dự án cho chuẩn khớp với bên đó thì các container mới join mạng được.

---

## 2. Khảo cổ Docker: Tái sử dụng, Bóc tách Monolith & Phân lập Dịch vụ

> [!CRITICAL]
> **5 NGUYÊN TẮC BẤT BIẾN KHI KHẢO CỔ VÀ PHÂN LẬP CONTAINER:**
> 1. **KHÔNG SAI LỆCH PHIÊN BẢN (ZERO VERSION DRIFT):** Tuyệt đối không tự ý dùng image mới nhất khi dự án cũ đã có Dockerfile cố định phiên bản và extensions qua các thư mục môi trường (`local/`, `dev/`, `stg/`, `prod/`, `_docker/`).
> 2. **DỰNG MỚI DOCKERFILE RIÊNG (CHỈ THAM KHẢO — CẤM DÙNG LẠI HAY TRỎ ĐƯỜNG DẪN CŨ):**
>    - Kể cả khi dự án cũ đã có sẵn Dockerfile hoặc member yêu cầu "lấy theo docker cũ", cấu hình Docker cũ **CHỈ ĐƯỢC DÙNG LÀM TÀI LIỆU THAM KHẢO KỸ THUẬT** (để bóc tách chính xác phiên bản runtime, base OS, các thư viện hệ thống và extensions/modules biên dịch).
>    - Agent **TUYỆT ĐỐI CẤM** trỏ `build.dockerfile` vào đường dẫn cũ của dự án (ví dụ `dockerfile: local/octane/Dockerfile` hay `dockerfile: ../source-code/Dockerfile`), và **CẤM** copy/symlink nguyên si file Dockerfile cũ vào `docker/`.
>    - Agent **BẮT BUỘC PHẢI VIẾT MỚI DOCKERFILE RIÊNG** chuẩn hóa và độc lập trong `<workspace>/docker/<service>/Dockerfile` cho từng service cần build (ví dụ `docker/php/Dockerfile`, `docker/octane/Dockerfile`, `docker/api/Dockerfile`).
> 3. **BÓC TÁCH HẠ TẦNG RA KHỎI MONOLITH TẤT-CẢ-TRONG-MỘT:** Nếu Dockerfile cũ đóng gói Nginx + PHP + MySQL + Redis vào 1 container, Agent PHẢI bóc tách hạ tầng (Nginx chuyển cho Gateway; MySQL/Redis dùng Gateway hoặc service DB riêng). Dùng lại Dockerfile cũ tiềm ẩn rủi ro cực lớn vì các dự án cũ thường nhồi nhét tất cả service vào 1 file, phá vỡ kiến trúc phân lập service của CoSquad.
> 4. **CHỐNG GỘP NHẦM DỊCH VỤ (ANTI-CONSOLIDATION) & TÔN TRỌNG THỰC TẾ:**
>    - **Tuyệt đối không gộp các dịch vụ khác nhau chỉ vì chung ngôn ngữ/framework:** Nếu dự án định nghĩa nhiều service khác nhau (ví dụ: `octane` chạy Swoole cổng 8000 làm môi trường dev mock/high-performance và `php` chạy PHP-FPM cổng 9000 quản lý bởi supervisord; hoặc Node `frontend` và Node `mock-api`; hoặc Python `api` và Python `worker`), Agent **BẮT BUỘC PHẢI GIỮ RIÊNG TỪNG SERVICE ĐÓ TRONG DOCKER-COMPOSE**. Nghiêm cấm tự ý gộp chúng vào một container "backend" chung.
>    - **Không tự ý xé nhỏ vô căn cứ (Zero Fabrication):** Không tự bịa thêm các container rời rạc như `worker`, `scheduler` nếu mã nguồn dự án đã quản lý chúng qua `supervisord` bên trong container ứng dụng hoặc không hề định nghĩa chúng.
> 5. **BẢO TOÀN 100% CẤU TRÚC PHÂN TÁCH DỊCH VỤ TỪ MÃ NGUỒN CŨ:**
>    - File `docker/docker-compose.yml` mới **BẮT BUỘC PHẢI DUY TRÌ ĐẦY ĐỦ TỪNG SERVICE ỨNG DỤNG** được phát hiện từ cấu hình của repo qua mọi môi trường (`local/`, `dev/`, `stg/`, `prod/`).
>    - Bảo toàn ranh giới dịch vụ là yêu cầu dung sai bằng 0.

**[QUY TẮC BẮT BUỘC] Quy trình Ưu tiên & Đối chiếu Chéo 3 Lớp ("Tâm thế Cảnh giác: Phòng ngừa Bẫy Legacy"):**
Để phục vụ trơn tru mọi thể loại dự án (dù có cấu hình Docker đa môi trường hay dự án chưa hề có Docker / thiếu file môi trường), Agent BẮT BUỘC thực thi tuần tự 3 tầng khảo cổ & đối chiếu chéo sau:

> [!CAUTION]
> **TÂM THẾ CẢNH GIÁC CAO ĐỘ ("Phòng Ngừa Bẫy Legacy"):**
> Tuyệt đối không bao giờ tin tưởng mù quáng vào `.env.example` hay các file compose cũ!
> - Với các dự án thực tế: Dù có Docker ở các môi trường nhưng `.env.example` lại rất hay thiếu các tham số runtime mà code thực tế bắt buộc phải có.
> - Với nhiều dự án: `.env.example` thiếu hẳn một loạt tham số cốt lõi hoặc chỉ chứa giá trị mẫu tượng trưng — nếu agent ngây thơ dò theo `.env.example` thì chắc chắn sẽ sập ngay ("trace theo là tèo").
> - Các team phát triển legacy trước đó thường để lại nợ kỹ thuật (tech debt), quên cập nhật file mẫu, hoặc hardcode biến môi trường trong code. Agent phải luôn giữ tâm thế cảnh giác và dùng chính mã nguồn thực tế để kiểm chứng đối chiếu!

1. **Tầng 1 (Kiểm tra Dấu hiệu & Phân tích Mục tiêu Docker):**
   - Rà soát toàn bộ repo xem có dấu vết Docker: `local/`, `dev/`, `stg/`, `prod/`, `_docker/`, `deploy/`, `infra/`, root `Dockerfile*`, `docker-compose*.yml`.
   - Phân tích mục tiêu kiến trúc: Runtime chính là gì (Swoole/Octane vs PHP-FPM, Vite vs Webpack, Uvicorn vs Gunicorn), phiên bản ngôn ngữ/hệ điều hành gốc, các thư viện/extensions hệ thống, và ranh giới các service độc lập (`octane` Swoole :8000, `php` FPM :9000, `meilisearch` :7700).
   - *Cảnh giác:* Bóc tách monolith (Nginx, DB) ra khỏi app container; không tự ý bịa thêm worker nếu `supervisord` đã quản lý.
2. **Tầng 2 (Khảo sát Cấu hình Môi trường & Manifests):**
   - Đọc các file mẫu: `.env.example`, `.env.dist`, `.env.local.example`, `composer.json`, `package.json`, `pyproject.toml`, `go.mod`.
   - Thu thập danh mục biến môi trường sơ bộ, cổng lắng nghe mặc định và các thư viện phụ thuộc.
   - *Cảnh giác (CỰC KỲ QUAN TRỌNG):* Chỉ coi Tầng 2 là **bản nháp chưa được kiểm chứng**, tuyệt đối không coi là chân lý. Đi thẳng vào việc sinh file chỉ dựa trên `.env.example` sẽ khiến container crash khi chạy tính năng.
3. **Tầng 3 (Khảo Cổ & Đối Chiếu Chéo Mã Nguồn Sâu — "Phòng Ngừa Bẫy Legacy"):**
   - Mã nguồn thực tế (active source code) là chân lý kiểm chứng tối thượng. Agent PHẢI quét grep toàn bộ code để tìm tất cả các lệnh đọc biến môi trường xuyên suốt mọi ngôn ngữ (`env()`, `config()`, `process.env.*`, `os.environ.get()`, `os.Getenv()`, `@Value`).
   - **Ma trận Phân loại Hạ tầng Toàn diện (Universal Infrastructure Taxonomy):** Bóc tách thư mục cấu hình Framework (`config/*.php`, settings modules) để phân biệt rạch ròi hằng số logic nội bộ (phân trang, enum, role) vs các driver dịch vụ hạ tầng thực tế:
     - *Cơ sở dữ liệu quan hệ (SQL):* MySQL, PostgreSQL, MariaDB, MS SQL Server, Oracle (`DB_HOST`, `DATABASE_URL`).
     - *Cơ sở dữ liệu phi quan hệ (NoSQL / Document / Columnar):* MongoDB, Cassandra, ClickHouse, DynamoDB (`MONGODB_URI`, `CLICKHOUSE_HOST`).
     - *Bộ nhớ đệm (Cache & In-Memory):* Redis, Memcached, KeyDB, Dragonfly, Valkey (`CACHE_STORE`, `REDIS_HOST`, `MEMCACHED_HOST`).
     - *Hàng đợi & Message Broker (Event Streaming):* RabbitMQ (AMQP), Apache Kafka, NATS, Apache Pulsar, ActiveMQ, Beanstalkd, AWS SQS (`RABBITMQ_HOST`, `KAFKA_BROKERS`, `NATS_URL`, `QUEUE_CONNECTION`).
     - *Công cụ tìm kiếm toàn văn & Vector (Search Engines):* Elasticsearch, OpenSearch, Apache Solr, Meilisearch, Typesense, Algolia, Qdrant (`ELASTICSEARCH_HOSTS`, `OPENSEARCH_HOST`, `SOLR_URL`, `MEILISEARCH_HOST`, `TYPESENSE_HOST`, `SCOUT_DRIVER`).
     - *Giao thức Realtime, WebSocket & IoT:* Socket.io, EMQX / Mosquitto (MQTT), Centrifugo, Laravel Reverb, Pusher, ws native (`WS_PORT`, `MQTT_BROKER_URL`, `CENTRIFUGO_API_KEY`, `REVERB_APP_KEY`).
     - *Lưu trữ đối tượng (Object Storage):* AWS S3, MinIO, Google Cloud Storage, Azure Blob (`AWS_ENDPOINT`, `AWS_BUCKET`, `S3_ENDPOINT`).
     - *Môi trường kiểm thử Email:* SMTP, Sendgrid, Mailgun, AWS SES (`MAIL_MAILER`, `MAIL_HOST` -> giả lập local qua Mailpit).
   - **Khảo sát khởi tạo Client SDK:** Quét tìm các lệnh khởi tạo SDK thực tế (`Elasticsearch\Client`, `Solarium\Client`, `Meilisearch\Client`, `PhpAmqpLib\Connection\AMQPStreamConnection`, `Kafka\Producer`, `MongoDB\Client`, `amqplib`, `kafkajs`, `celery`, `pika`, `nats`, `socket.io-client`).
   - **Tự động Bù Đắp & Khớp Nối Tham Số (Auto-Synthesize Missing Parameters):** So sánh đối chiếu biến tìm thấy ở Tầng 3 với Tầng 2. Mọi biến có trong code nhưng bị thiếu trong `.env.example` **BẮT BUỘC PHẢI TỰ ĐỘNG BỔ SUNG** vào `docker/.env` và `docker/.env.example` với giá trị mặc định chuẩn xác cho môi trường local dev (ví dụ: `DB_HOST=mysql`, `REDIS_HOST=redis`, `RABBITMQ_HOST=rabbitmq`, `ELASTICSEARCH_HOSTS=http://elasticsearch:9200`, `MAIL_HOST=mailpit`).
4. **Giữ nguyên cấu hình extension:** Đồng bộ `php.ini`, `fpm-pool.conf` / `www.conf`, và các cờ biên dịch từ golden sample của dự án.
5. **Cổng hỏi ý kiến Member (`AskQuestion`) khi gặp Service phụ trợ / bên thứ 3 mơ hồ:**
   - Khi bóc tách monolith hoặc gặp các thành phần phụ trợ (như RabbitMQ, Elasticsearch, Apache Solr, Meilisearch, Kafka, daemon chạy ngầm, mock server):
   - Nếu Agent **không thể xác định chắc chắn** từ cấu hình có sẵn rằng nên đẩy ra Central Gateway, tách container riêng trong compose, hay gộp vào container ứng dụng:
   - Agent **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ SUY ĐOÁN HAY TỰ QUYẾT ĐỊNH NGẦM**.
   - **Hỏi trực tiếp qua GUI chat/client từng câu một (TUYỆT ĐỐI KHÔNG GHI VÀO FILE MD):** Agent BẮT BUỘC dùng công cụ tương tác `AskQuestion` để bật modal tương tác trên giao diện chat cho từng service mơ hồ. Nghiêm cấm ghi câu hỏi vào file markdown để bắt member đọc/sửa.
   - **Đưa ra đề xuất tối ưu phân tích được lên đầu:** Agent phải phân tích bối cảnh trước và đưa phương án tối ưu nhất lên vị trí số 1 kèm tiền tố `(Recommended): <Lý do kỹ thuật>` (ví dụ: nếu là MySQL/Redis/Postgres thì đề xuất dùng Central Gateway; nếu là dịch vụ chuyên biệt như RabbitMQ, Elasticsearch, Solr thì đề xuất dựng container riêng).
   - **Hỗ trợ phương án tự nhập (Write-in / Other):** Giao diện UI modal luôn có ô nhập liệu để member tự gõ phương án riêng theo nhu cầu (ví dụ: bỏ qua không chạy, kết nối đến server staging từ xa).
   - *3 Lựa chọn cốt lõi cung cấp:*
     - *Lựa chọn 1 (Đề xuất tối ưu):* `(Recommended) Tách container riêng — Định nghĩa thành 1 service container độc lập trong docker-compose.yml (cách ly tài nguyên và bảo toàn config riêng)`.
     - *Lựa chọn 2:* `Ủy quyền cho Central Gateway — Sử dụng service hạ tầng dùng chung qua ${GATEWAY_NETWORK_NAME} (tiết kiệm tài nguyên máy dev)`.
     - *Lựa chọn 3:* `Chạy kèm trong container ứng dụng — Quản lý tiến trình qua supervisord/entrypoint của container app chính`.
5. **Bước 2: Cổng bắt buộc hỏi ý kiến về Kiến trúc & Tách/Gộp Service (`AskQuestion`):**
   - Chỉ xuất bảng ra chat là CHƯA ĐỦ; Agent **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý TÁCH HAY GỘP RỒI SINH FILE NGAY**.
   - Ngay sau khi xuất bảng kê khai topology, Agent **BẮT BUỘC PHẢI GỌI `AskQuestion`** trên UI chat để hỏi member:
     - *Câu hỏi:* `"Phát hiện các service trong codebase: <danh sách service, ví dụ octane, php, supervisord>. Bạn muốn cấu trúc chúng trong docker-compose.yml như thế nào?"`
     - *Lựa chọn 1 (Đề xuất tối ưu):* `"(Recommended) Tách thành các container độc lập — Chạy mỗi service thành container riêng (ví dụ: 'octane' chạy Swoole:8000 và 'php' chạy FPM:9000 + supervisord, bảo toàn môi trường dev gốc)"`
     - *Lựa chọn 2:* `"Gộp vào 1 container chung — Gộp các service vào một container duy nhất chạy qua supervisord"`
     - *Ô Write-in:* Cho phép member tự nhập cấu trúc nhóm container mong muốn hoặc bỏ bớt service.
   - Chỉ sau khi member bấm chọn/xác nhận thì Agent mới được phép tiến hành sinh file cấu hình.

### 2.1. Chiến lược phân giải Cổng (Port Resolution Strategy) cho BE, FE và mọi loại Repo

Khi xác định cổng lắng nghe cho bất kỳ container nào (Frontend, Backend, Workers hay Microservices viết bằng các ngôn ngữ khác nhau), Agent PHẢI tuân thủ nghiêm ngặt thứ tự ưu tiên 2 tầng:

1. **Ưu tiên mức 1: Theo cấu hình đã có trong mã nguồn (Mức ưu tiên cao nhất):**
   - Agent PHẢI quét kỹ mã nguồn xem dự án có cấu hình cổng cụ thể hay không:
     - **Frontend / Node.js:** Kiểm tra `vite.config.*`, `nuxt.config.*`, `next.config.*`, script trong `package.json` (`--port <cổng>`), hoặc file `.env` / `.env.local` của repo (ví dụ `PORT=5173`, `PORT=3000`, `VITE_PORT=...`).
     - **Backend / PHP:** Kiểm tra cấu hình Nginx / Apache, `php-fpm.d/www.conf` (`listen`), cờ khởi động Octane / Reverb (`--port=8000`, `--port=6001`).
     - **Python (FastAPI, Flask, Django):** Kiểm tra lệnh Uvicorn / Gunicorn (`--port <cổng>`), chỉ thị `EXPOSE` trong `Dockerfile`, hoặc `settings.py`.
     - **Java / Kotlin (Spring Boot, Quarkus):** Kiểm tra `application.properties` / `application.yml` (`server.port`).
     - **.NET (C#):** Kiểm tra `appsettings.json` hoặc `launchSettings.json` (`applicationUrl`).
     - **Go:** Kiểm tra cờ runtime hoặc biến môi trường trong `main.go`.
   - **QUY TẮC BẤT BIẾN:** Nếu mã nguồn cũ đã cấu hình một cổng cụ thể (ví dụ Vite đang cấu hình `5173`, Nuxt cấu hình `3000`, Spring/FastAPI cấu hình `8080`, v.v.), Agent **BẮT BUỘC phải ưu tiên giữ nguyên và sử dụng đúng cổng đó**. Không có bất kỳ cổng nào bị cấm; cấu hình trong mã nguồn dự án luôn có mức ưu tiên cao nhất.

2. **Ưu tiên mức 2: Cổng thông dụng theo framework / thư viện (Khi dự án chưa cấu hình):**
   - Nếu trong mã nguồn không cấu hình cổng cụ thể, Agent áp dụng cổng mặc định tiêu chuẩn theo từng hệ sinh thái:
     - **Node.js (Vue, Nuxt, Next.js, Express, NestJS):** Ưu tiên `3000`, `3001`, `3002`... (hoặc `5173` nếu là Vite thuần không cấu hình).
     - **PHP (Laravel, Symfony, WordPress):**
       - FastCGI: `9000`
       - HTTP / Web: `80`, `8080`, `8000`
       - Octane: `8000`
       - Reverb (WebSocket): `6001`
     - **Python (FastAPI, Flask, Django):** Ưu tiên `8000`, `8080`, `5000` (Flask).
     - **Java / Kotlin (Spring Boot, Quarkus):** Ưu tiên `8080`, `8443`.
     - **.NET / C# (ASP.NET Core):** Ưu tiên `5000`, `5001`, `8080`.
     - **Go (Gin, Fiber, Echo):** Ưu tiên `8080`, `3000`.

---

## 3. Cấu trúc thư mục môi trường chuẩn

Agent PHẢI xây dựng thư mục `docker/` khép kín theo đúng chuẩn doanh nghiệp:

```text
<workspace>/
├── Makefile                    # Makefile tại gốc workspace (tiện lợi chạy up/down/logs từ thư mục gốc)
└── docker/
    ├── docker-compose.yml      # Cấu hình compose đa dịch vụ
    ├── .env                    # Biến môi trường cục bộ đang kích hoạt (member tự điều chỉnh)
    ├── .env.example            # Template biến môi trường mẫu đầy đủ tham số doanh nghiệp
    ├── router.txt              # Đoạn cấu hình router cho Central Gateway (có key workspace)
    ├── node/
    │   └── frontend-dev.sh     # Script khởi động & tự động cài đặt Node/Vite/Nuxt
    └── php/ (hoặc python/, v.v.)
        ├── Dockerfile          # Dockerfile runtime được tinh chỉnh (nếu cần custom build)
        ├── php.ini             # Cấu hình PHP ghi đè cho local
        └── fpm-pool.conf       # Cấu hình worker pool PHP-FPM (www.conf)
```

> [!IMPORTANT] KHÔNG TẠO `docker/Makefile`
> File `Makefile` đã được đưa ra **thư mục gốc của workspace** để thao tác thuận tiện nhất. Agent **TUYỆT ĐỐI KHÔNG sinh file Makefile bên trong thư mục `docker/`**. Chỉ duy nhất một `Makefile` nằm tại root workspace.

### 3.1. Cấu trúc mẫu `.env.example` & `.env` chuẩn doanh nghiệp (Đầy đủ tham số như Docker External)

> [!CAUTION] NGUYÊN TẮC: ĐẦY ĐỦ THAM SỐ, MEMBER TỰ ĐIỀU CHỈNH — KHÔNG NGỘ NHẬN CHẠY ĐƯỢC NGAY
> Triết lý của CoSquad là sinh ra một bộ cấu hình Docker **hoàn chỉnh, chuẩn hóa theo các dự án doanh nghiệp thực chiến (tương tự `docker-external`) với đầy đủ tất cả các biến môi trường trong `docker/.env` và `docker/.env.example`**.
> **Tool KHÔNG huyễn hoặc hay yêu cầu môi trường phải chạy được ngay lập tức 100% mà không cần người dùng can thiệp.**
> Các giá trị sinh ra trong `docker/.env` là các giá trị mặc định hợp lý và placeholder để **member tự kiểm tra và điều chỉnh lại** (như sửa lại `GATEWAY_NETWORK_NAME` cho khớp với Gateway máy mình, mật khẩu DB, đường dẫn repo, chứng chỉ SSL) cho phù hợp với máy cá nhân của họ.
> Agent tuyệt đối KHÔNG cố thử chạy container hay giả định cấu hình tự động hoàn hảo; Agent PHẢI nhắc nhở rõ ràng member kiểm tra và tùy chỉnh `docker/.env` trước khi chạy `make up`.

File `docker/.env.example` và `docker/.env` phải có đầy đủ các khối cấu hình sau:

```env
###############################################################################
# Workspace & Container Identifiers
###############################################################################
PROJECT_NAME=dev
PROJECT_SLUG=myproject
HOST_UID=1000
HOST_GID=1000

###############################################################################
# Gateway Shared Network & SSL Certificates
# [BẮT BUỘC MEMBER ĐIỀU CHỈNH]:
# "base_shared_net" chỉ là ví dụ cá nhân. Tên network được cấu hình trong file .env
# của chính Gateway trên máy bạn. Bạn PHẢI kiểm tra Gateway .env và đặt
# GATEWAY_NETWORK_NAME chuẩn giống bên đó!
###############################################################################
GATEWAY_NETWORK_NAME=base_shared_net
GATEWAY_CERTS_DIR=~/.gateway/certs

###############################################################################
# Domains & Routing Hosts (Phải khớp với docker/router.txt)
###############################################################################
BACKEND_HOST=myproject-api.local.com
FRONTEND_HOST=myproject.local.com
REVERB_HOST=myproject-reverb.local.com

###############################################################################
# Application Runtimes & Source Mount Paths
# Điều chỉnh đường dẫn thư mục mã nguồn thực tế trong workspace của bạn
###############################################################################
PROJECT_WORKSPACE=.
BACKEND_REPO=source-code/backend
FRONTEND_REPO=source-code/frontend

PHP_IMAGE=php:8.3-fpm-bookworm
NODE_IMAGE=node:20-bookworm
FRONTEND_DEV_PORT=3000
OCTANE_PORT=8000
REVERB_PORT=6001

###############################################################################
# Central Gateway Shared Infrastructure (Điều chỉnh khớp với Gateway .env của bạn)
###############################################################################
# Database (MySQL 8.4/8.0 hoặc PostgreSQL 17 trên Gateway)
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=myproject_db
DB_USERNAME=root
DB_PASSWORD=root

# Cache & Key-Value (Redis trên Gateway)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=null

# Object Storage / Cloud Mock (LocalStack trên Gateway)
AWS_ENDPOINT=http://localstack:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=myproject-bucket

# Mail Testing Sandbox (Mailpit trên Gateway)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="no-reply@myproject.local.com"
MAIL_FROM_NAME="${PROJECT_SLUG}"

# Mock API (Mock Server trên Gateway)
MOCK_API_URL=http://mock-api:4000

###############################################################################
# Standalone Fallback Port Mappings (Chỉ dùng khi chạy chế độ độc lập ko qua Gateway)
###############################################################################
STANDALONE_HTTP_PORT=8080
STANDALONE_DB_PORT=3306
STANDALONE_REDIS_PORT=6379
STANDALONE_MAIL_PORT=8025
```

---

## 4. Đặc tả Docker-Compose (Chế độ Central Gateway)

Khi hoạt động ở chế độ Gateway, `docker/docker-compose.yml` tuân thủ các quy ước sau:

### A. Tên dự án & Quy ước đặt tên Container
```yaml
name: ${PROJECT_NAME:-dev}-${PROJECT_SLUG}

x-dev-user: &dev-user
  user: "${HOST_UID:-1000}:${HOST_GID:-1000}"

x-dev-ca-env: &dev-ca-env
  NODE_EXTRA_CA_CERTS: /opt/gateway-certs/dev-rootCA.crt
  CURL_CA_BUNDLE: /opt/gateway-certs/dev-rootCA.crt
  SSL_CERT_FILE: /opt/gateway-certs/dev-rootCA.crt
  COMPOSER_HOME: /tmp/composer
```
- Tên Container PHẢI theo format: `${PROJECT_NAME:-dev}_${PROJECT_SLUG}_<service>` (ví dụ: `dev_portal_php_83`, `dev_portal_node`, `dev_portal_octane`, `dev_portal_reverb`).

> [!CRITICAL] BẮT BUỘC ĐỒNG BỘ QUYỀN USER MÁY HOST CHO CÁC VOLUME MOUNT CODE (CHỐNG LỖI ROOT)
> Dựa trên kiến trúc chuẩn thực chiến từ `~/docker-webbeds` và `~/docker-external`:
> - **TẤT CẢ các service mount volume mã nguồn từ máy host** (`frontend-node`, `octane`, `php`, `backend-worker`, Python, v.v.) **BẮT BUỘC PHẢI KHAI BÁO `user: "${HOST_UID:-1000}:${HOST_GID:-1000}"`** (thông qua anchor `<<: *dev-user`).
> - Cả `docker/.env` và `docker/.env.example` **BẮT BUỘC** khai báo `HOST_UID=1000` và `HOST_GID=1000`.
> - **Ý nghĩa kỹ thuật sống còn:** Nếu không mapping user, container sẽ chạy dưới quyền root (hoặc www-data). Mọi file do ứng dụng sinh ra trong volume mount (log, cache, view compile, upload, socket, vite cache) sẽ bị gắn quyền `root:root` ngoài máy host, khiến lập trình viên (user host `vutv`) bị khóa quyền, không thể sửa/xóa trên IDE hay commit git.
> - **Quy tắc viết Dockerfile:** Đối với các service tự build (như PHP), các thư mục runtime hệ thống (`/run`, `/var/log`, `/var/run/supervisor`, `/tmp`, `/tmp/composer`) PHẢI được cấp quyền ghi mở (`chmod -R 777 /run /var/log /tmp`) để tiến trình non-root `HOST_UID:HOST_GID` có thể tạo socket và file log bình thường. **TUYỆT ĐỐI CẤM** chạy lệnh `chown -R www-data:www-data` trên thư mục mã nguồn được mount.

### B. Mạng dùng chung với Gateway
Mọi dịch vụ kết nối vào mạng external của gateway được cấu hình linh hoạt qua biến môi trường:
```yaml
networks:
  gateway-shared:
    name: ${GATEWAY_NETWORK_NAME:-base_shared_net}
    external: true
```
Từng dịch vụ trong compose khai báo:
```yaml
    networks:
      - gateway-shared
```

### C. Dịch vụ Node.js Frontend
- **Không viết Dockerfile riêng:** Dùng trực tiếp image chính thức của Node LTS:
  ```yaml
  frontend-node:
    <<: *dev-user
    image: ${NODE_IMAGE:-node:20-bookworm} # hoặc node:18.19-bookworm phù hợp dự án
    container_name: ${PROJECT_NAME:-dev}_${PROJECT_SLUG}_frontend_node
    working_dir: /workspace/${FRONTEND_REPO}
    command: ["/bin/sh", "/opt/dev/frontend-dev.sh"]
    environment:
      <<: *dev-ca-env
      CHOKIDAR_USEPOLLING: "true"
    volumes:
      - ${PROJECT_WORKSPACE}/${FRONTEND_REPO}:/workspace/${FRONTEND_REPO}
      - ./node/frontend-dev.sh:/opt/dev/frontend-dev.sh:ro
      - ${GATEWAY_CERTS_DIR:-~/.gateway/certs}/dev-rootCA.crt:/opt/gateway-certs/dev-rootCA.crt:ro
    networks:
      - gateway-shared
  ```
- **[QUY TẮC SỐNG CÒN] KHÔNG tách volume riêng cho `node_modules`:**
  - **TUYỆT ĐỐI CẤM** tạo named volume dạng `frontend_node_modules:/.../node_modules`.
  - Mount trực tiếp toàn bộ thư mục mã nguồn frontend:
    `- ${PROJECT_WORKSPACE}/${FRONTEND_REPO}:/workspace/${FRONTEND_REPO}`
  - Việc mount trọn gói mã nguồn đã bao gồm luôn `node_modules`, giúp IDE trên host và container đồng bộ 100%, không bị lỗi file lock và không tốn volume thừa.

### D. Kỷ luật Lệnh trong Container: Chỉ Biên Dịch & Realtime Hosting (Cấm Tự Chạy Install)
> [!CRITICAL] CẤM TỰ Ý CÀI ĐẶT THƯ VIỆN BÊN TRONG CONTAINER DOCKER
> - **Lệnh container (`command:`) chỉ dành riêng cho việc biên dịch code realtime và hosting (Dev Server):**
>   - Frontend chạy dev server live reload: `pnpm run dev -- --host 0.0.0.0 --port "$PORT"` (hoặc `npm run dev`, `yarn dev`, `vite`, `serve`).
> - **Cài đặt thư viện do Member tự chủ động chạy ở ngoài máy host:**
>   - Các thao tác cài đặt package (`npm i`, `pnpm i`, `yarn install`, `composer install`, `pip install`) là trách nhiệm của lập trình viên và PHẢI được chạy trực tiếp ngoài máy host.
>   - **TUYỆT ĐỐI CẤM** chèn các lệnh `npm install`, `pnpm install`, hay `composer install` tự động chạy ngầm bên trong script khởi động container Docker!
>   - Nếu phát hiện chưa có `node_modules`, script `frontend-dev.sh` sẽ xuất thông báo cảnh báo rõ ràng yêu cầu member chạy `npm install` hoặc `pnpm install` ngoài máy host, và chờ `node_modules` xuất hiện trước khi khởi chạy server.

File script `docker/node/frontend-dev.sh` PHẢI tuân thủ cấu trúc chuẩn hóa sau:
```sh
#!/bin/sh
set -eu
cd "/workspace/${FRONTEND_REPO}"

PORT="${FRONTEND_DEV_PORT:-3000}"

# 1. Kiểm tra điều kiện phụ thuộc (Tuyệt đối KHÔNG tự install trong container)
# Thư viện (npm i, pnpm i) phải do lập trình viên tự chạy ngoài máy host.
if [ ! -d node_modules ]; then
  echo "[CẢNH BÁO] Chưa tìm thấy thư mục 'node_modules' tại /workspace/${FRONTEND_REPO}."
  echo "[YÊU CẦU THAO TÁC] Vui lòng chạy 'pnpm install' (hoặc 'npm install' / 'yarn install') ngoài máy host."
  echo "[ĐANG CHỜ] Container đang chờ thư mục node_modules trước khi chạy dev server..."
  while [ ! -d node_modules ]; do
    sleep 3
  done
  echo "[THÀNH CÔNG] Đã phát hiện node_modules. Bắt đầu chạy realtime hosting..."
fi

# 2. Lệnh biên dịch realtime hosting
if [ -f pnpm-lock.yaml ]; then
  exec pnpm run dev -- --host 0.0.0.0 --port "$PORT"
elif [ -f yarn.lock ]; then
  exec yarn dev --host 0.0.0.0 --port "$PORT"
else
  exec npm run dev -- --host 0.0.0.0 --port "$PORT"
fi
```
- **Quy tắc Bind Cổng:** Tất cả dev server PHẢI bind vào `0.0.0.0` (để nhận kết nối từ Docker network / Gateway) sử dụng đúng cổng đã được phân giải (`${FRONTEND_DEV_PORT}`, ví dụ `5173`, `3000`, hoặc cổng phát hiện từ mã nguồn / cổng mặc định).

---

## 5. Các dịch vụ bổ trợ: Thuần nội bộ & Tối giản

1. **Các dịch vụ đã có trên Gateway (KHÔNG sinh thừa trong compose):**
   - **Database & Cache:** MySQL (`mysql:3306`), Postgres (`postgres:5432`), Redis (`redis:6379`).
   - **Object Storage / S3 / SQS:** Sử dụng `localstack:4566` của Gateway. **TUYỆT ĐỐI KHÔNG dựng MinIO riêng!** File `.env` trỏ `AWS_ENDPOINT=http://localstack:4566` (xem trực quan qua UI StackPort `https://stackport.local.com`).
   - **Email:** Sử dụng `mailpit:1025` của Gateway (UI: `http://mail.local.com`).

2. **Worker xử lý hàng đợi và tác vụ định kỳ (Nội bộ dự án):**
   - **KHÔNG tạo Dockerfile riêng:** Container worker tái sử dụng trực tiếp image PHP của ứng dụng (ví dụ: `image: ${PROJECT_NAME:-dev}_${PROJECT_SLUG}_php`).
   - Ghi đè command tương ứng:
     - Queue: `command: ["php", "artisan", "queue:work"]`
     - Schedule: `command: ["php", "artisan", "schedule:work"]`
   - **Chỉ chạy nội bộ:** Các worker chỉ chạy CLI nền, KHÔNG nhận HTTP request. TUYỆT ĐỐI KHÔNG đưa vào `router.txt` hay mở cổng ra gateway.

3. **Dịch vụ dữ liệu & hạ tầng đặc thù (Search, Broker, NoSQL):**
   - Nếu dự án thực sự cần dịch vụ mà Gateway không có sẵn (như Elasticsearch, Apache Solr, RabbitMQ, Kafka, Meilisearch, MongoDB), khai báo trực tiếp bằng image chính thức (ví dụ `rabbitmq:3-management-alpine`, `elasticsearch:8.13.0`, `solr:9`). **KHÔNG build custom Dockerfile.**
   - Backend giao tiếp qua Docker network alias nội bộ (`http://elasticsearch:9200`, `rabbitmq:5672`). Không mở cổng ra Central Gateway.

4. **Laravel Octane / Reverb (nếu có):**
   - Nếu dùng Octane thay cho PHP-FPM, phục vụ API tại cổng 8000 (`role: "node"` trong `router.txt`).
   - If dùng Reverb, phục vụ kết nối WebSocket tại cổng 6001 (`role: "node"` trong `router.txt`).

---

## 6. Cấu hình định tuyến Gateway (`docker/router.txt`)

> [!CRITICAL] MỤC ĐÍCH DUY NHẤT CỦA ROUTER.TXT: ĐOẠN MÃ JSON CHO CENTRAL GATEWAY — TUYỆT ĐỐI KHÔNG PHẢI FILE HOST
> - **Mục đích duy nhất của `docker/router.txt` là một đoạn JSON snippet dùng để copy-paste trực tiếp vào file `routes.json` của Central Gateway (dưới mục `projects.<slug>`)!**
> - **TUYỆT ĐỐI CẤM chuyển đổi hoặc sinh `router.txt` dưới dạng file ánh xạ host (như cú pháp `/etc/hosts`, `127.0.0.1 domain`, hay `domain -> container:port`).**
> - Khi tham khảo các dự án chuẩn (`~/docker-webbeds`, `~/docker-external`), **CHỈ tham khảo cấu hình Docker container** (phân quyền user `HOST_UID:HOST_GID`, mount thư mục, command biên dịch/hosting realtime). **Định dạng JSON chuẩn của `router.txt` cho Central Gateway PHẢI ĐƯỢC BẢO TOÀN NGUYÊN VẸN 100%.**

Central Gateway (`routes.json`) CHỈ cần định tuyến cho **các cổng truy cập công khai từ trình duyệt của developer**:
- **Backend API:** 1 route trỏ tới container phục vụ API (`role: "node"` cổng 8000 nếu chạy HTTP/Octane; hoặc `role: "web"` cổng 9000 kèm `docroot` nếu chạy PHP-FPM FastCGI).
- **Frontend Web:** 1 route trỏ tới dev server Node (`role: "node"`, port khớp với `${FRONTEND_DEV_PORT}`, ví dụ 5173, 3000,...).
- **WebSocket / Realtime:** 1 route trỏ tới container WebSocket (`role: "node"`, ví dụ cổng 6001).
- **TUYỆT ĐỐI KHÔNG đưa các dịch vụ nội bộ** (Queue workers, Schedulers, Message Brokers, Search Engines, Redis, DB) vào `router.txt`!

> [!CRITICAL] NGUYÊN TẮC BẢO TOÀN TÊN MIỀN HOST ROUTER KHÔNG PHỤ THUỘC TÁCH CONTAINER
> - **Trường `host` đại diện cho tên miền truy cập từ trình duyệt / client** (ví dụ `${PROJECT_SLUG}.local.com` cho Frontend, `${PROJECT_SLUG}-api.local.com` cho API, `${PROJECT_SLUG}-reverb.local.com` cho WebSocket).
> - **NGHIÊM CẤM TỰ Ý THÊM HẬU TỐ CONTAINER / CÔNG NGHỆ (như `-fpm`, `-octane`, `-node`, `-swoole`) vào tên miền `host`!**
> - Việc phân tách các container Docker trong `docker-compose.yml` là việc quản lý nội bộ container, **HOÀN TOÀN KHÔNG ĐƯỢC làm biến dạng hay đổi tên domain công khai trong `router.txt`**.
> - Dù API chạy bằng container `octane` hay container `php`, tên miền `host` vẫn giữ nguyên là `${PROJECT_SLUG}-api.local.com`.

### Định dạng chuẩn của `docker/router.txt` (Kèm Workspace Key)

Đoạn snippet BẮT BUỘC phải bọc dưới key là slug của workspace (ví dụ `"portal"`), giúp member chỉ cần copy-paste trực tiếp vào object gốc trong file `routes.json` của Gateway:

```json
"${PROJECT_SLUG}": {
  "external": true,
  "sites": [
    {
      "host": "${PROJECT_SLUG}.local.com",
      "role": "node",
      "container": "${PROJECT_NAME:-dev}_${PROJECT_SLUG}_frontend_node",
      "port": 5173
    },
    {
      "host": "${PROJECT_SLUG}-api.local.com",
      "role": "node",
      "container": "${PROJECT_NAME:-dev}_${PROJECT_SLUG}_octane",
      "port": 8000
    },
    {
      "host": "${PROJECT_SLUG}-reverb.local.com",
      "role": "node",
      "container": "${PROJECT_NAME:-dev}_${PROJECT_SLUG}_php",
      "port": 6001
    }
  ]
}
```
*(Ghi chú: Nếu service API chạy bằng PHP-FPM FastCGI thay vì Octane, trỏ `container` về `${PROJECT_NAME:-dev}_${PROJECT_SLUG}_php` với `role: "web"` và `docroot: "/var/www/html/public"`, trong khi tên miền `host` vẫn giữ nguyên là `${PROJECT_SLUG}-api.local.com`).*

*Quy cách thuộc tính Role:*
- `role: "web"`: Bắt buộc có `"container"` và `"docroot"`. Cấu hình Nginx FastCGI pass tới container PHP-FPM tại cổng 9000.
- `role: "node"`: Bắt buộc có `"container"` và `"port"`. Cấu hình reverse proxy HTTP / WebSocket thông thường.

---

## 7. Cảnh báo Hạ tầng & Xác nhận Chế độ qua `AskQuestion` (Phòng trường hợp không dùng Gateway)

Để hỗ trợ đầy đủ các lập trình viên **chưa cài hoặc không sử dụng Central Docker Gateway**, `/build-env` BẮT BUỘC phải có bước cảnh báo và hỏi ý kiến thành viên trước khi chốt phương án build.

### A. Cảnh báo các dịch vụ chạy ở Gateway
Agent PHẢI hiển thị rõ danh mục các dịch vụ hạ tầng dùng chung mà CoSquad mặc định giả định Gateway sẽ cung cấp:
```text
[Kiểm tra hạ tầng Central Gateway]
Môi trường tiêu chuẩn CoSquad giả định các dịch vụ dùng chung sau đang chạy trên Gateway:
• Mạng dùng chung: Cấu hình trong .env của Gateway (ví dụ GATEWAY_NETWORK_NAME=base_shared_net)
• Reverse Proxy: Nginx (cổng 80/443, chứng chỉ TLS wildcard *.local.com)
• Databases: MySQL 8.4/8.0 (3306), PostgreSQL 17 (5432)
• Cache: Redis 7 (6379)
• Object Storage / S3 / SQS: LocalStack 3.7 (4566)
• Email Sandbox: Mailpit (1025 / 8025)
• Quản trị UI: phpMyAdmin, pgAdmin, Redis Commander, StackPort
```

### B. Hộp thoại tương tác (`AskQuestion`)
Agent đưa ra câu hỏi xác nhận cho member:
- **Câu hỏi:** *"Bạn có đang sử dụng Central Docker Gateway cho các dịch vụ dùng chung không?"*
- **Option 1 (Khuyến nghị):** `"(Recommended) Có, dùng Central Gateway — Compose gọn nhẹ kết nối GATEWAY_NETWORK_NAME + xuất file docker/router.txt"`
- **Option 2:** `"Không, hãy build Full Standalone — Tự cung cấp compose độc lập kèm Nginx/cổng riêng, MySQL, Redis và network nội bộ"`

### C. Luồng thực thi Full Standalone (Khi chọn "Không")
Nếu member chọn chế độ Standalone độc lập:
1. **Network Docker nội bộ:** Thay thế `gateway-shared` bằng mạng bridge độc lập của dự án:
   ```yaml
   networks:
     default:
       name: ${PROJECT_SLUG}_net
       driver: bridge
   ```
2. **Bổ sung Container hạ tầng lõi:**
   - Thêm container `mysql` (hoặc `postgres`) kèm persistent named volume (ví dụ: `${PROJECT_SLUG}_mysql_data:/var/lib/mysql`).
   - Thêm container `redis`.
   - Nếu dự án cần test mail, thêm container `mailpit`.
3. **Ánh xạ cổng để truy cập trực tiếp:**
   - Mở cổng host trực tiếp (ví dụ: Backend cổng `8080`, Frontend cổng `3000`, MySQL cổng `3306`, Redis cổng `6379`).
   - Hoặc dựng kèm 1 container Nginx nhỏ trong `docker/nginx/`.
4. **Biến môi trường (`.env`):**
   - Trỏ `DB_HOST=mysql`, `REDIS_HOST=redis` theo tên service nội bộ.
5. **Không cần `router.txt`:** Bỏ qua việc tạo `docker/router.txt` vì toàn bộ ứng dụng được truy cập trực tiếp qua localhost.

### D. Hướng dẫn sau khi sinh file: Member tự điều chỉnh `.env`
Ngay sau khi ghi file xong, Agent PHẢI in ra thông báo hướng dẫn rõ ràng:
> "Đã khởi tạo môi trường Docker thành công!
> Vui lòng mở và điều chỉnh các tham số trong file `docker/.env` cho phù hợp với môi trường của bạn:
> 1. Thiết lập `GATEWAY_NETWORK_NAME` cho khớp với tên mạng thực tế của Gateway.
> 2. Kiểm tra `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` và `AWS_BUCKET`.
> 3. Kiểm tra `GATEWAY_CERTS_DIR` nếu mount chứng chỉ SSL wildcard tùy chỉnh.
> 4. Nếu dùng Gateway, copy nội dung `docker/router.txt` dán vào `routes.json` của Gateway.
> Sau đó khởi động container bằng lệnh: `make up`"

---

## 8. Đặc tả Makefile tại thư mục gốc

Agent PHẢI sinh file `Makefile` duy nhất tại **thư mục gốc của workspace** (gọi `docker compose -f docker/docker-compose.yml --env-file docker/.env`):

```makefile
DCX := docker compose -f docker/docker-compose.yml --env-file docker/.env

MAKEFLAGS += --no-print-directory

.PHONY: help up down restart ps logs build exec-backend exec-frontend

help:
	@echo "Các lệnh thao tác:"
	@echo "  make up            - Khởi động các container dự án chạy nền"
	@echo "  make down          - Dừng và xóa các container dự án"
	@echo "  make restart       - Khởi động lại các container"
	@echo "  make ps            - Xem trạng thái các container đang chạy"
	@echo "  make logs          - Theo dõi log thời gian thực của container"
	@echo "  make build         - Build hoặc build lại Docker images"
	@echo "  make exec-backend  - Mở terminal vào container backend"
	@echo "  make exec-frontend - Mở terminal vào container frontend"

build:
	$(DCX) build

up:
	$(DCX) up -d

down:
	$(DCX) down

restart:
	$(DCX) restart

ps:
	$(DCX) ps -a

logs:
	$(DCX) logs -f

exec-backend:
	$(DCX) exec -it backend sh

exec-frontend:
	$(DCX) exec -it frontend-node sh
```

---

## 9. Bảng kiểm tra xác thực (Checklist)

- [ ] Đã quét mã nguồn tìm `Dockerfile` / `docker-compose.yml` sẵn có trước khi tạo mới.
- [ ] KHÔNG thực hiện quét động đường dẫn máy chủ (`~/gateway`); sử dụng tri thức cấu trúc tĩnh tổng hợp sẵn.
- [ ] Đã sinh bộ file `docker/.env.example` và `docker/.env` đầy đủ tham số chuẩn doanh nghiệp (đúc kết từ `docker-external`).
- [ ] Đã ghi chú rõ `base_shared_net` chỉ là ví dụ; member bắt buộc kiểm tra `.env` của Gateway để cấu hình `GATEWAY_NETWORK_NAME` khớp chính xác.
- [ ] Đã có hướng dẫn rõ ràng yêu cầu member kiểm tra và điều chỉnh `docker/.env` trước khi chạy `make up` (không ngộ nhận chạy ngay).
- [ ] Ở chế độ Gateway: Không sinh thừa các service đã có trên Gateway (Nginx, MySQL, Redis, MinIO).
- [ ] Ở chế độ Standalone: Tự động sinh đầy đủ DB/Redis và bridge network khi member xác nhận không dùng gateway.
- [ ] Frontend Node mount trực tiếp source code; KHÔNG tạo named volume cho `node_modules`.
- [ ] Cổng của tất cả các service (FE, BE, Python, Java, .NET, Go) được phân giải theo thứ tự ưu tiên 2 tầng: Tầng 1 = theo mã nguồn đã có (ví dụ 5173, 3000, 8080), Tầng 2 = theo quy ước thư viện/framework (Node: 3000/3001, PHP: 9000/80/8080, Python: 8000/8080, Java: 8080, .NET: 5000/8080).
- [ ] `frontend-dev.sh` nhận diện đúng package manager (`pnpm`/`yarn`/`npm`) và bind dev server vào `0.0.0.0` trên cổng đã phân giải (`${FRONTEND_DEV_PORT}`).
- [ ] Các worker bổ trợ (queue, schedule, search) tái sử dụng image ứng dụng, chạy thuần nội bộ và không xuất ra router Gateway.
- [ ] `Makefile` CHỈ sinh tại thư mục gốc của workspace; **KHÔNG sinh `Makefile` trong `docker/`**.
- [ ] `docker/router.txt` được xuất kèm workspace key (`"${PROJECT_SLUG}": { ... }`) và chỉ chứa các endpoint công khai cho trình duyệt.
- [ ] Đã có bước cảnh báo hạ tầng và xác nhận chế độ với thành viên qua `AskQuestion` trước khi hoàn tất.

