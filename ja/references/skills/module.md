# Skill: `/module`

## スキル名 (Name)
`module`

## 使用方法 (Command/Trigger)
- スラッシュコマンド実行：`/module`
- Executed in Phase 0 to define module clusters under specific surfaces.

## 入力 (Input)
- Surface directory and functional domain breakdown.

## 出力 (Output)
- Module-level specification: `<module>.module.yaml` and directory structure under `surfaces/<surface>/<module>/`.
- Pre-allocation of shared Module APIs under `common/yaml/<slug>/`.
- Screen catalog listing projected leaf screens (`S-*`).

## 説明・役割 (Description)
- Phase 0 において機能モジュール (`{surfaceCode}-{id}`) の責務境界、依存関係、内包画面一覧、提供機能を定義。
## 関連スキル (Related Skills)
- **Preceding:** `/spec`.
- **Subsequent:** `/user-flow`, `/db-erd`, `/spec`.

---

## プロンプト実行例 (Example Prompt)

```text
/module

Surface: surfaces/admin/
Create module ADM-01 (Hotel Management) containing screens for Hotel List (S-01), Hotel Detail/Edit (S-02), and Room Allocation (S-03).
```

