# Skill: `/testcase`

## Name
`testcase`

## Usage (Command/Trigger)
- Call via slash command: `/testcase <W-* or slug>`
- Authoring skill in **Phase 2b (Tests)** on the tests-docs hub (`COSQUAD_TESTS_DOC`).

## Input
- Full leaf specification: `*.bundle.yaml` (`userStories`, `acceptanceCriteria`, actions, `testIds`).
- Rendered specification: `ir/generated/spec.md`.

## Output
- Test case plan YAML: `cases/**/TC-*.yaml` (`schemaVersion: 2`).
- Rendered human-readable test case: `TC-*.md` via `coSquad cases:render`.

## Description
- Authors comprehensive test case plans directly from business acceptance criteria.
- Enforces multi-facet test matrices covering happy paths, business validations, authorization edge cases, and error boundaries.
- **Traceability:** Links every test step directly back to bundle stories, ACs, and `data-testid` selectors.

## Related Skills
- **Preceding:** `/spec`, `/grill`.
- **Subsequent:** `/grill` → `coSquad testcase:gen` → `/test`.

---

## Example Prompt

```text
/testcase W-ADM-ORD-01

Author full testcase plan for Order Listing screen covering pagination, status filtering, empty search results, and CSV export.
```
