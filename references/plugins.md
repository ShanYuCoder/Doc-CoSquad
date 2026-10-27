# 🔌 Multi-Agent Plugin & IDE Integration Guide

CoSquad supports both **Workspace Harness Materialization** (via `coSquad init` / `harness sync`) and **Native Multi-Agent Plugins** across the modern AI coding ecosystem.

By adhering to standard plugin specifications, CoSquad can be installed directly into your favorite AI agent or IDE without manually copying skill folders into every repository.

---

## 1. Supported AI Agents & IDEs

| Agent / IDE | Plugin Manifest / Config | Installation Command |
| :--- | :--- | :--- |
| **Google Antigravity IDE** | `.antigravity-plugin/plugin.json` | `agy plugin install https://github.com/ShanYuCoder/CoSquad` |
| **Claude Code** | `.claude-plugin/plugin.json`<br>`.claude-plugin/marketplace.json` | `/plugin marketplace add ShanYuCoder/CoSquad`<br>`/plugin install coSquad@coSquad-marketplace` |
| **Cursor** | `.cursor-plugin/plugin.json`<br>`hooks/hooks-cursor.json` | `/add-plugin coSquad` or auto-detected in workspace |
| **Gemini CLI** | `gemini-extension.json`<br>`AGENTS.md` | `gemini extensions install https://github.com/ShanYuCoder/CoSquad` |
| **OpenAI Codex** | `.codex-plugin/plugin.json` | `/plugins install coSquad` |
| **Devin CLI** | `.devin-plugin/plugin.json` | `devin plugins install ShanYuCoder/CoSquad` |
| **Standard Agents** | `.agents/plugins/marketplace.json` | Auto-discovered in `.agents/plugins/` |

---

## 2. Installation Instructions by Platform

### Google Antigravity IDE
Install CoSquad as an official plugin directly from the repository:
```bash
agy plugin install https://github.com/ShanYuCoder/CoSquad
```
Antigravity automatically discovers all skills (`/help-plan`, `/spec`, `/module`, `/grill`, `/trace`, etc.) and exposes suggested prompts.

### Claude Code
Add the CoSquad marketplace and install the plugin:
```bash
/plugin marketplace add ShanYuCoder/CoSquad
/plugin install coSquad@coSquad-marketplace
```
Claude Code automatically activates the `SessionStart` lifecycle hook upon launch, priming the agent with CoSquad's core directives.

### Cursor
In Cursor Agent chat:
```text
/add-plugin coSquad
```
Or open a project containing `.cursor-plugin/plugin.json`. Cursor will automatically register the skills path and execute `hooks/hooks-cursor.json` on session startup.

### Gemini CLI
Install CoSquad as a Gemini extension:
```bash
gemini extensions install https://github.com/ShanYuCoder/CoSquad
```

### Devin CLI
Install CoSquad into Devin:
```bash
devin plugins install ShanYuCoder/CoSquad
```

---

## 3. Lifecycle Hooks (`hooks/`)

CoSquad includes cross-platform lifecycle hooks in `hooks/`:
- **`hooks/hooks.json`**: Claude Code `SessionStart` configuration.
- **`hooks/hooks-cursor.json`**: Cursor `sessionStart` configuration.
- **`hooks/run-hook.cmd`**: Polyglot wrapper running bash on Unix and finding Git Bash on Windows.
- **`hooks/session-start`**: Injects CoSquad context at the start of each chat session.

### What the Session-Start Hook Does:
Upon opening a new session, the hook primes the AI agent with CoSquad's fundamental engineering rules:
1. **The Hard-Gate:** Strictly forbidden to generate code or mutate files before spec approval.
2. **Implementation Planning (`/help-plan`):** Mandates tracing all 5 links of related user flows, baselining active code reality via `/trace`, and evaluating the Top 5 production failure modes.
3. **The Iron Law of Verification:** Forbids subjective claims of task completion without terminal command execution and Exit Code 0 evidence.

---

## 4. Native Plugin vs Workspace Harness (`coSquad init`)

CoSquad offers two flexible operational modes:

| Mode | How it works | Best for |
| :--- | :--- | :--- |
| **Native Plugin** | Installed once globally or via Agent Marketplace. Skills trigger across any repository. | Individual developers using Claude Code, Cursor, Antigravity, or Codex across multiple projects. |
| **Workspace Harness (`coSquad init`)** | Materializes `.coSquad/config.json`, local MCP servers, and `.cursor/` / `.antigravity/` / `.agents/` inside the repo. | Enterprise teams, CI/CD pipelines, Monorepos, and centralized Documentation Hubs (`COSQUAD_DOCS_ROOT`). |
