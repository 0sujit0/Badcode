# badcode — AI Model Hand-off Document

> This file is the source of truth for any AI model (Gemini, Claude, GPT, etc.) picking up this project. Read it fully before making changes.

---

## What This App Is

**badcode** is an interactive, in-browser SQL learning platform. Users solve real business data scenarios by writing SQL queries against a live SQLite database running entirely in the browser via WebAssembly. No backend is required for the core learning loop.

- **8 levels** of increasing difficulty, **5 problems per level** (45 total)
- Real Monaco code editor with SQL syntax highlighting
- Instant query execution + result validation
- Progressive hint system (3 hints unlocked after 0 / 1 / 2 failed attempts)
- Local progress tracking (localStorage)
- Light / dark theme toggle

**Brand**: badcode | **Accent**: `#C8F542` (yellow-green) | **Dev server**: `npm run dev` → `localhost:3000`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 8 |
| Language | Vanilla JavaScript — no React, no Vue |
| SQL engine | sql.js 1.14.1 (SQLite → WebAssembly) |
| Code editor | Monaco Editor 0.55.1 |
| Auth (optional) | Supabase — gracefully degrades if env vars missing |
| Fonts | DM Sans, JetBrains Mono, Instrument Serif (Google Fonts) |
| Styling | CSS custom properties + inline styles |

---

## Directory Structure

```
src/
  ai/
    aiToggle.js       — Navbar toggle UI; reads VITE_AI_API_KEY
    aiCoach.js        — MOCK ONLY: returns canned response; not wired to real API
  auth/
    authUI.js         — Login/signup modal UI
    supabase.js       — Supabase client; falls back to guest mode gracefully
  components/
    Navbar.js         — Top nav + bindNavbar() for interactivity
    Editor.js         — Monaco wrapper; Cmd/Ctrl+Enter triggers run
    ResultsTable.js   — Renders query results as HTML table
    DatasetExplorer.js — Accordion showing tables + columns (all expanded by default)
    HintPanel.js      — Progressive hints; Show Answer after 3 failures
    CheatSheet.js     — Side panel SQL reference
  data/
    problems.json     — 45 problems (L1_P1 … L8_P5)
    schema.js         — 4 tables: Customers, Products, Orders, Employees
  engine/
    sqlEngine.js      — initDatabase, executeQuery, validateResult, checkConcept
  pages/
    LandingPage.js    — Hero + CTA (#/)
    DashboardPage.js  — 8 level cards (#/dashboard)
    LevelPage.js      — Problem list for a level (#/level/:id)
    LessonPage.js     — 3-column lesson UI (#/lesson/:id)
    LevelCompletePage.js — Exists but NOT wired to router yet
  store/
    progress.js       — localStorage wrapper (key: queryquest_progress)
  styles/
    index.css         — All CSS variables, reset, layout classes, responsive breakpoints
main.js               — Entry: applies saved theme, calls initRouter()
router.js             — Hash router: renders Navbar + page on hashchange
```

---

## Architecture Rules

### Routing
`main.js` → `router.js` maps hash fragments to page functions. Each page function returns an HTML string that the router injects via `innerHTML`. `bindNavbar()` is called after every render.

### Components are HTML-string functions
No VDOM. No re-renders. Components return strings or directly mutate the DOM via `getElementById`. Keep it that way — don't introduce a framework.

### DOM timing
`LessonPage.js` uses `setTimeout(..., 50)` before initializing Monaco. This is intentional — the router sets `innerHTML` and Monaco needs the container to exist in the DOM first.

### Theme system
- Default theme: `light` (set in `main.js` from localStorage, fallback `'light'`)
- Toggle writes `data-theme="dark|light"` to `<html>` and saves to `localStorage` key `bdc-theme`
- All colors must use `var(--...)` — **never hardcode hex values** in component files
- **`.card-dark` is always dark** (`background: #111114`, `color: #E8E6E3`) in both themes — do not override this

### Progress tracking
- Key: `localStorage.queryquest_progress`
- Shape: `{ "L1_P1": { completed: true, withAssist: false, attempts: 2, updatedAt: "..." } }`
- `getAllLevelsProgress(problems)` in `progress.js` aggregates by level for the dashboard

---

