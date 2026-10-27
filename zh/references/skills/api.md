# Skill: `/api`

## 名称 (Name)
`api`

## 使用方式 (Command/Trigger)
- CLI command: `coSquad api-gen --spec <path-to-01>`
- Slash command: `/api <page-id/slug>`
- Executed in Phase 2c to generate and implement backend controllers, services, and routes.

## 输入 (Input)
- Approved backend contract: `01-backend-spec.yaml` (never uses `ir/design.yaml` as codegen input).

## 输出 (Output)
- Production backend source code in target repository (Controllers, Models, Services, Requests/DTOs).
- Registered routes and middleware configurations.

## 描述说明 (Description)
- Phase 3 后端开发顶层路由命令。根据当前上下文与参数自动分流至 `/api-spec`, `/api-spec`, `/grill` 或后端代码生成。
## 相关技能 (Related Skills)
- **Preceding:** `/api-spec`, `/grill`.
- **Subsequent:** `/unit` → `/api` → `/wire`.

---

## 提示词调用示例 (Example Prompt)

```text
/api S-ADM-01-01

Generate and implement backend API endpoints using approved contract at surfaces/admin/ADM-01/orders/api/01/01-backend-spec.yaml.
```

