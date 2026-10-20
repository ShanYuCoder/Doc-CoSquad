<p align="center">
  <a href="./README.md"><b>English</b></a> |
  <a href="./README.vi.md"><b>Tiếng Việt</b></a> |
  <b>简体中文</b> |
  <a href="./README.ja.md"><b>日本語</b></a>
</p>

<!-- cosquad-catalog -->
**[文档目录](CATALOG.md)**
<!-- /cosquad-catalog -->

# CoSquad 🚀

> **AI 驱动且确定性的软件工程自动化研发工具箱 (AI-Powered & Deterministic SDLC Automation Toolkit)**  
> 为高节奏软件研发团队坚守 SDLC 工程纪律与单一可信数据源 (SSOT) 完整性，免除高昂的手工文档维护成本。

---

## 📦 快速安装 (Quick Start)

使用 Git Personal Access Token (PAT) 通过自动化发布脚本将工具箱直接安装到您的环境中：

```bash
export COSQUAD_GITHUB_TOKEN=github_pat_XXXXX
export COSQUAD_REF=latest

curl -fsSL \
  https://raw.githubusercontent.com/ShanYuCoder/Doc-CoSquad/main/scripts/install-from-release.sh \
  | bash -s -- "$COSQUAD_GITHUB_TOKEN"
```

---

## 🔄 规范化研发流水线 (Workflow Pipeline)

AI 服务人类 — AI 不会替代人类：

- **AI 负责“***量***”：**
  - AI Agent 负责保证结构化信息的**数量充足与结构完整**。
  - 自动审计检查信息是否齐全；若不齐全，AI 主动提出备选方案 *(例如：检查页面是否已有标题、面包屑？表单组件是否具备完整的类型、校验规则与错误状态？... 若不齐全则主动提供选项供用户选择或补充)*。
- **人类负责“***质***”：**
  - 人类对提供给 AI 的信息的**准确性与严谨度**承担最终责任。
  - 对 AI 给出建议选项时的**决策与选择**直接负责。
  - 最终交付的软件产品是否准确、各环节是否紧密关联，根本上完全取决于人类输入的信息质量以及人类作出的决策选择。

```text
原始业务需求（要点 / 截图 / 遗留代码）
  │
  ▼
AI 规范化生成需求包 (Bundle) + 中间表示 (IR) + 渲染 Markdown
  │
  ▼
通过反复制代码守卫 (Anti-Copy-Paste Guard) 消除冗余并沉淀通用目录 (CMN-*)
  │
  ▼
交互式原型 + BA / QA / Dev 协同评审
  │
  ▼
自动化代码生成：E2E Playwright / 后端 / 联调脚手架 + 安全防护网
```

![与源码并行的多层 Artifact 规范体系](./assets/overview-artifact-layers.png)

---

## 🎯 目标：敏捷 T 型跨职能团队模型 (Agile T-Shaped Team)

```text
                                 COSQUAD 智能协同研发平台
                               (敏捷 T 型跨职能团队模型)
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
       面向非技术人员 (BA / QA / PO)                                   面向技术研发人员 (DEV / CODER)
   ─────────────────────────────────                              ──────────────────────────────
1. 代码考古与业务提取：                                          1. 强大的代码生成助手：
   深入剖析 5 层代码，干净剥离业务逻辑，                            自动化生成脚手架、样板代码、Mock API、
   并精准标注源码行号。                                            同步 IR、规范格式化 Swagger。

2. 需求变更与新特性 (CR/New Feature)：                         2. 对抗性业务质询 (BA 职能)：
   不仅是撰写规范 — CoSquad 直接从已审核                           - 深度质询边界条件、并发竞争与反向目标，
   规范自动生成代码并完成连线，交付可运行产品！                    在编码前彻底锁定严谨逻辑。
                                                                  - 将生硬的技术术语转化为优雅贴近用户的语言。
3. 自信高效决策：
   主动提供推荐方案 (Recommended) + 备选方案                       3. 严密的质量门禁 (QA 职能)：
   + 技术债务评估，助力业务人员无需依赖开发                        - 自动补齐异常路径 (Unhappy Paths)、极端场景、
   即可自信完成 80% 的审批决策。                                  数据泄露及风暴异常...
                                                                  - 基于规范自动生成 E2E Playwright 测试代码。
```

- **面向非技术人员 (BA / QA / PO)：**
  - **代码考古与业务提取：** 自主探索 5 层源码架构，精准抽离业务规则并附带行号出处。
  - **特性自动化落地：** 面对需求变更 (CR) 或新模块时，CoSquad 直接基于规范通过 `/api`、`/prototype`、`/wire` 生成代码并完成端到端打通，交付真实运行产品。
  - **自主掌控决策：** 获得多维度的 `(Recommended) + Alternative + Tech Debt` 决策建议，自信拍板 80% 的日常业务方案而无需依赖研发排期。

