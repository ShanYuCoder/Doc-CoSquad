# QA file template (`cosquad-qa-item/v1`)

## Toolkit (sau `coSquad init`)

| File | Vai trò |
|------|---------|
| `.coSquad/templates/qa-item.yaml` | Golden YAML — copy khi mở QA |
| `.coSquad/templates/qa-authoring.md` | Quy tắc field, naming, timeline |
| `.coSquad/schemas/qa-item.schema.json` | JSON Schema (validate) |

Repo CoSquad: [`templates/shared/qa-item.yaml`](../../../templates/shared/qa-item.yaml) · [`qa-authoring.md`](../../../templates/shared/qa-authoring.md).

## Helper (CLI / test / agent)

`engines/docs/lib/qa-item.mjs`:

- `formatQaAt()` — timestamp `YYYYMMDD HH:mm`
- `suggestQaShort('W-HOTEL-LIST')` → `HOTEL-LIST`
- `nextQaId(hubRoot, SHORT)` → `HOTEL-LIST_0002`
- `validateQaItem(doc)` / `validateQaItemFile(path)`

## Skills

- Mở: `/spec`, grill-* — extract `qa-inbox.md`
- Đóng: `/qa-resolve` · Review: `/qa-review`
- Workflow: [qa-team.md](../../workflows/qa-team.md)
