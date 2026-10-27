# 🔌 Hướng dẫn Tích hợp Plugin Đa Nền tảng cho AI Agents & IDEs

CoSquad hỗ trợ song song hai mô hình triển khai: **Khởi tạo Harness trực tiếp trong Workspace** (qua lệnh `coSquad init` / `harness sync`) và **Cài đặt Dạng Native Plugin** tương thích với các AI Agent và IDE phổ biến nhất hiện nay.

Nhờ tuân thủ chuẩn plugin mở, bạn có thể cài đặt CoSquad trực tiếp vào môi trường làm việc của mình mà không cần phải sao chép thủ công các thư mục kỹ năng vào từng dự án.

---

## 1. Danh sách AI Agents & IDEs được Hỗ trợ

| Agent / IDE | Cấu hình / Manifest Plugin | Lệnh cài đặt |
| :--- | :--- | :--- |
| **Google Antigravity IDE** | `.antigravity-plugin/plugin.json` | `agy plugin install https://github.com/ShanYuCoder/CoSquad` |
| **Claude Code** | `.claude-plugin/plugin.json`<br>`.claude-plugin/marketplace.json` | `/plugin marketplace add ShanYuCoder/CoSquad`<br>`/plugin install coSquad@coSquad-marketplace` |
| **Cursor** | `.cursor-plugin/plugin.json`<br>`hooks/hooks-cursor.json` | `/add-plugin coSquad` hoặc tự động nhận diện từ repo |
| **Gemini CLI** | `gemini-extension.json`<br>`AGENTS.md` | `gemini extensions install https://github.com/ShanYuCoder/CoSquad` |
| **OpenAI Codex** | `.codex-plugin/plugin.json` | `/plugins install coSquad` |
| **Devin CLI** | `.devin-plugin/plugin.json` | `devin plugins install ShanYuCoder/CoSquad` |
| **Chuẩn Agent Mở** | `.agents/plugins/marketplace.json` | Tự động phát hiện trong `.agents/plugins/` |

---

## 2. Hướng dẫn Cài đặt theo từng Nền tảng

### Google Antigravity IDE
Cài đặt CoSquad như một plugin chính thức trực tiếp từ repository:
```bash
agy plugin install https://github.com/ShanYuCoder/CoSquad
```
Antigravity sẽ tự động nhận diện toàn bộ các skill (`/help-plan`, `/spec`, `/spec`, `/grill`, `/trace`,...) và gợi ý các prompt mẫu trong giao diện.

### Claude Code
Thêm marketplace của CoSquad và cài đặt plugin:
```bash
/plugin marketplace add ShanYuCoder/CoSquad
/plugin install coSquad@coSquad-marketplace
```
Claude Code sẽ tự động kích hoạt lifecycle hook `SessionStart`, nhắc nhở Agent về các quy tắc Hard-Gate của CoSquad ngay khi mở phiên chat.

### Cursor
Trong giao diện chat của Cursor Agent:
```text
/add-plugin coSquad
```
Hoặc mở bất kỳ dự án nào có chứa file `.cursor-plugin/plugin.json`. Cursor sẽ tự động liên kết thư mục skills và nạp `hooks/hooks-cursor.json`.

### Gemini CLI
Cài đặt CoSquad dưới dạng phần mở rộng (extension) cho Gemini:
```bash
gemini extensions install https://github.com/ShanYuCoder/CoSquad
```

### Devin CLI
Cài đặt plugin vào Devin:
```bash
devin plugins install ShanYuCoder/CoSquad
```

---

## 3. Cơ chế Vòng đời Lifecycle Hooks (`hooks/`)

CoSquad cung cấp hệ thống hook đa nền tảng trong thư mục `hooks/`:
- **`hooks/hooks.json`**: Cấu hình hook `SessionStart` cho Claude Code.
- **`hooks/hooks-cursor.json`**: Cấu hình hook `sessionStart` cho Cursor.
- **`hooks/run-hook.cmd`**: Trình bao bọc đa năng (Polyglot runner) tự động phát hiện Bash trên Linux/macOS hoặc Git Bash trên Windows.
- **`hooks/session-start`**: Kịch bản tự động nạp ngữ cảnh chỉ dẫn CoSquad khi khởi động phiên làm việc.

### Vai trò của Hook Session-Start:
Ngay khi mở một phiên làm việc mới, hook sẽ tự động "nhắc nhở" AI Agent về các nguyên tắc bất di bất dịch của CoSquad:
1. **Hard-Gate (Không viết code sớm):** Tuyệt đối cấm sinh mã nguồn hoặc chỉnh sửa file trước khi đặc tả (spec) được phê duyệt.
2. **Kế hoạch Triển khai (`/help-plan`):** Bắt buộc dò quét toàn bộ chuỗi 5 mắt xích User Flow liên đới, đối chiếu hiện trạng code thực tế qua `/trace`, và đánh giá 5 rủi ro thất bại hàng đầu.
3. **Luật Thép về Xác minh (Iron Law of Verification):** Không được tuyên bố hoàn thành nếu không có bằng chứng lệnh chạy thành công với Exit Code 0.

---

## 4. So sánh Native Plugin vs Workspace Harness (`coSquad init`)

CoSquad mang đến hai phương thức sử dụng linh hoạt:

| Tiêu chí | Native Plugin | Workspace Harness (`coSquad init`) |
| :--- | :--- | :--- |
| **Cơ chế hoạt động** | Cài đặt một lần qua Agent Marketplace hoặc URL Git. Skill kích hoạt trên mọi dự án. | Sao chép cấu hình `.coSquad/config.json`, MCP server nội bộ và thư mục `.cursor/` / `.antigravity/` vào dự án. |
| **Phù hợp với** | Lập trình viên cá nhân dùng Claude Code, Cursor, Antigravity, Codex trên nhiều repo khác nhau. | Đội ngũ doanh nghiệp, hệ thống CI/CD, Monorepo và Docs Hub tập trung (`COSQUAD_DOCS_ROOT`). |
