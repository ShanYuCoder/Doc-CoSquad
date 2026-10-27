# Workspace Structure & SSOT Artifacts

When executing `coSquad setup [workspace]` and launching `pnpm docs:build` (or `coSquad build`), CoSquad generates a standardized **SSOT (Single Source of Truth)** architecture skeleton.

The VitePress web interface directly reads these directories and Markdown files on the local machine so the entire cross-functional team (BA, Dev, QA, Lead) collaborates and aligns on a unified source of truth.

> [!NOTE]
> **Scope Distinction:**
> The directory structure below (`overview/`, `architecture/`, `surfaces/`, etc.) represents the **SSOT architecture for your target software product** scaffolded by `coSquad setup`. This is independent of CoSquad's own documentation site (which is streamlined into a single unified README).

---

## On-Disk Directory Overview

```text
my-workspace/
├── overview/               # Product vision, business objectives, and release milestones
├── architecture/           # System architecture documentation (Arc42 standard & ERD models)
├── surfaces/               # Application surfaces, screen modules & common
│   ├── common/             # UI Patterns, model-data, rules across system (1-tier flat .md)
│   └── <surface-name>/     # Specific business surface (admin, portal, mobile, etc.)
│       ├── common/         # (Optional) Surface-scoped common (auto-hidden if empty)
│       └── <module-name>/  # Feature module ({surfaceCode}-{id}, e.g. ADM-01)
│           ├── common/     # (Optional, auto-hidden if empty)
│           ├── user-flows/ # User flows with Step 1 starting in this module (auto-hidden if empty)
│           └── <feature>/  # Feature (S-*, J-*, H-* 1-tier flat, holds bundle.yaml & spec.md)
├── .coSquad/registries/   # Design Tokens, UI Components, and Backend Capabilities registries
├── qa/                     # Collaboration inbox for clarifying business open questions & risks
├── source-code/            # Active production codebases (Git Submodules)
└── source-legacy/          # Legacy codebases for archaeological reference (STRICTLY READ-ONLY)
```

---

## Directory Roles in the Documentation Hub

### 1. `overview/` — Product Vision & Release Scope
- **Contents:** Contains `overview/index.md` outlining the overall product specification.
- **Responsibilities:**
  - Defines business goals and the core problems the product solves.
  - Classifies user groups (*Actors & Personas*).
  - Establishes feature scope boundaries per release milestone (Release Scope / Milestones).
- **Primary Stakeholders:** Product Owner (PO), Business Analyst (BA), Project Manager.

