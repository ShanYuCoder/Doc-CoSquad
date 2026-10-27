# Skill: `/qa`

## Name
`qa` (alias: `qa-resolve`)

## Usage (Command/Trigger)
- Call via slash command: `/qa`
- Automatically detects the lifecycle mode from prompt and parameters:
  - **Mode 1 (Inbox / List):** `/qa` or `/qa list` $\rightarrow$ Lists and groups all open Tech Debt tickets.
  - **Mode 2 (Create Ticket):** `/qa create <title>` $\rightarrow$ Manually creates a new Tech Debt ticket.
  - **Mode 3 (Resolve Ticket):** `/qa <ID> <solution>` $\rightarrow$ Patches target spec bundle or API contract and closes ticket.
  - **Mode 4 (Review Ticket):** `/qa <ID> review approved|rejected` $\rightarrow$ Logs senior verification verdict.

## Input
- QA Ticket ID (e.g. `Q-ADM-01-01-01` or `Q-ORD-0001`; legacy `QA-ORD-0001` or `HOTEL-LIST_0001`), solution text, or review verdict.

## Output
- **Mode 1:** Status overview table in chat.
- **Mode 2:** New ticket file `qa/<id>.yaml` (e.g. `qa/Q-ADM-01-01-01.yaml` or sequence `qa/<SHORT>_NNNN.yaml`).
- **Mode 3:** Patched target file (`*.bundle.yaml` or `01-backend-spec.yaml`), updated ticket (`status: closed`), and split/render execution.
- **Mode 4:** Recorded review log entry in `updates[]`.

---

## Example Prompts

### Mode 1: Review Open Tech Debt Inbox
```text
/qa list
```

### Mode 2: Resolve Pending Ticket
```text
/qa Q-ADM-01-01-01

Add idempotency key requirement: Header X-Idempotency-Key is required with UUIDv4 format, valid for 24 hours.
```