- **面向技术研发人员 (DEV / CODER / LEAD)：**
  - **摆脱繁琐事务：** 彻底自动化脚手架、样板代码、Mock API、IR 同步与 Swagger 格式化，释放 100% 精力聚焦核心架构与深层逻辑。
  - **业务对抗协同 (BA 职能)：** 系统主动质询高并发、边界场景与反向约束，同时将技术层级报错（*500 Internal Error*, *Unique constraint failed*）转译为精致的产品化表达。
  - **严密质量保障 (QA 职能)：** 全面挖掘异常分支与错误风暴场景，扫除思维盲区并自动输出工业级 E2E Playwright 测试脚本。

![SSOT Hub — 敏捷 T 型跨职能协同平台](./assets/overview-ssot-hub.png)

---

## ⚡ 6 大架构与工程化核心优势

| # | 核心导向标语 | 核心价值与意义 |
| :-: | :--- | :--- |
| **1** | **拓展 T 型人才边界** | 消除专业技能孤岛：Dev 深度理解业务，BA 自主制作原型，QA 主动生成自动化测试。 |
| **2** | **早期反馈交互原型** | 早期锁定界面与交互流转，凭借高保真真实交互原型彻底消除 80% 的后期返工风险。 |
| **3** | **闭环自动化测试** | 基于测试用例文档矩阵直接自动生成 E2E Playwright 代码 (`*.spec.ts`)，告别繁重的人工回归测试。 |
| **4** | **反复制粘贴守卫** | 彻底扫除冗余代码，通过通用资产目录 (`CMN-UI-*`, `CMN-API-*`, `CMN-DTO-*`) 强制规范统一复用。 |
| **5** | **机器控“量”，人类把“质”** | `coSquad audit` 机械核验结构与 Schema 完整性 — 团队（BA/Dev/QA）负责对抗质询 (*grill*) 并做出终审决策。 |
| **6** | **标准框架 - 按需权衡** | 轻量项目可灵活缩减流程，对于关键核心业务 (Hotspots) 则严格恪守从规范到 E2E 测试的全套严谨治理。 |

![结合早期交互式原型与规范校准研发阶段](./assets/overview-phase-recalibration.png)

---

## 🔄 与 AI Agent 协同的全流程研发工作流

环境配置就绪后，在 AI Agent（Cursor、Antigravity、Claude Code 等）中打开工作区，依照如下流水线协作推进：

```text
                        coSquad setup
                        (搭建工作区)
                              │
                            /init
                    (扫描并映射代码仓库)
                              │
                          项目类型？
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
     (维护型 Maintain)    (重构型 Rebase)       (全新 Greenfield)
         │                    │                    │
      /trace               /legacy               /spec
    (代码考古)           (提取遗留资产)         (特性需求规范)
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    /prototype & /api-spec
                              │
                    /testcase & codegen
                              │
                            /wire
                        (联调集成与打包)
```

### 关键执行步骤详解

| 步骤 | 命令 / Skill | 核心职责与说明 |
| :--- | :--- | :--- |
| **1. Setup 初始化** | `coSquad setup [name]` | 初始化工程骨架，配置 MCP 服务并就绪 AI agent harness 环境。 |
| **2. Discover 探测** | `/init` | Agent 扫描工作区，映射 surface 边界，提炼通用资产 (`CMN-*`) 并激活反复制粘贴守卫。 |
| **2.1. 制定计划** | `/help-plan` | 深度分析 `inition-inventory.md`、配置与现存状态，输出步骤明确的 Action Plan 并全面审查关联 User Flow。 |
| **2.2. 训练模版** | `build-template-code` | 自动剖析 Golden Sample（规范度最高的范例模块），生成与当前项目架构完全吻合的定制化代码生成模版。 |
| **3. 代码考古** | `/trace` *(Maintain)*<br>`/legacy` *(Rebase)* | • `/trace`：扫描 `source-code` 代码库进行逻辑溯源与规范对齐。<br>• `/legacy`：以只读模式读取 `source-legacy`，将规格与模版提取迁移至 `source-code`。 |
| **4. 需求规范** | `/spec`, `/grill-bqa` | 编写各画面/特性的 Leaf Bundle 规范，发起对抗性质询澄清业务逻辑。 |
| **5. 设计与 API** | `/prototype`, `/api-spec` | 生成高保真交互式 HTML 原型，严格定义 API 契约文档 (`01-backend-spec.yaml`)。 |
| **6. 测试保障** | `/testcase`, `testcase:gen` | 构建 `TC-*.yaml` 测试矩阵并自动生成端到端 Playwright 自动化测试套件。 |
| **7. 联调集成** | `/wire` | 将前端与后端真实 API 连通，运行规范 ↔ 代码核验审计并完成交付闭环。 |

![用例文档直接转化为 E2E Playwright 自动化测试脚本](./assets/overview-testing-e2e.png)

---

## 📚 参考资源

- 📖 **[项目文档 (GitHub)](https://github.com/ShanYuCoder/Doc-CoSquad)** — 在 GitHub 仓库中查阅完整项目文档。
- ⚙️ **工作流目录 [workflows/](https://github.com/ShanYuCoder/Doc-CoSquad/tree/main/workflows/)** — 研发各阶段、操作指引与核心规范协议 (`SSOT_AGENT_PROTOCOL.md`、trace、legacy、help-plan、grill-bqa、testcase)。