### 2. `architecture/` — System Architecture (Arc42 Standard)
- **Contents:** An international standard Arc42 technical architecture framework featuring **12 specialized sections** alongside core data models:
  - **`01-introduction/` (Introduction, Goals & Hotspots):** System context overview, core business goals, technical boundaries, and high-risk hotspot analysis (*Technical Hotspots* / high-load bottlenecks, highly complex business modules).
  - **`02-constraints/` (Architecture Constraints):** Invariant technical constraints: mandatory technology stacks, hardware limits, network topology, budget limits, legal compliance standards (GDPR, ISO, PCI-DSS), and organizational governance conventions.
  - **`03-user-flows/` (System Context & Macro Business Workflows):**
    > **Clear Distinction from `surfaces/<surface>/<module>/user-flows/`:**
    > - **`architecture/03-user-flows/`** represents **Macro System Flows / System Context**. Describes data operational lifecycles between services, bounded contexts, subsystems, or third-party integrations (e.g., banking reconciliation cycles, order sync to ERP, async event-driven processing via Message Queues). Focuses on protocols, data logic, and inter-system interactions — **completely independent of any user interface or screens**.
    > - Conversely, **`surfaces/<surface>/<module>/user-flows/`** represents **Interactive UI User Journeys**. Tightly coupled with screens and frontend interactions (button clicks, form validations, navigation transitions, modals, notifications) traversing across application surfaces (`portal`, `admin`, `mobile`).
  - **`04-solution-strategy/` (Solution Strategy):** Strategic decisions shaping the macro architecture: architectural pattern selection (Clean Architecture, DDD, Event-Driven, Microservices vs Monolith), data partitioning strategy (SQL vs NoSQL), multi-layer caching, and data flow diagrams (*Data Flow Mermaid*).
  - **`05-building-blocks/` (Building Block View / C4 Containers & Components):** Static structural decomposition of the system (C4 Model): services, modules, internal libraries, individual block responsibilities, and static dependency relationships.
  - **`06-runtime/` (Runtime View):** Dynamic runtime behaviors and component interactions during critical scenarios: sequence diagrams (*Sequence Diagram*), system bootstrap workflows, sync/async communication models, and concurrency lock handling.
  - **`07-deployment/` (Deployment View):** Physical/virtual server topology, environments (Dev, Staging, Production), containerization (Docker, Kubernetes), network configuration (VPC, Load Balancer, CDN, API Gateway), and CI/CD pipelines.
  - **`08-cross-cutting/` (Cross-Cutting Concepts):** Unified technical standards applied system-wide:
    - `security.md`: Authentication, authorization (RBAC/ABAC), data encryption (at-rest & in-transit), OWASP defense standards.
    - `integration.md`: Internal service communication rules and third-party integrations (REST, gRPC, Webhooks, Retry policies, Circuit Breakers).
    - `observability.md`: Centralized structured logging, performance metrics, and distributed tracing (OpenTelemetry).
    - `conventions.md`: Coding conventions, naming standards, Git commit guidelines, and PR review workflows.
    - `configuration.md`: Environment variables management, secrets vault security (Vault, Secrets Manager), and dynamic configuration rules.
  - **`09-decisions/` (Architecture Decision Records — ADR):** Stores formal architecture decision records (`ADR-{NNN}-{slug}.md`). Documents context, evaluated options, chosen rationales, and consequences — ensuring the entire team understands the "why" behind technical choices.
  - **`10-quality/` (Quality Goals & NFRs):** Quantified Non-Functional Requirements (NFRs): response latency (p95, p99), throughput capacity (RPS), high availability (99.99%), scalability limits, and disaster recovery objectives (RTO/RPO).
  - **`11-risks/` (Risks & Technical Debt — Risk Register):** Tracks architectural risks (*Risk Register*), potential bottlenecks, and technical debt registries (*Technical Debt*) along with mitigation plans and remediation roadmaps.
  - **`12-glossary/` (Ubiquitous Language Glossary):** Standardizes team-wide terminology: defines precise technical terms and domain business nouns, ensuring PO, BA, Dev, QA, and AI Agents share identical semantics and eliminate cognitive misunderstandings.
  - **`model/` (Data Models & C4 DSL):**
    - `data-models.md`: Entity-relationship diagrams (`erDiagram` Mermaid) mapping tables, fields, primary/foreign keys, and constraints.
    - `workspace.dsl`: System architecture model adhering to C4 standard written in Structurizr DSL.
- **Responsibilities:** Comprehensive technical roadmap guiding system standards, guaranteeing developers and AI Agents build homogenous code without conflicting conventions.
- **Primary Stakeholders:** Solution Architect, Technical Lead.

### 3. `surfaces/` — Application Surfaces, Features & Flat Structure
- **Contents:** Manages all user interface specifications and interactive workflows, partitioned into specific surfaces (`admin`, `portal`, `mobile`, etc.), feature modules (`{surfaceCode}-{id}`), and flat 1-tier screens/features (`<feature-slug>/`).
- **Streamlined `common/` Structure (Flat 1-Tier .md):**
  - At `surfaces/common/`: Holds shared rules for the **entire system** as flat `.md` files (no subdirectories `patterns/`, `yaml/`, `code/`, `data-model/`). Includes: UI Patterns, `model-data.md`, `model-derived-data.md`, `api-health.md`, `ui-empty-state.md`.
  - At `surfaces/<surface>/common/` or `<module>/common/`: (Optional) Holds shared rules for that surface or module. **Automatically hidden from VitePress sidebar if empty**.
