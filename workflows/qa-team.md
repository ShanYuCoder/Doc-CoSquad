# Workflow — QA Inbox (Simplified)

**One QA = One File.** The filename = **QA Code** (immutable throughout the lifetime of the issue).

**QA Code format:** `{abbreviated screen/module}_{index}` — index increments sequentially **per prefix** (`0001`, `0002`…).

| Example Screen | Abbreviation (Suggested) | File |
|----------------|--------------------------|------|
| `S-ADM-01-01` | `ADM-AUTH` | `qa/ADM-AUTH_0001.yaml` |
| `S-ORD-01-01` | `ORD-LIST` | `qa/ORD-LIST_0001.yaml` |

CoSquad workspaces accept identifiers in `{abbreviated screen/module}_{index}` format.

---

## Hub Directory Structure

```text
qa/
  HOTEL-LIST_0001.yaml    # SSOT — complete conversation log + target spec
  ADM-AUTH_0002.yaml
  index.md                # CATALOG ONLY (rendered) — state + link + last entry
```

**Never** create separate subdirectories like `qa/open` / `qa/resolved`, or `supersedes` chains, or multiple files for the same issue.

---

## File Schema (SSOT)

Timeline **`updates[]`** — append **one entry per event** (never edit or delete historical rows):

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
      Should timezone filter resolve via property setting or user locale?
  - at: "20260930 10:00"
    by: ba-lead
    kind: answer
    text: |
      Resolve by property TZ; display UTC+7 label on UI.
  - at: "20261001 08:00"
    by: senior
    kind: review
    text: |
      needs-change: add AC when property has no configured TZ.
```

**Timestamp format for `at`:** `YYYYMMDD HH:mm` (team convention) or ISO 8601 — keep **consistent across the repository**.

| `kind` | Who / When |
|--------|------------|
| `question` | Opening a QA item (Log Tech Debt / AskQuestion) |
| `answer` | Finalizing a decision — accompanied by a spec patch (`/qa`) |
| `review` | Senior feedback; if `needs-change` is in the text → sets `status: open` |
| `note` | Informational remarks without spec alterations |

**`needs-change` handling:** Do not create a new file — **append** `kind: review` (or `note`) → set `status: open` → developer appends `answer` upon applying spec revisions.

---

## `qa/index.md`

Table overview only (rendered view):

| ID | Status | Screen | Last Updated | Summary |
|----|--------|--------|--------------|---------|

SSOT content resides in YAML files; the index **never** copies raw log bodies.

---

## Skills

| Skill | Action |
|-------|--------|
| Open QA | Creates `qa/{CODE}_NNNN.yaml` with initial `updates[0]` of kind `question` |
| `/qa` | Appends `answer` + patches `target` in bundle/01 + sets `status: closed` (if resolved) |
| `/qa` | Appends `kind: review` — does not patch bundle directly (unless user triggers `/spec`) |

Grilling / AskQuestion integration: [grill-and-human-review.md](./grill-and-human-review.md) · `Q-*` field-level tags: [SSOT Artifacts](../artifacts/index.md).

---

## Solo vs Team Operations

| Dimension | Solo + AI | Team |
|-----------|-----------|------|
| Files | 1 file per case | Same — senior reviews `updates[]` |
| Tracing | Sequential top-down reading | Git blame + timeline audits |
| Index | Optional render | Central status dashboard for leads |

Templates: `.coSquad/templates/qa.yaml` + `qa-authoring.md` (schema `cosquad-qa-item/v1`) · Extracts: `qa-inbox.md`, `qa-team.md`.
