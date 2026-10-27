# Kỹ năng: `/grill`

## Tên
`grill`

## Cách dùng (Command/Trigger)
- Gọi qua slash command: `/grill <đối-tượng-hoặc-yêu-cầu>`
- **Bộ máy Phản biện & Thẩm định Chất lượng Toàn năng (Unified Grilling Engine):** Tự động phân tích prompt và đường dẫn file để xác định chính xác giai đoạn dự án cần thẩm định:
  - **Giai đoạn 1 (Đặc tả màn hình):** `/grill <bundle.yaml>` hoặc `/grill W-01` $\rightarrow$ Chạy Grill tổng thể kết hợp cả chiều sâu Nghiệp vụ (BQA) và Sẵn sàng Kỹ thuật (Dev) trong cùng 1 pass.
  - **Giai đoạn 2 (Hợp đồng Backend API):** `/grill 01-backend-spec.yaml` $\rightarrow$ Thẩm định verbs, schemas, mã lỗi HTTP, DTOs và ràng buộc database.
  - **Giai đoạn 3 (Hub PRD & Bối cảnh hệ thống):** `/grill overview/index.md` hoặc `/grill surfaces/admin/index.md` $\rightarrow$ Thẩm định Goals, Scope in/out, khu vực vận hành.
  - **Giai đoạn 4 (Ma trận Testcase & QA):** `/grill TC-01.yaml` $\rightarrow$ Thẩm định ma trận kiểm thử, các ca biên, ca ngoại lệ.
  - **Giai đoạn 5 (Tích hợp Wire & Code):** `/grill wire` $\rightarrow$ Thẩm định khớp nối FE ↔ BE, dọn dẹp mock data, kiểm tra assertion unit test.

## Tính năng đột phá: Tự động chuyển thành Tech Debt
- Trong phiên phỏng vấn `AskQuestion`, mọi câu hỏi đều kèm lựa chọn: **`Log as Tech Debt (Pending)`**.
- Nếu thành viên không hiểu rõ, chưa có câu trả lời, hoặc muốn hoãn quyết định để tham vấn thêm:
  - Agent **tự động sinh file phiếu nợ kỹ thuật** tại `qa/<SHORT>_NNNN.yaml` (dựa trên template `.coSquad/templates/qa.yaml`).
  - Phiếu ghi lại tiêu đề câu hỏi, bối cảnh, phương án gợi ý của Agent và đánh dấu trạng thái `pending`.
  - Phiên grill kết thúc thành công sạch sẽ với zero blocker! Các mục pending sẽ được giải quyết sau qua `/qa`.

## Dữ liệu đầu vào (Input)
- Đường dẫn tới file bundle (`.bundle.yaml`), hợp đồng API (`01-backend-spec.yaml`), testcase (`TC-*.yaml`), hoặc PRD (`index.md`).

## Kết quả đầu ra (Output)
- Báo cáo kiểm toán chất lượng từ các lệnh audit CLI của CoSquad.
- Phiên phỏng vấn làm rõ với phương án đề xuất tối ưu (`(Recommended)`).
- Tự động sinh file `qa/<SHORT>_NNNN.yaml` cho các câu hỏi bị hoãn.
- Tự động split và render tài liệu sang markdown hiển thị trên docs hub.

---

## Mẫu Prompt gọi lệnh

### Thẩm định Đặc tả Màn hình (Tổng hợp BQA + Dev)
```text
/grill surfaces/admin/ADM-01/settlement-export/settlement-export.bundle.yaml

Hãy thẩm định toàn diện màn hình này: rà soát quy tắc validation, xử lý lỗi 4 tầng và mapping endpoint API. Câu hỏi nào chưa rõ hãy tự động lưu thành QA tech debt.
```

### Thẩm định Hợp đồng Backend API
```text
/grill surfaces/admin/ADM-01/login/api/01/01-backend-spec.yaml
```
