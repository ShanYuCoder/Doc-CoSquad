# Kỹ năng: `/qa`

## Tên
`qa` (alias: `qa-resolve`)

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/qa`
- Tự động nhận diện 4 chế độ vận hành qua nội dung prompt:
  - **Chế độ 1 (Inbox / Danh sách):** `/qa` hoặc `/qa list` $\rightarrow$ Quét toàn bộ thư mục `qa/` và lập bảng theo dõi các ticket nợ kỹ thuật đang mở.
  - **Chế độ 2 (Tạo ticket thủ công):** `/qa create <tiêu-đề>` $\rightarrow$ Khởi tạo file ticket `qa/<SHORT>_NNNN.yaml` mới.
  - **Chế độ 3 (Giải quyết & Vá spec):** `/qa <ID> <giải-pháp>` $\rightarrow$ Vá giải pháp vào file spec đích (`*.bundle.yaml` hoặc `01-backend-spec.yaml`), chuyển trạng thái `status: closed`.
  - **Chế độ 4 (Thẩm định & Review):** `/qa <ID> review approved|rejected` $\rightarrow$ Ghi nhận chữ ký thẩm định của Senior/Lead.

## Dữ liệu đầu vào (Input)
- Mã ticket (VD: `Q-ADM-01-01-01` hoặc `Q-ORD-0001`; legacy `QA-ORD-0001` hoặc `HOTEL-LIST_0001`), nội dung giải pháp, hoặc kết quả review.

## Kết quả đầu ra (Output)
- **Chế độ 1:** Bảng tổng kết trạng thái nợ kỹ thuật trong chat.
- **Chế độ 2:** File ticket nợ kỹ thuật mới tại `qa/<id>.yaml` (VD: `qa/Q-ADM-01-01-01.yaml` hoặc `qa/<SHORT>_NNNN.yaml`).
- **Chế độ 3:** Cập nhật file spec đích, đóng ticket QA, tự động chạy `coSquad split` và `coSquad render`.
- **Chế độ 4:** Ghi nhận log review có chữ ký vào mảng `updates[]`.

---

## Mẫu Prompt gọi lệnh

### Xem danh sách nợ kỹ thuật đang chờ xử lý
```text
/qa list
```

### Giải quyết một ticket nợ kỹ thuật
```text
/qa Q-ADM-01-01-01

Bổ sung cơ chế Idempotency Key: Bắt buộc gửi Header X-Idempotency-Key định dạng UUIDv4, có hiệu lực lưu vết trong 24 giờ để chống trừ tiền 2 lần.
```
