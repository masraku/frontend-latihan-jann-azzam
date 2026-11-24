# Graph Report - jann-azzam  (2026-11-24)

## Corpus Check
- Corpus is ~8,344 words - fits in a single context window. You may not need a graph.

## Summary
- 226 nodes · 491 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.81)
- Token cost: 54,630 input · 0 output

## Community Hubs (Navigation)
- Package & Lint Config
- Dashboards, Layout & Error Pages
- Admin User Management
- Seller Product Forms
- Public Catalog & Pagination
- Shared Tables & Data Types
- TypeScript Config
- Login, Auth Token & Proxy
- Next.js Docs & Agent Rules
- File Icon Asset
- Globe Icon Asset
- Window Icon Asset

## God Nodes (most connected - your core abstractions)
1. `next` - 27 edges
2. `ambilUserSaatIni` - 18 edges
3. `react` - 18 edges
4. `punyaIzin()` - 17 edges
5. `compilerOptions` - 16 edges
6. `AksesDitolak()` - 13 edges
7. `fetchDenganToken()` - 13 edges
8. `DashboardAdmin()` - 9 edges
9. `Katalog()` - 9 edges
10. `IsiForm()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Wordmark Logo` --conceptually_related_to--> `create-next-app`  [INFERRED]
  public/next.svg → README.md
- `Vercel Triangle Logo` --conceptually_related_to--> `Deploy on Vercel Platform`  [INFERRED]
  public/vercel.svg → README.md
- `DashboardAdmin()` --calls--> `AksesDitolak()`  [EXTRACTED]
  app/admin/page.tsx → components/admin/akses-ditolak.tsx
- `DashboardAdmin()` --calls--> `ProdukPerToko()`  [EXTRACTED]
  app/admin/page.tsx → components/admin/produk-per-toko.tsx
- `DashboardAdmin()` --calls--> `TabelUser()`  [EXTRACTED]
  app/admin/page.tsx → components/admin/tabel-user.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **create-next-app Default Public SVG Assets** — public_file_file_icon, public_globe_globe_icon, public_next_nextjs_logo, public_vercel_vercel_logo, public_window_window_icon, readme_create_next_app [INFERRED 0.85]
- **Next.js Agent Feedback Flow** — agents_nextjs_agent_feedback, agents_experimental_agentfeedback, agents_generate_agent_files, agents_agent_feedback_instructions_cli [INFERRED 0.85]

## Communities (12 total, 3 thin omitted)

### Community 0 - "Package & Lint Config"
Cohesion: 0.07
Nodes (34): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, devDependencies, eslint@^9, eslint-config-next@16.4.6 (+26 more)

### Community 1 - "Dashboards, Layout & Error Pages"
Cohesion: 0.11
Nodes (21): AdminPage(), DashboardAdmin(), DashboardSkeleton(), metadata, SearchParams, AkunPage(), DetailAkun(), metadata (+13 more)

### Community 2 - "Admin User Management"
Cohesion: 0.12
Nodes (27): IsiForm(), metadata, TambahUserPage(), EditUserPage(), IsiForm(), metadata, Params, FormUser() (+19 more)

### Community 3 - "Seller Product Forms"
Cohesion: 0.14
Nodes (19): IsiForm(), metadata, TambahProdukPage(), EditProdukPage(), IsiForm(), metadata, Params, AksesDitolak() (+11 more)

### Community 4 - "Public Catalog & Pagination"
Cohesion: 0.15
Nodes (15): ambilSatu(), Katalog(), SearchParams, KatalogPage(), metadata, SearchParams, FilterKatalog(), Props (+7 more)

### Community 5 - "Shared Tables & Data Types"
Cohesion: 0.21
Nodes (13): BadgeStatus(), ProdukPerToko(), TabelUser(), Props, TombolSubmit(), Props, StatusProduk(), TabelProdukSaya() (+5 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "Login, Auth Token & Proxy"
Cohesion: 0.21
Nodes (9): LoginPage(), metadata, FormLogin(), stateAwal, masuk(), StateLogin, NAMA_COOKIE_TOKEN, UMUR_TOKEN_DETIK (+1 more)

### Community 8 - "Next.js Docs & Agent Rules"
Cohesion: 0.15
Nodes (11): next internal agent-feedback-instructions CLI, experimental.agentFeedback config flag, generate-agent-files.js (next dev AGENTS.md writer), Next.js Bundled Docs (node_modules/next/dist/docs), Next.js Wordmark Logo, Vercel Triangle Logo, create-next-app, Development Server (npm run dev, localhost:3000) (+3 more)

## Knowledge Gaps
- **10 isolated node(s):** `Next.js Bundled Docs (node_modules/next/dist/docs)`, `experimental.agentFeedback config flag`, `next internal agent-feedback-instructions CLI`, `Development Server (npm run dev, localhost:3000)`, `next/font with Geist font` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 74 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Seller Product Forms` to `Package & Lint Config`, `Dashboards, Layout & Error Pages`, `Admin User Management`, `Public Catalog & Pagination`, `Shared Tables & Data Types`, `Login, Auth Token & Proxy`?**
  _High betweenness centrality (0.258) - this node is a cross-community bridge._
- **What connects `Next.js Bundled Docs (node_modules/next/dist/docs)`, `experimental.agentFeedback config flag`, `next internal agent-feedback-instructions CLI` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package & Lint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Dashboards, Layout & Error Pages` to `Package & Lint Config`, `Admin User Management`, `Seller Product Forms`, `Public Catalog & Pagination`, `Login, Auth Token & Proxy`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Should `Dashboards, Layout & Error Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Should `Admin User Management` be split into smaller, more focused modules?**
  _Cohesion score 0.12436974789915967 - nodes in this community are weakly interconnected._
- **Should `Seller Product Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.1402116402116402 - nodes in this community are weakly interconnected._