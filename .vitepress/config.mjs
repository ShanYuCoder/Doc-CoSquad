import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

const skillGroups = [
  {
    text: 'AI Skills (Setup & Discovery)',
    items: [
      { text: '/init', link: '/references/skills/init' },
      { text: '/help-plan', link: '/references/skills/help-plan' },
      { text: '/build-env', link: '/references/skills/build-env' },
      { text: '/ssot-docs & CLI', link: '/references/skills/ssot-docs' },
      { text: '/legacy (Scan & Inventory)', link: '/references/skills/legacy' },
    ],
  },
  {
    text: 'AI Skills (Phase 1 — Design & Grilling)',
    items: [
      { text: '/spec', link: '/references/skills/spec' },
      { text: '/grill (Unified Audit & Tech Debt)', link: '/references/skills/grill' },
      { text: '/qa (Tech Debt & Inbox)', link: '/references/skills/qa' },
      { text: '/trace (Maintain)', link: '/references/skills/trace' },
      { text: '/manual (User Manuals)', link: '/references/skills/manual' },
    ],
  },
  {
    text: 'AI Skills (Phase 2 — Templates & Code Generation)',
    items: [
      { text: '/build-templates', link: '/references/skills/build-templates' },
      { text: '/prototype (UI Proposal & Prototype)', link: '/references/skills/prototype' },
      { text: '/wire (Models & Real API Wiring)', link: '/references/skills/wire' },
    ],
  },
  {
    text: 'AI Skills (Phase 2b - Testing & Quality)',
    items: [
      { text: '/testcase (TC & SC Scenarios)', link: '/references/skills/testcase' },
      { text: '/test (E2E Codegen)', link: '/references/skills/test' },
      { text: '/unit (FE & BE Unit Tests)', link: '/references/skills/unit' },
    ],
  },
  {
    text: 'AI Skills (Phase 3 - API & Contracts)',
    items: [
      { text: '/api-spec (Contract & OpenAPI)', link: '/references/skills/api-spec' },
      { text: '/api (Backend Codegen & Audit)', link: '/references/skills/api' },
    ],
  },
  {
    text: 'AI Skills (Phase 4 — Architecture, Domain & Risks)',
    items: [
      { text: '/architecture', link: '/references/skills/architecture' },
      { text: '/module (Domain Hierarchy)', link: '/references/skills/module' },
      { text: '/user-flow', link: '/references/skills/user-flow' },
      { text: '/db-erd', link: '/references/skills/db-erd' },
      { text: '/risk-register (Risks & Impact)', link: '/references/skills/risk-register' },
      { text: '/common', link: '/references/skills/common' },
    ],
  },
];

/** Nested sidebar groups need `collapsed` set or VitePress renders them always open (no caret). */
const skillSidebarGroupsEn = skillGroups.map((group) => ({
  ...group,
  collapsed: true,
}));

const skillSidebarGroupsVi = skillGroups.map((group) => ({
  ...group,
  collapsed: true,
  items: group.items.map((item) => ({
    ...item,
    link: `/vi${item.link}`,
  })),
}));

const skillSidebarGroupsZh = skillGroups.map((group) => ({
  ...group,
  collapsed: true,
  items: group.items.map((item) => ({
    ...item,
    link: `/zh${item.link}`,
  })),
}));

const skillSidebarGroupsJa = skillGroups.map((group) => ({
  ...group,
  collapsed: true,
  items: group.items.map((item) => ({
    ...item,
    link: `/ja${item.link}`,
  })),
}));