- **`user-flows/` Structure and Ownership Rule (Step 1 Ownership):**
  - **No `user-flows/` at root `surfaces/` or `<surface>/`**:
    - **System / Cross-Surface Flows**: Centrally stored under [`architecture/03-user-flows/FLOW-*.md`](../../architecture/03-user-flows/) as technical `sequenceDiagram`s.
    - **Module User Flows**: Stored under `surfaces/<surface>/<module>/user-flows/FLOW-*.md`.
    - **Step 1 Ownership Rule**: The module where Step 1 (the initial trigger screen) takes place owns the entire flow and its scenarios.
    - Module `user-flows/` directories **automatically hide from the VitePress sidebar if empty**.
- **Module Screen Hierarchy (1-Tier Flat):**
  - All screens/features within a module reside directly at tier 1: `surfaces/<surface>/<module>/<feature-slug>/` (no multi-tier numbering like `01/01/02`).
  - Child/secondary screens (Create, Edit, Detail, Drawer) declare access flow in §1 Overview ("Vào từ màn hình danh sách ➔ Bấm nút [Tạo mới]").
- **Primary Stakeholders:** BA, Frontend Dev, Backend Dev, QA.

### 4. `.coSquad/registries/` — Shared Component & Capability Registries (Workspace SSOT)
- **Contents:** Machine-readable JSON dictionary files (`design.registry.json`, `be-capabilities.registry.json`). Centrally maintained in the Workspace SSOT, not inside application code repositories.
- **Responsibilities:**
  - Catalogs existing reusable UI components (`components/ui`, layouts, buttons, tables).
  - Catalogs available backend services and capabilities.
  - Enables AI Agents to recognize existing codebase capabilities, prioritizing reuse and avoiding duplicate code generation.

### 5. `qa/` — Collaboration & Clarification Inbox
- **Contents:** Houses `qa/index.md` aggregating business open questions (*Open Questions*).
- **Responsibilities:**
  - Where QAs or Devs record requirement ambiguities identified while reviewing specs.
  - BAs or POs clarify and sign off directly here using skill `/qa`.
  - Ensures every question has a documented resolution before feature development is closed.

---

## Workspace Code Repositories

| Directory | Mode | Purpose & Rules |
| :--- | :--- | :--- |
| **`source-code/`** | **Read / Write** | Contains active production repositories (Frontend, Backend, Microservices). All generated code and modifications are committed here. |
| **`source-legacy/`** | **Strictly READ-ONLY** | Houses legacy source code for archaeological analysis during Rebase workflows. **Modifications or raw copy-pasting from this directory are strictly forbidden.** |

---

## Standard ID Naming Conventions & Artifact Taxonomy

To ensure brevity, usability, and rapid cross-referencing across cross-functional teams (BA, Dev, QA, PO) without cumbersome names, CoSquad adopts a streamlined, unified ID naming convention for all documentation artifacts:

### 1. Surface Identification
- **Rule:** No complex numeric ID required. Use **Surface Folder Name** + **Uppercase Abbreviation (`surfaceCode`)** (1 to 4 characters).
- **Examples:**
  - `admin` $\rightarrow$ `ADM` (or `AD`)
  - `tenant` $\rightarrow$ `TA`
  - `line` $\rightarrow$ `L`
  - `customer` $\rightarrow$ `CUS`
  - `merchant` $\rightarrow$ `MER`

### 2. Business Module Identification
- **Pattern:** `{surfaceCode}-{id}`
- **Rule:** Each module within a given surface receives a 2-digit sequential ID starting from `01`.
- **Examples:**
  - `ADM-01` (Authentication & Admin Identity Management)
  - `ADM-02` (Order Processing & Settlement)
  - `TA-01`, `TA-02` (Tenant Portal Modules)

