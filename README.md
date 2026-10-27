<!-- cosquad-catalog -->
**[Danh mục tài liệu](CATALOG.md)**
<!-- /cosquad-catalog -->

<p align="center">
  <b>English</b> |
  <a href="./README.vi.md"><b>Tiếng Việt</b></a> |
  <a href="./README.zh-CN.md"><b>简体中文</b></a> |
  <a href="./README.ja.md"><b>日本語</b></a>
</p>

# CoSquad 🚀

> **AI-Powered & Deterministic SDLC Automation Toolkit**  
> Maintain SDLC discipline and Single Source of Truth (SSOT) integrity for high-velocity software engineering without the prohibitive overhead of manual documentation.

---

## 📦 Quick Start

Install CoSquad directly into your environment using the automated release script with a Git Personal Access Token (PAT):

```bash
export COSQUAD_GITHUB_TOKEN=github_pat_XXXXX
export COSQUAD_REF=latest

curl -fsSL \
  https://raw.githubusercontent.com/ShanYuCoder/Doc-CoSquad/main/scripts/install-from-release.sh \
  | bash -s -- "$COSQUAD_GITHUB_TOKEN"
```

---

## 🔄 Workflow Pipeline

AI serves humans — AI does not replace humans:

- **AI is responsible for ***Quantity***:**
  - The AI Agent ensures **sufficient quantity and completeness** of structured information.
  - Automatically audits whether data and specs are exhaustive; if gaps exist, it proactively proposes options *(e.g., verifying whether a page has title and breadcrumbs; whether form elements define types, validation rules, error states... and prompting users with choices to approve or complete)*.
- **Humans are responsible for ***Quality***:**
  - Humans take full responsibility for the **accuracy and rigor** of the domain requirements provided to AI.
  - Humans hold direct ownership over the **choices and approvals** when AI presents recommendations.
  - Whether product quality is correct, cohesive, and business-sound depends entirely on the information provided and final decisions made by human stakeholders.

```text
Raw Requirements (bullet points / screenshots / legacy code)
  │
  ▼
AI standardizes bundle + IR + renders Markdown
  │
  ▼
Duplicate elimination via Anti-Copy-Paste Guard (Common Catalog CMN-*)
  │
  ▼
Interactive Prototype + review by BA / QA / Dev
  │
  ▼
Codegen: E2E Playwright / BE / Wire + safety net
```

![Parallel artifact layers with source code](./assets/overview-artifact-layers.png)

---

## 🎯 Goal: Agile T-Shaped Team Model

```text
                                 COSQUAD CO-PILOT PLATFORM
                                 (Agile T-Shaped Team Model)
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
       FOR NON-TECH (BA / QA / PO)                                    FOR TECH (DEV / CODER)
   ─────────────────────────────────                              ──────────────────────────────
1. TRACE & SPECIFICATION:                                      1. CAPABLE CODEGEN ASSISTANT:
   Dive deep across 5 code layers, extract clean                  Scaffolding, boilerplate, mock APIs,
   business rules with exact line references.                     sync IR, format Swagger cleanly.

2. NEW FEATURES & CHANGES (CR):                                2. ADVERSARIAL BUSINESS REVIEW (BA ROLE):
   Not just specs — CoSquad autonomously                          - Grill edge cases, concurrency, anti-goals
   scaffolds and wires code from approved specs                   to lock logic before implementation.
   to deliver runnable software!                                  - Transform dry technical errors into
                                                                  refined, user-friendly language.
3. CONFIDENT DECISION-MAKING:
   Provides (Recommended) + Alternative                           3. RIGOROUS QUALITY GATE (QA ROLE):
   + Tech Debt options so stakeholders approve                    - Automatically inject Unhappy paths, boundary
   80% of tasks without waiting on developers.                    extremes, data leaks, and error storms...
                                                                  - Auto-generate E2E Playwright suites from specs.
```

- **For Non-Tech (BA / QA / PO):**
  - **Trace & Specification:** Autonomously inspect 5 code layers, extracting business rules with exact source line citations.
  - **Autonomous Feature Delivery:** When handling CRs or new features, CoSquad generates source code and full wiring (`/api`, `/prototype`, `/wire`) directly from approved specs into runnable deliverables.
  - **Confident Decision-Making:** Receive structured choices `(Recommended) + Alternative + Tech Debt` to autonomously sign off on 80% of tasks without blocking on engineering.

