# Workflow — QA inbox (đơn giản)

**Một QA = một file.** Tên file = **mã QA** (không đổi suốt đời case đó).

**Mã QA:** `{màn/module rút gọn}_{index}` — index tăng dần **theo prefix** (0001, 0002…).

| Ví dụ màn | Rút gọn (gợi ý) | File |
|-----------|-----------------|------|
| `S-ADM-01-01` | `ADM-AUTH` | `qa/ADM-AUTH_0001.yaml` |
| `S-ORD-01-01` | `ORD-LIST` | `qa/ORD-LIST_0001.yaml` |

CoSquad chấp nhận id dạng `{màn/module rút gọn}_{index}`.

---

## Cấu trúc hub

```text
qa/
  HOTEL-LIST_0001.yaml    # SSOT — toàn bộ hội thoại + target spec
  ADM-AUTH_0002.yaml
  index.md                # CHỈ catalog (render) — state + link + dòng cuối
```

**Không** `qa/open` / `qa/resolved` / `supersedes` / nhiều file cho một case.

---

## Nội dung file (SSOT)

Timeline **`updates[]`** — mỗi sự kiện **append một dòng** (không sửa/xóa dòng cũ):

```yaml
schema: cosquad-qa-item/v1
id: HOTEL-LIST_0001
screen: W-HOTEL-LIST
status: open          # open | closed
target:
  path: surfaces/.../hotel-list.bundle.yaml
  at: design.zones.filter.timezone
updates:
  - at: "20260930 08:00"
    by: middle-dev
    kind: question
    text: |
      Filter timezone lấy theo property hay user locale?
  - at: "20260930 10:00"
    by: ba-lead
    kind: answer
    text: |
      Theo property TZ; hiển thị label UTC+7 trên UI.
  - at: "20261001 08:00"
    by: senior
    kind: review
    text: |
      needs-change: thêm AC khi property chưa set TZ.
```

**Quy ước `at`:** `YYYYMMDD HH:mm` (team) hoặc ISO — giữ **thống nhất trong repo**.

| `kind` | Ai / khi |
|--------|----------|
| `question` | Mở QA (Log Tech Debt / AskQuestion) |
| `answer` | Chốt quyết định — kèm patch spec (`/qa`) |
| `review` | Senior góp ý; nếu `needs-change` trong text → `status: open` lại |
| `note` | Ghi chú, không đổi spec |

**`needs-change`:** không tạo file mới — **append** `kind: review` (hoặc `note`) → `status: open` → middle append `answer` sau khi sửa spec.

---

## `qa/index.md`

Chỉ bảng (render):

| Mã | Status | Screen | Cập nhật cuối | Tóm tắt |
|----|--------|--------|---------------|---------|

SSOT nội dung = file YAML; index **không** copy full log.

---

## Skill

| Skill | Việc |
|-------|------|
| Mở QA | Tạo `qa/{CODE}_NNNN.yaml` + `updates[0]` kind `question` |
| `/qa` | Append `answer` + patch `target` trên bundle/01 + `status: closed` (nếu chốt) |
| `/qa` | Append `kind: review` — không patch bundle (trừ khi user chạy `/spec`) |

Grill / AskQuestion: [grill-and-human-review.md](./grill-and-human-review.md) · tag `Q-*` trên field: [SSOT Artifacts](../artifacts/index.md).

---

## Solo vs team

| | Solo + AI | Team |
|--|-----------|------|
| File | 1 file / case | Cùng — senior đọc `updates[]` |
| Trace | Đọc file từ trên xuống | Git blame + timeline |
| Index | Tùy chọn render | Bảng trạng thái cho lead |

Template: `.coSquad/templates/qa.yaml` + `qa-authoring.md` (schema `cosquad-qa-item/v1`) · extract: `qa-inbox.md`, `qa-team.md`.