### 3. Module Feature Identification
Within each module, features are differentiated by a **1-letter prefix**, sharing a **unified, non-overlapping sequential number starting from 01**:
- **`S-*` (Screen - User Interface View):** `S-{surfaceCode}-{idModule}-{idFeature}`
  - Examples: `S-ADM-01-01` (Order List Screen), `S-ADM-01-02` (Order Create & Edit Screen).
- **`J-*` (Job - Background Worker / Scheduled Cron):** `J-{surfaceCode}-{idModule}-{idFeature}`
  - Example: `J-ADM-01-03` (Order status synchronization background job).
- **`H-*` (Hook - Webhook Integration / External API Hook):** `H-{surfaceCode}-{idModule}-{idFeature}`
  - Example: `H-ADM-01-04` (Third-party payment callback webhook).
- **Unified Sequence Principle (Strict Non-overlapping IDs):**
  - The feature sequence `{idFeature}` increments consecutively from `01` across all feature types (Screens, Jobs, Hooks) within that module.
  - *Example:* If module `ADM-01` already has screens `S-ADM-01-01` and `S-ADM-01-02`, the next job MUST be numbered `J-ADM-01-03` (never reusing 01 or 02), and the next hook is `H-ADM-01-04`.
- **Internal APIs:**
  - Declared by HTTP Method + Route inside `01-backend-spec.yaml` (e.g. `GET /admin/orders`). May use prefix `API` or omit IDs if strictly internal to the consuming screen feature.

### 4. In-Screen Messages, Alerts & Confirmation Popups
- **Rule:** Standard item labels (form input labels, placeholders, column headers) **do not require IDs**.
- **Mandatory IDs:** All **Alert banners** (success, warning), **Validation / Process Error Messages**, and **Confirmation Modal Popups / Dialogs** MUST have explicit IDs:
  - **Pattern:** `Msg-{surfaceCode}-{idModule}-{idScreen}-{idMsg}` (each segment is 2 digits).
  - **Examples:**
    - `Msg-ADM-01-01-01`: "Start date must be before end date" (Filter validation error on screen S-ADM-01-01).
    - `Msg-ADM-01-01-02`: "Are you sure you want to cancel this order?" (Order cancellation confirm popup).
    - `Msg-ADM-01-01-03`: "Order cancelled successfully" (Success toast notification).
- **No In-Feature Dictionary Table:** Feature specs (`S-*`, `J-*`, `H-*`) do **NOT** define the message translation catalog. Inside feature details (`actions[]`, `interactionCases[]`, `outcomes[]`), authors only specify:
  - **Trigger condition:** When it fires (e.g. "on click Save, if validation fails on case A").
  - **Display mode:** How it displays (toast notification, inline alert, or blocking confirm modal dialog).
  - **Message ID:** Referenced ID (e.g. `id: Msg-ADM-01-01-01`).
- **Interactive Link to Message Screen:** When rendered in documentation, the message ID `Msg-*` functions as a clickable link that opens the dedicated Message List / Screen (`messages`), where message IDs, multilingual translations (`en`, `vi`, `ja`), and hashtag/placeholder parameter definitions (`{month}`, `{count}`) are centrally maintained (similar to Q&A items).

### 5. File Export & Download Functions
- **Pattern:** `F-{surfaceCode}-{idModule}-{idFile}` (2 digits per segment).
- **Purpose:** Identifies report export capabilities (Excel, CSV, PDF) or bulk-import data download templates.
- **Examples:**
  - `F-ADM-01-01`: Periodic revenue summary Excel report.
  - `F-ADM-01-02`: Order reconciliation CSV import template.

### 6. User Flows (`flow-*`)
- **Pattern:** `flow-{surfaceCode}-{idModule}-{id}` (lowercase or case-insensitive, 2 digits per segment).
- **Rule:** Step 1 Ownership determines module folder. Files are located under `surfaces/<surface>/<module>/user-flows/flow-{surface}-{module}-{id}.md`.
- **Examples:**
  - `flow-adm-01-01`: User flow for admin login and password reset.
  - `flow-ta-02-01`: Tenant checkout and invoice issuance flow.

