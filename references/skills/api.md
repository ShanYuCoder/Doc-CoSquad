# Skill: `/api`

## Name
`api`

## Usage (Command/Trigger)
- CLI command: `coSquad api-gen --spec <path-to-01>`
- Slash command: `/api <page-id/slug>`
- Executed in Phase 2c to generate and implement backend controllers, services, and routes.

## Input
- Approved backend contract: `01-backend-spec.yaml` (never uses `ir/design.yaml` as codegen input).

## Output
- Production backend source code in target repository (Controllers, Models, Services, Requests/DTOs).
- Registered routes and middleware configurations.

## Description
- Implements backend API endpoints strictly adhering to the contract specification.
- Generates clean, idiomatic architecture matching the project's adapter profile (NestJS / Laravel / FastAPI / ASP.NET).

## Related Skills
- **Preceding:** `/api-spec`, `/grill`.
- **Subsequent:** `/unit` → `/api` → `/wire`.

---

## Example Prompt

```text
/api S-ADM-01-01

Generate and implement backend API endpoints using approved contract at surfaces/admin/ADM-01/orders/api/01/01-backend-spec.yaml.
```
