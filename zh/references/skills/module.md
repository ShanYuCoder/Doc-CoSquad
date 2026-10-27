# Skill: `/module`

## 名称 (Name)
`module`

## 使用方式 (Command/Trigger)
- 调用 Slash 命令：`/module`
- Executed in Phase 0 to define module clusters under specific surfaces.

## 输入 (Input)
- Surface directory and functional domain breakdown.

## 输出 (Output)
- Module-level specification: `<module>.module.yaml` and directory structure under `surfaces/<surface>/<module>/`.
- Pre-allocation of shared Module APIs under `common/yaml/<slug>/`.
- Screen catalog listing projected leaf screens (`S-*`).

## 描述说明 (Description)
- 在 Phase 0 定义业务模块 (`{surfaceCode}-{id}`) 的职责边界、依赖关系、包含的屏幕清单与对外能力契约。
## 相关技能 (Related Skills)
- **Preceding:** `/spec`.
- **Subsequent:** `/user-flow`, `/db-erd`, `/spec`.

---

## 提示词调用示例 (Example Prompt)

```text
/module

Surface: surfaces/admin/
Create module ADM-01 (Hotel Management) containing screens for Hotel List (S-01), Hotel Detail/Edit (S-02), and Room Allocation (S-03).
```