### 7. Common Resources Across 3 Architectural Tiers (`G-*` and `C-*`)
To distinguish shared resources from modular business features:

#### 7.1. Tier 1 — Global Common (`surfaces/common/`): Prefix `G-` (Global)
Applicable across all surfaces:
- **Shared APIs:** `G-API-{id}` (e.g. `G-API-01`, `G-API-02`) — System health check, global token verification.
- **Shared UI (Modals, Tables quy thành Screen):** `G-S-{id}` (e.g. `G-S-01`, `G-S-02`) — Generic confirm dialog, delete modal, system error layout.
- **Shared Messages:** `G-Msg-{id}` (e.g. `G-Msg-01`, `G-Msg-02`) — System maintenance alert, session expired notification.
- **Shared Helpers / Status / Error Codes:** `G-{id}` (e.g. `G-01`, `G-02`) — Standard HTTP error catalog, currency formatter, timezone converter.
- *(Note: Hooks, Jobs, and modular Features do not exist at this global tier).*

#### 7.2. Tier 2 — Surface Common (`surfaces/<surface>/common/`): Prefix `C-` (Common)
Shared within a specific surface:
- **Surface Common APIs:** `C-API-{surfaceCode}-{id}` (e.g. `C-API-ADM-01`, `C-API-ADM-02`) — Surface menu navigation API, profile info.
- **Surface Common UI (Modals, Panels quy thành Screen):** `C-S-{surfaceCode}-{id}` (e.g. `C-S-ADM-01`, `C-S-ADM-02`) — Admin filter drawer, admin audit log drawer.
- **Surface Common Messages:** `C-Msg-{surfaceCode}-{id}` (e.g. `C-Msg-ADM-01`, `C-Msg-ADM-02`) — Surface-level permission denied alert.
- **Surface Common Helpers / Status:** `C-{surfaceCode}-{id}` (e.g. `C-ADM-01`, `C-ADM-02`) — Admin role definition helper, admin status badge formatter.

#### 7.3. Tier 3 — Module Common (`surfaces/<surface>/<module>/common/`): Prefix `C-` (Module Common)
Shared within a specific module:
- **Module Common APIs:** `C-API-{surfaceCode}-{idModule}-{id}` (e.g. `C-API-ADM-01-01`, `C-API-ADM-01-02`) — Order pricing calculation preview API.
- **Module Common UI (Modals, Tables quy thành Screen):** `C-S-{surfaceCode}-{idModule}-{id}` (e.g. `C-S-ADM-01-01`, `C-S-ADM-01-02`) — Order status history modal, order item selector dialog.
- **Module Common Messages:** `C-Msg-{surfaceCode}-{idModule}-{id}` (e.g. `C-Msg-ADM-01-01`, `C-Msg-ADM-01-02`) — Order cancellation reason required validation error.
- **Module Common Helpers / Status / Enums:** `C-{surfaceCode}-{idModule}-{id}` (e.g. `C-ADM-01-01`, `C-ADM-01-02`) — Order state machine transition validator.

### 8. QA & Test Artifacts
- **`TC-*` (Test Case):** `TC-{surfaceCode}-{idModule}-{idTC}`
  - Examples: `TC-ADM-01-01` (Order list pagination test case), `TC-ADM-01-02` (Order form validation test case).
- **`SC-*` (Scenario - Integrated E2E Journey):** `SC-{surfaceCode}-{idModule}-{idSC}`
  - Example: `SC-ADM-01-01` (Order checkout through fulfillment dispatch flow).
- **`Q-*` (Question / QA Inbox Ticket / Pending Tech Debt):**
  - **Rule:** Uses clean 1-letter prefix `Q-` (replacing legacy `QA-*`).
  - **Feature-level:** `Q-{surfaceCode}-{idModule}-{idFeature}-{id}` (e.g. `Q-ADM-01-01-01` — Question 01 on screen `S-ADM-01-01`).
  - **Module-level:** `Q-{surfaceCode}-{idModule}-{id}` (e.g. `Q-ADM-01-01` — Module-wide business question).
  - **Global-level:** `Q-G-{id}` (e.g. `Q-G-01` — Cross-cutting architecture/infrastructure question).
  - **Storage:** File `qa/<id>.yaml` (e.g. `qa/Q-ADM-01-01-01.yaml` or sequence `qa/ADM-01-01_0001.yaml`).