- **For Developers (Coder / Tech Lead):**
  - **Eliminating Tedium:** Automates boilerplate, scaffolding, mock APIs, IR sync, and Swagger formatting, freeing engineers to focus 100% on core business logic and architecture.
  - **Adversarial Business Co-Pilot (BA Role):** Proactively challenges assumptions, tests concurrency limits and anti-goals, while translating technical errors (*500 Internal Error*, *Unique constraint failed*) into refined product-facing semantics.
  - **Meticulous Quality Assurance (QA Role):** Proactively scans and injects Unhappy paths and error-storming scenarios, eliminating cognitive blind spots before release, while automatically generating production-ready E2E Playwright test suites.

![SSOT Hub — Multi-role Agile T-Shaped Collaboration Platform](./assets/overview-ssot-hub.png)

---

## ⚡ 6 Architectural & Operational Strengths

| # | Guiding Slogan | Core Significance |
| :-: | :--- | :--- |
| **1** | **Expanding T-Shaped Capabilities** | Flattens specialty silos: Devs master business domain, BAs build prototypes, QAs generate automation tests. |
| **2** | **Early Feedback Prototype** | Finalize UI and interactive flows early, eliminating 80% of rework risks with working prototypes. |
| **3** | **Closing the Loop with Automation Testing** | Auto-generate E2E Playwright test suites (`*.spec.ts`) from testcase matrices, lifting regression fatigue. |
| **4** | **Anti-Copy-Paste Guard** | Sweep out code duplication, enforcing shared reuse via Common Catalog (`CMN-UI-*`, `CMN-API-*`, `CMN-DTO-*`). |
| **5** | **Machine Handles "Quantity", Humans Decide "Quality"** | `coSquad audit` checks structure and schemas — Humans (BA/Dev/QA) challenge (*grill*) and make final SSOT decisions. |
| **6** | **Standard Framework - Risk-Proportional Rigor** | Streamline steps for low-risk projects; enforce rigorous spec-to-E2E compliance for mission-critical hotspots. |

![Phase Recalibration with Early Interactive Prototype and Spec](./assets/overview-phase-recalibration.png)

---

## 🔄 End-to-End Workflow with AI Agents

After setup, open your workspace in an AI Agent (Cursor, Antigravity, Claude Code, etc.) to execute according to the workflow:

```text
                        coSquad setup
                     (Workspace Scaffold)
                              │
                            /init
                    (Map surfaces & repo)
                              │
                         Project Type?
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
     (Maintain)           (Rebase)           (Greenfield)
         │                    │                    │
      /trace               /legacy               /spec
  (Code Archaeo)     (Legacy Extraction)    (Feature Spec)
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    /prototype & /api-spec
                              │
                    /testcase & codegen
                              │
                            /wire
                  (Integration & Packaging)
```

### Execution Steps Breakdown

| Step | Command / Skill | Core Description |
| :--- | :--- | :--- |
| **1. Setup** | `coSquad setup [name]` | Initialize skeleton, configure MCP server, and set up AI agent harness. |
| **2. Discover** | `/init` | Agent scans workspace, maps surfaces, extracts Common Catalog (`CMN-*`), and activates Anti-Copy-Paste Guard. |
| **2.1. Action Planning** | `/help-plan` | Analyzes `inition-inventory.md`, configs, and state to produce a step-by-step Action Plan, reviewing linked User Flows. |
| **2.2. Template Training** | `build-template-code` | Analyzes Golden Samples (cleanest architectural modules) to produce project-aligned custom codegen templates. |
| **3. Archaeology** | `/trace` *(Maintain)*<br>`/legacy` *(Rebase)* | • `/trace`: Scans source code in `source-code` to correlate and generate specs.<br>• `/legacy`: Reads read-only from `source-legacy`, extracting specs/templates into `source-code`. |
| **4. Specification** | `/spec`, `/grill` | Drafts Leaf Bundle specs for screens/features, challenging business logic. |
| **5. Design & API** | `/prototype`, `/api-spec` | Generates interactive HTML prototypes and defines API contracts (`01-backend-spec.yaml`). |
| **6. Testing** | `/testcase`, `testcase:gen` | Builds `TC-*.yaml` matrix and generates automated E2E Playwright test suites. |
| **7. Integration** | `/wire` | Connects frontend to real APIs, runs spec ↔ code audit checks, and completes the feature. |

![Closing the Automated Testing Loop from Testcase Specs to E2E Playwright](./assets/overview-testing-e2e.png)

---

## 📚 References

- 📖 **[Project Docs (GitHub)](https://github.com/ShanYuCoder/Doc-CoSquad)** — Read and explore documentation directly on GitHub.
- ⚙️ **Directory [workflows/](https://github.com/ShanYuCoder/Doc-CoSquad/tree/main/workflows/)** — Detailed SDLC development phases, operational workflows, and standard protocols (`SSOT_AGENT_PROTOCOL.md`, trace, legacy, help-plan, grill-bqa, testcase).