## Current Feature State

### Fully Working
- Lesson page 3-column layout (problem context | editor + results | dataset explorer)
- Monaco SQL editor with Cmd/Ctrl+Enter shortcut
- Live query execution via sql.js WASM
- Result validation + concept checking (`requiredConcept` keyword must appear in query)
- Success state: green border on editor card, green checkmark + "Correct query!" + yellow "Continue →" button
- Error/wrong states: red feedback, editor card border reset
- Progressive hints (3 levels, locked behind failure count)
- Cheat sheet side panel
- Light/dark theme with smooth transition
- Local progress saved across sessions
- Dashboard: all 8 level cards clickable (no locks)
- Level page: all problems unlocked (`isLocked = false`), each gets a "Start" CTA
- Dataset Explorer: all 4 tables expanded by default
- Responsive layout (768px + 480px breakpoints)

### Partially Built
| Feature | File | Status |
|---|---|---|
| AI Coach | `src/ai/aiCoach.js` | Mock only — replace `setTimeout` with real API call |
| Supabase progress sync | `src/auth/supabase.js` | Client init done; sync logic not written |
| Level Complete screen | `src/pages/LevelCompletePage.js` | Page exists; not added to `router.js` |

### Not Built
- User-facing problem creation UI (add problems by editing `problems.json` directly)
- Automated test suite
- Any backend / server-side logic

---

## How to Make Common Changes

### Add a problem
Edit `src/data/problems.json`. Each problem follows this schema:
```json
{
  "id": "L2_P6",
  "level": 2,
  "title": "Problem Title",
  "story": "HTML string — use <strong> for bold, <code> for inline code",
  "requiredConcept": "WHERE",
  "expectedOutput": [{ "column_name": "value" }],
  "hints": [
    "General hint (always visible)",
    "More specific hint (unlocks after 1 failure)",
    "Full answer query (unlocks after 2 failures)"
  ]
}
```
`expectedOutput` is compared against the query result rows. For DML problems (INSERT/UPDATE/DELETE), use `{ "affectedRows": N }`.

### Add a database table
Edit `src/data/schema.js`. Add a key to the exported `schema` object:
```js
MyTable: {
  definition: `CREATE TABLE ...`,  // used by sqlEngine to init DB
  seed: `INSERT INTO MyTable ...`, // seed data
  description: "Plain text shown in Dataset Explorer"
}
```

### Add a new route/page
1. Create `src/pages/MyPage.js` with a default export function returning an HTML string
2. Add the route in `src/router.js`

### Wire up AI Coach
Replace the mock in `src/ai/aiCoach.js`. The toggle state is in `src/ai/aiToggle.js`. Use `VITE_AI_API_KEY` env var (set in `.env`).

### Connect Supabase progress sync
Progress writes happen in `src/store/progress.js` → `saveLocalProgress()`. Add a Supabase upsert call there. The client is already initialized in `src/auth/supabase.js`.

---

## CSS Variable Reference (key tokens)

```css
--bg-page         /* page background */
--bg-card         /* card background */
--bg-elevated     /* slightly raised surface */
--accent          /* #C8F542 yellow-green */
--text-primary    /* main text */
--text-secondary  /* muted text */
--text-muted      /* very muted */
--border          /* default border */
--border-hover    /* hovered border */
--success         /* #4ade80 green */
--error           /* red */
--font-sans       /* DM Sans */
--font-mono       /* JetBrains Mono */
--radius-md / --radius-lg / --radius-full
```

---

## Gotchas

- **sql.js WASM path**: Configured in `vite.config.js`. If queries fail to initialize, check that the WASM file is resolving correctly.
- **`card-dark` must stay dark**: It uses hardcoded `#111114` so the editor area is always dark even in light theme. Do not change this to a CSS variable.
- **`bindNavbar()` must be called after render**: The router calls it on every navigation. If you add new navbar buttons, wire them up in `bindNavbar()` inside `Navbar.js`.
- **Inline `onmouseenter`/`onmouseleave`**: Hover effects are applied inline throughout. This is intentional to avoid class-based state management.
- **`data-theme` attribute**: Lives on `<html>`. Light theme is default. Don't assume dark.

---

*Last updated: March 2026 — Antigravity / badcode team*
