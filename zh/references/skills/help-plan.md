# Skill: `/help-plan`

## 名称 (Name)
`help-plan` (High-Precision Implementation Planning & User Flow Navigation Advisor)

## 使用方式 (Command/Trigger)
- 调用 Slash 命令：**`/help-plan <需求描述 / CR / 缺陷详情>`**
- 当收到新需求、CR 或 Bug 修复时使用。强制执行“现场勘查”与按实体细分 Phase 的垂直闭环开发计划。

## 核心哲学：“机器控量，人类把质”

1. **机器负责“量”（全面性与无遗漏机械核验）：**
   - **信息全面度 100%：** 严禁敷衍概括，**绝对严禁一切占位符 (`[file1]`, `[test-command]`, `TODO`, `...`)**。
   - **全面审计清单：**
     - *UI 界面:* 页面标题、面包屑、路由路径、输入控件（类型、校验规则）、操作按钮、状态机（加载、禁用、空、报错）。
     - *数据库 (重点关注，绝不可遗漏 DB):* 表名、字段定义、约束（主键、外键、唯一、非空、默认值）、索引、事务、软删除、时间戳、Migration 迁移文件。
     - *API 接口:* 路由端点、HTTP 动词、请求/响应 DTO、查询参数、状态码（200, 400, 401, 403, 404, 422, 500）。
     - *测试用例:* 正常链路、异常链路、边界场景（Off-by-one, 空列表, 竞态条件）、安全隔离（IDOR, RBAC, 多租户）。
   - **给出明确选项 (A / B / C)：** 若信息不全或需求不明，AI 必须给出具象建议方案：
     - **方案 A (Recommended):** 基于当前架构的最佳方案。
     - **方案 B (Alternative):** 备选方案并附带权衡分析。
     - **方案 C (Log as Tech Debt):** 记入 QA 技术债待办 (`qa/`)。

2. **人类负责“质”（真实性与最终决策权）：**
   - 团队（BA / Dev / QA）负责把关输入信息与选择的真实准确性。
   - 评估逻辑完备性并点击 **Proceed** 按钮审批进入下一阶段。

## 黄金法则：严禁占位符 (ZERO PLACEHOLDER POLICY)
- 严禁出现 `[file1]`, `[file2]`, `[test-command]`, `TODO`。
- 所有文件路径必须为工作区内真实存在的坐标。
- 所有数据库表名、字段名、类名、函数名必须通过前置现场勘查从源码和 Migration 中如实提取。
- 所有校验命令必须为 100% 可直接执行的 CLI 指令。

## 垂直切片与分 Phase 执行规范 (Context-Based Vertical Phasing)

> [!CAUTION]
> **切忌“水平漏斗式粗糙概括 (Waterfall Skimming)”：**
> 严禁拆成：Phase 1 走马观花看 6 个页面，Phase 2 稍微深入，Phase 3 补洞。
> **必须按具体实体 / 屏幕 / 业务流划分独立 Phase，每屏走完完整文档与测试闭环。**

- **步骤 0 — 必须的前置现场勘查 (Deep Reconnaissance):**
  - 在编写计划前，必须运行工具深挖数据库 Migration、Model、Route、Controller 和前端组件代码。
  - 对照 `inition-inventory.md` 提取相关页面 (`W-*`) 与业务流 (`FLOW-*`)。
- **Phase 0 — 全局导航图谱 (Master Navigation Map):**
  - 列出核心屏幕、跨端关联屏幕、数据库实体及 5 环关联业务流。
- **Phase 1 — 数据库基石与迁移 (Database Foundation):**
  - 详细定义表结构、字段类型、外键约束、索引及新建 Migration 文件。
- **Phase 2..N — 单屏幕独立垂直切片 (每屏一个独立 Phase):**
  - **单屏跑通完整研发闭环**：
    1. 研读真实 View + Controller + DB 源码。
    2. 100% 审计 UI 元素、API DTO、DB 查询（若缺失则提供 A/B/C 选项）。
    3. 运行 `/trace /spec` (或 `/spec`) 编写 `W-*.bundle.yaml`。
    4. 运行 `/grill-bqa` 与 `/grill-dev` 对抗质询。
    5. 运行 `/testcase` 生成 `TC-*.yaml`。
    6. 运行验证命令：`coSquad audit spec`、`coSquad split`、`coSquad audit testcase`。
    7. Phase Gate：发布 Phase 报告并停下等待审批，完成后方可进入下一屏。
- **Phase K — 跨端关联屏幕 (Cross-Surface Screens):**
  - 勘查并更新其他端受波及的屏幕规范。
- **Phase M — 业务流串联与综合审计 (`FLOW-01` -> `FLOW-N`):**
  - 编写完整的 `FLOW-*.md` 贯穿 5 环链路，运行 `coSquad audit flow`。
- **Phase P — TDD 编码与端到端测试 (若任务包含代码落地):**
  - Red -> Green -> Wire -> `coSquad audit e2e`。

## 客户端原生对接
- **Google Antigravity IDE**: 生成 Artifact `implementation_plan.md`，携带 `RequestFeedback: true` 唤起原生 **"Proceed"** 按钮。
- **Cursor**: 写入 `.cursor/plans/[task-slug].plan.md` 唤起 **"Build"** / **"Do Plan"**。
- **Claude Code**: 写入 `.claude/plans/[task-slug].md` 唤起确认提示。
