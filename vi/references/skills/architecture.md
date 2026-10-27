# Skill: `/architecture`

## Tên
`architecture`

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/architecture`
- Đóng vai trò là lệnh **Router (Điều hướng)** tổng phân phối các công việc liên quan đến kiến trúc tới các Skill con tương ứng.

## Input (Dữ liệu đầu vào)
- Member sẽ nhập vào một khu vực kiến trúc (Operational Area), hoặc một Module ID, hoặc đơn giản là một nhu cầu chung về kiến trúc.
- Agent tự động quét và phân giải (Resolve ID) sử dụng các lệnh nội bộ (`cosquad_docs_route`, `cosquad_docs_list_ids`).

## Output (Kết quả mong đợi)
- Tác giả trực tiếp toàn bộ các chương kiến trúc theo chuẩn Arc42 dưới `architecture/`:
  - **Chiến lược giải pháp & Khối cấu trúc (§04, §05):** `architecture/04-solution-strategy/` & `05-building-blocks/` (Mermaid `graph TB`, C4 Component Diagram).
  - **Môi trường & Hạ tầng triển khai (§07):** `architecture/07-deployment/` (`DEP-*`).
  - **Mối quan tâm cắt ngang (§08):** `architecture/08-cross-cutting/` (Bảo mật, Logging, Caching, Messaging, Auth).
  - **Tích hợp liên dịch vụ:** `architecture/08-cross-cutting/` hoặc `<LCA>/common/architecture.md` (RPC đồng bộ/bất đồng bộ, event, message queue).
  - **Tác vụ ngầm & Workers:** Các worker nền, cronjob, hàng đợi message, retry backoff, idempotency.
  - **Hồ sơ quyết định kiến trúc (§09 ADR):** `architecture/09-decisions/ADR-{NNN}-{slug}.md`.

## Description / Ý nghĩa
- **Kỹ năng thiết kế bản vẽ kiến trúc kỹ thuật toàn diện (Unified Architecture SSOT).**
- Hợp nhất toàn bộ các tầng kiến trúc vào một lệnh duy nhất:
  - Khối cấu trúc tĩnh: Sơ đồ khối topology các tầng hệ thống, service, datastore, reverse proxy.
  - Khối giao tiếp động: Trực tiếp vẽ luồng kỹ thuật liên dịch vụ (`sequenceDiagram`).
  - Hạ tầng và quyết định: Quản lý trực tiếp ADR và đặc tả vị trí triển khai node.
- Tách biệt rõ ràng ranh giới giữa **Kiến trúc Kỹ thuật (Technical Architecture)** và **Đặc tả Nghiệp vụ (Business Spec)**.
- Kiến trúc (Architecture) chỉ xoay quanh cấu trúc hệ thống, dịch vụ nội bộ, cronjobs, hạ tầng cơ sở dữ liệu và các luồng kỹ thuật cắt ngang. Cấm lặp lại chân dung người dùng (Personas) trong kiến trúc.
- Bắt buộc các sơ đồ thiết kế (Mermaid Flowchart / Sequence Diagram) phải mô hình hóa rõ ràng các luồng ngoại lệ và lỗi (MANDATORY ERROR FLOWS).

## Các Skill liên quan
- **Trước đó:** `/spec`, `/spec`, `/module`.
- **Luồng người dùng:** Chuyển tiếp luồng end-to-end cho `/user-flow`.
- **Hợp nhất hoàn toàn:** Thay thế và xóa bỏ hoàn toàn các skill con riêng lẻ: `/architecture`, `/architecture`, `/architecture`, `/architecture`, `/spec`, và `/grill`.

---

## Example prompt (mẫu gọi)

**Quy tắc:** một session = một command · chat mới khi đổi phase · cập nhật `.harness/progress.md` nếu có.

**Khi nào:** Gọi khi scope khớp mô tả skill ở trên.

```text
/architecture

Surface: {admin-web} · Module: {ADM-01} · Scope: {mô tả ngắn}
```