export default withMermaid(
  defineConfig({
    title: 'CoSquad Docs',
    ignoreDeadLinks: true,
    srcExclude: ['README.md', 'README.*.md'],
    description:
      'Enterprise Disciplined AI Engineering Platform (Graph, DNA, Docs, Test, Codegen)',
    locales: {
      root: {
        label: 'English',
        lang: 'en-US',
        themeConfig: {
          nav: [
            { text: 'Home', link: '/' },
            { text: 'README & Overview', link: '/readme' },
            { text: 'Workflows', link: '/workflows/' },
            { text: 'References', link: '/references/cli-and-commands' },
          ],
          sidebar: [
            { text: 'Quick Start & Overview', link: '/readme' },
            {
              text: 'Workspace Structure',
              link: '/artifacts/',
            },
            {
              text: 'Workflows',
              link: '/workflows/',
              collapsed: true,
              items: [
                { text: 'Overview (Phases & Roles)', link: '/workflows/' },
                { text: 'Phase 0 — Setup', link: '/workflows/phase-0-setup' },
                { text: 'Design', link: '/workflows/design' },
                { text: 'Backend', link: '/workflows/backend' },
                { text: 'Test', link: '/workflows/test' },
                { text: 'Wire', link: '/workflows/wire' },
                { text: 'Gate & Audit', link: '/workflows/gates' },
                { text: 'Grill & Review', link: '/workflows/grill-and-human-review' },
                { text: 'QA Inbox', link: '/workflows/qa-team' },
              ],
            },
            {
              text: 'References',
              collapsed: true,
              items: [
                { text: 'CLI & Commands', link: '/references/cli-and-commands' },
                { text: 'Audit & Gap Check', link: '/references/audit-commands' },
                { text: 'Plugins', link: '/references/plugins' },
                {
                  text: 'Skills',
                  collapsed: true,
                  items: skillSidebarGroupsEn,
                },
              ],
            },
          ],
        },
      },
      vi: {
        label: 'Tiếng Việt',
        lang: 'vi-VN',
        link: '/vi/',
        themeConfig: {
          nav: [
            { text: 'Trang chủ', link: '/vi/' },
            { text: 'README & Tổng quan', link: '/vi/readme' },
            { text: 'Quy trình (Workflows)', link: '/vi/workflows/' },
            { text: 'Tra cứu (References)', link: '/vi/references/cli-and-commands' },
          ],
          sidebar: [
            { text: 'Bắt đầu nhanh & Tổng quan', link: '/vi/readme' },
            {
              text: 'Cấu trúc Workspace',
              link: '/vi/artifacts/',
            },
            {
              text: 'Quy trình (Workflows)',
              link: '/vi/workflows/',
              collapsed: true,
              items: [
                { text: 'Tổng thể (phase & vai trò)', link: '/vi/workflows/' },
                { text: 'Phase 0 — Setup', link: '/vi/workflows/phase-0-setup' },
                { text: 'Design', link: '/vi/workflows/design' },
                { text: 'Backend', link: '/vi/workflows/backend' },
                { text: 'Test', link: '/vi/workflows/test' },
                { text: 'Wire', link: '/vi/workflows/wire' },
                { text: 'Gate & audit', link: '/vi/workflows/gates' },
                { text: 'Grill & review', link: '/vi/workflows/grill-and-human-review' },
                { text: 'QA inbox (team)', link: '/vi/workflows/qa-team' },
              ],
            },
            {
              text: 'Tra cứu (References)',
              collapsed: true,
              items: [
                { text: 'CLI & Commands', link: '/vi/references/cli-and-commands' },
                { text: 'Audit & gap check', link: '/vi/references/audit-commands' },
                { text: 'Plugins', link: '/vi/references/plugins' },
                {
                  text: 'Kỹ năng (Skills)',
                  collapsed: true,
                  items: skillSidebarGroupsVi,
                },
              ],
            },
          ],
        },
      },
      zh: {
        label: '简体中文',
        lang: 'zh-CN',
        link: '/zh/',
        themeConfig: {
          nav: [
            { text: '首页', link: '/zh/' },
            { text: 'README 说明', link: '/zh/readme' },
            { text: '工作流 (Workflows)', link: '/zh/workflows/' },
            { text: '参考手册', link: '/zh/references/cli-and-commands' },
          ],
          sidebar: [
            { text: '快速开始与概览', link: '/zh/readme' },
            {
              text: '工作区结构',
              link: '/zh/artifacts/',
            },
            {
              text: '工作流 (Workflows)',
              link: '/zh/workflows/',
              collapsed: true,
              items: [
                { text: '全局概览 (阶段与角色)', link: '/zh/workflows/' },
                { text: 'Phase 0 — 初始化设置', link: '/zh/workflows/phase-0-setup' },
                { text: 'Design 设计阶段', link: '/zh/workflows/design' },
                { text: 'Backend 后端开发', link: '/zh/workflows/backend' },
                { text: 'Test 测试阶段', link: '/zh/workflows/test' },
                { text: 'Wire 联调集成', link: '/zh/workflows/wire' },
                { text: 'Gate & 审计检查', link: '/zh/workflows/gates' },
                { text: 'Grill 业务质询 & 评审', link: '/zh/workflows/grill-and-human-review' },
                { text: 'QA 团队收件箱', link: '/zh/workflows/qa-team' },
              ],
            },
            {
              text: '参考手册 (References)',
              collapsed: true,
              items: [
                { text: 'CLI 与命令', link: '/zh/references/cli-and-commands' },
                { text: '审计与缺口检查', link: '/zh/references/audit-commands' },
                { text: 'IDE 与 Agent 插件', link: '/zh/references/plugins' },
                {
                  text: 'Skills 技能库',
                  collapsed: true,
                  items: skillSidebarGroupsZh,
                },
              ],
            },
          ],
        },
      },
      ja: {
        label: '日本語',
        lang: 'ja-JP',
        link: '/ja/',
        themeConfig: {
          nav: [
            { text: 'ホーム', link: '/ja/' },
            { text: 'README 説明書', link: '/ja/readme' },
            { text: 'ワークフロー (Workflows)', link: '/ja/workflows/' },
            { text: 'リファレンス', link: '/ja/references/cli-and-commands' },
          ],
          sidebar: [
            { text: 'クイックスタートと概要', link: '/ja/readme' },
            {
              text: 'ワークスペース構造',
              link: '/ja/artifacts/',
            },
            {
              text: 'ワークフロー (Workflows)',
              link: '/ja/workflows/',
              collapsed: true,
              items: [
                { text: '全体像 (フェーズと役割)', link: '/ja/workflows/' },
                { text: 'Phase 0 — セットアップ', link: '/ja/workflows/phase-0-setup' },
                { text: 'Design 設計', link: '/ja/workflows/design' },
                { text: 'Backend バックエンド', link: '/ja/workflows/backend' },
                { text: 'Test テスト', link: '/ja/workflows/test' },
                { text: 'Wire 統合連携', link: '/ja/workflows/wire' },
                { text: 'Gate ＆ 監査チェック', link: '/ja/workflows/gates' },
                { text: 'Grill 業務レビュー ＆ 確定', link: '/ja/workflows/grill-and-human-review' },
                { text: 'QA チーム受信トレイ', link: '/ja/workflows/qa-team' },
              ],
            },
            {
              text: 'リファレンス (References)',
              collapsed: true,
              items: [
                { text: 'CLI コマンド一覧', link: '/ja/references/cli-and-commands' },
                { text: '監査 ＆ ギャップ検出', link: '/ja/references/audit-commands' },
                { text: 'IDE ＆ Agent プラグイン', link: '/ja/references/plugins' },
                {
                  text: 'Skills スキル一覧',
                  collapsed: true,
                  items: skillSidebarGroupsJa,
                },
              ],
            },
          ],
        },
      },
    },
    mermaid: {},
    vite: {
      optimizeDeps: {
        include: ['mermaid', 'fastdom'],
      },
    },
  }),
);
