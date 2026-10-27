# 🛠 CLI 命令与 Agent 技能手册 (References)

本文档整理了 CoSquad 提供的完整命令行工具（CLI Commands）、模型上下文协议工具（MCP Tools）以及 AI 智能体技能库（Skills）。

---

## 快速安装 CoSquad CLI

**运行环境要求：** Node.js **≥ 24**。

**推荐安装方式 — 通过 pnpm 全局安装**（Linux, macOS, WSL, Windows PowerShell 通用）：

```bash
pnpm add -g @shanyucoder/cosquad@latest
```

| 常用替代安装方式 | 命令 |
| :--- | :--- |
| **GitHub 全局安装（开发分支）** | `pnpm add -g github:ShanYuCoder/CoSquad --allow-build=@shanyucoder/cosquad` |
| **npx 即时调用** | `npx -y -p @shanyucoder/cosquad@latest coSquad <command>` |
| **npm 全局安装** | `npm install -g @shanyucoder/cosquad@latest` |
| **Bash 脚本一键安装** | `curl -fsSL https://raw.githubusercontent.com/ShanYuCoder/CoSquad/main/install.sh \| bash` |

- **CLI 更新：** `coSquad update`
- **检查新版本：** `coSquad update --check`
- **卸载：** `coSquad uninstall`

---

## ⚙️ 核心处理引擎命令 (CoSquad CLI)

CoSquad 组织了三大底层处理引擎：**文档引擎 (Docs Engine)**、**代码引擎 (Code Engine)** 和 **测试引擎 (Test Engine)**：

### 1. 文档引擎 (Docs Engine — 规格与文档管理)

| CoSquad 命令 | 功能描述 |
| :--- | :--- |
| `coSquad split` | 将 `.bundle.yaml` 拆分为 `ir/design.yaml`, `ir/spec.yaml`, `ir/generated/spec.md`。 |
| `coSquad split_all` | 递归扫描并拆分工作区内所有的 Bundle YAML 文件。 |
| `coSquad render` | 将 UI 设计规范从 YAML 重新渲染为 Markdown（数据字典与状态矩阵）。 |
| `coSquad dev` | 启动本地 VitePress 文档中心服务（默认端口 **5173**）。提供统一 SSOT 架构（overview, architecture, surfaces, cases, scenarios）。 |
| `coSquad build` | 执行 `vitepress build` 编译静态文档站点。 |
| `coSquad publish` | 发布文档资产并生成 `CATALOG.md`。 |
| `coSquad openapi_gen` | 从 `01-backend-spec.yaml` 自动生成或更新 OpenAPI 片段。 |
| `coSquad openapi_render` | 将各 OpenAPI YAML 片段整合汇总到 `docs/api-spec/api.yaml`。 |
| `coSquad openapi_build_ui`| 为文档中心构建静态 Swagger UI 在线交互界面。 |
| `coSquad api:check` | 在生成后端代码前校验 `01-backend-spec.yaml` 的合法性。 |

### 2. 审计与安全防护命令 (PR 审核与静态质量门禁)

| 命令 | 概述 |
| :--- | :--- |
| `coSquad audit` | 显示审计帮助信息。 |
| `coSquad audit spec …` | 审计前端 UI/spec bundle 规格文件及交互状态完整度。 |
| `coSquad audit api …` | 审计 `01-backend-spec.yaml` 后端接口契约规格。 |
| `coSquad audit flow …` | 审计 `FLOW-*.md` 业务流章节完整性与跨屏引用。 |
| `coSquad audit testcase …` | 审计 `TC-*.yaml` 测试用例与页面特征包的一致性。 |
| `coSquad audit fe-be …` | 校验前端 `apiRef` 与后端接口规范的字段映射与对齐。 |
| `coSquad audit scenario …`| 审计场景覆盖率。 |
| `coSquad audit e2e …` | 审计 Playwright 自动化测试与测试用例计划的覆盖度。 |
| `coSquad harness sync` | 从 `.coSquad/config.json` 自动同步技能、规则与 MCP 配置到各 IDE。 |
| `coSquad doctor` | 全面体检工作区配置、MCP 环境变量及工具链健康度。 |
| `coSquad doctor --fix` | 自动修复缺失的 `AGENTS.md` 并重新同步治理骨架。 |

### 3. 测试引擎 (Test Engine — 测试与质量保障)

| CoSquad 命令 | 功能描述 |
| :--- | :--- |
| `coSquad cases:render` | 在测试文档中心中将 Testplan YAML 矩阵渲染为 Markdown。 |
| `coSquad cases:check` | 验证测试计划 YAML 的语法及 JSON Schema 合规性。 |
| `coSquad cases:gate` | CI/CD 质量准入强关卡（Schema v2 + TC 审计 + 追溯性检查）。 |
| `coSquad cases:coverage` | 计算测试场景覆盖率，快速发现无测试用例的规格页面。 |
| `coSquad testcase:gen` | 根据 TC YAML 自动生成 Playwright E2E UI 自动化测试用例代码。 |
| `coSquad testcase:gen:api`| 根据 TC YAML 自动生成 Playwright API 自动化测试用例钩子。 |

### 4. 代码引擎 (Code Engine — 代码与单元测试自动生成)

| CoSquad 命令 | 功能描述 |
| :--- | :--- |
| `coSquad gen` | 根据 `ir/design.yaml` 自动生成前端 UI 页面与组件代码。 |
| `coSquad unit-gen` | 自动生成前端组件单元测试用例套件（Jest / Vitest）。 |
| `coSquad api-gen` | 根据 `ir/spec.yaml` 自动生成后端路由、控制器与服务代码。 |
| `coSquad api-unit-gen` | 自动生成后端单元测试用例套件（Pytest, PHPUnit, xUnit）。 |
| `coSquad contract-gen` | 自动生成共享 TypeScript 接口类型与 DTO 契约。 |
| `coSquad build-template-code --sample=<dir>` | 深度学习既有黄金样例（Golden Sample）模块的 AST 结构与代码习惯。 |
| `coSquad build-template-code --yes` | 将训练好的自定义模板写入 `.coSquad/adapters/` 适配器中。 |

#### 技术栈与适配器兼性矩阵 (Stacks & Adapters)

| 类别 | 开箱即用适配器 (OOTB) | 自定义技术栈 (Custom via Golden Sample) |
| --- | --- | --- |
| **前端 (Frontend)** | `nuxt4` (Nuxt 4), `nextjs` (Next.js), `dotnet-line` (DotNet Line 客户端) | 支持通过 `coSquad build-template-code --sample=<dir>` 或 `/adopt` 提取既有代码基因，自动生成针对 Vue 3、React、Angular、Svelte 等任意技术栈的代码模板。 |
| **后端 (Backend)** | `nestjs` (NestJS), `fastapi` (FastAPI), `laravel` (Laravel), `dotnet-integration` (DotNet) | 仅需指定任意标准模块目录（Golden Sample），CoSquad 即可提炼项目模式并自动生成模板（`.hbs`、`.stub`、`.j2`、`.scriban`）。 |