---

### ID Taxonomy Cheatsheet

| Prefix / Pattern | Scope & Artifact Type | Example | Meaning |
| :--- | :--- | :--- | :--- |
| `{SURF}` | Surface (Channel / Portal) | `ADM`, `TA`, `L`, `CUS` | Surface abbreviation (Admin, Tenant, Line, Customer) |
| `{SURF}-{NN}` | Business Module | `ADM-01`, `TA-02` | Module 01 under Surface Admin |
| `S-{SURF}-{NN}-{MM}` | Screen Feature | `S-ADM-01-01` | Screen 01 under module ADM-01 |
| `J-{SURF}-{NN}-{MM}` | Background Job / Worker | `J-ADM-01-03` | Background job 03 under module ADM-01 |
| `H-{SURF}-{NN}-{MM}` | API Hook / Integration | `H-ADM-01-04` | Webhook / Integration 04 under module ADM-01 |
| `flow-{SURF}-{NN}-{MM}` | User Flow Journey | `flow-adm-01-01` | User flow 01 starting in module ADM-01 |
| `Msg-{SURF}-{NN}-{MM}-{KK}` | Screen Message / Alert / Popup | `Msg-ADM-01-01-01` | Message 01 on screen S-ADM-01-01 |
| `F-{SURF}-{NN}-{MM}` | File Export / Download Template | `F-ADM-01-01` | Export file 01 under module ADM-01 |
| `G-API-{NN}` | Global Common API | `G-API-01` | Shared API 01 across all surfaces |
| `G-S-{NN}` | Global Common UI (Modal/Table) | `G-S-01` | Shared UI Screen 01 across all surfaces |
| `G-Msg-{NN}` | Global Common Message | `G-Msg-01` | Shared Message 01 across all surfaces |
| `G-{NN}` | Global Common Helper/Status | `G-01` | Shared Helper/Status 01 across all surfaces |
| `C-API-{SURF}-{NN}` | Surface Common API | `C-API-ADM-01` | Shared API 01 within Surface ADM |
| `C-S-{SURF}-{NN}` | Surface Common UI (Modal) | `C-S-ADM-01` | Shared UI Screen 01 within Surface ADM |
| `C-Msg-{SURF}-{NN}` | Surface Common Message | `C-Msg-ADM-01` | Shared Message 01 within Surface ADM |
| `C-{SURF}-{NN}` | Surface Common Helper/Status | `C-ADM-01` | Shared Helper/Status 01 within Surface ADM |
| `C-API-{SURF}-{NN}-{KK}` | Module Common API | `C-API-ADM-01-01` | Shared API 01 within Module ADM-01 |
| `C-S-{SURF}-{NN}-{KK}` | Module Common UI (Modal) | `C-S-ADM-01-01` | Shared UI Screen 01 within Module ADM-01 |
| `C-Msg-{SURF}-{NN}-{KK}` | Module Common Message | `C-Msg-ADM-01-01` | Shared Message 01 within Module ADM-01 |
| `C-{SURF}-{NN}-{KK}` | Module Common Helper/Status | `C-ADM-01-01` | Shared Helper/Status 01 within Module ADM-01 |
| `TC-{SURF}-{NN}-{MM}` | Test Case | `TC-ADM-01-01` | Test case 01 under module ADM-01 |
| `SC-{SURF}-{NN}-{MM}` | Test Scenario | `SC-ADM-01-01` | E2E scenario 01 under module ADM-01 |
| `Q-{SURF}-{NN}-{MM}-{KK}` | Question / QA Inbox Ticket | `Q-ADM-01-01-01` | Question 01 on screen S-ADM-01-01 |
