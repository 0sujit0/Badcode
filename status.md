# Project Status — badcode SQL Learning Platform

> Last updated: 2026-03-24 (session update)
> Project: `/Users/solarsystem/.gemini/antigravity/playground/ruby-feynman`
> Git branch: `main`

---

## What This Is

**badcode** is a fully client-side, browser-based SQL learning platform. Users write real SQL in a Monaco editor, it runs against an in-memory SQLite database (WebAssembly), and results are validated against hardcoded expected output. No backend for query execution — everything runs in the browser.

The name is the app's brand/product name.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Bundler | Vite 8 |
| Runtime | Vanilla JS (no framework) |
| SQL Engine | sql.js (SQLite via WebAssembly) |
| Code Editor | Monaco Editor v0.55 |
| Auth + Sync | Supabase (Postgres + Supabase Auth) |
| AI Coach | OpenAI GPT-4o |
| Styling | Custom CSS with CSS variables, light/dark theme |
| Routing | Hash-based (`#/dashboard`, `#/level/1`, etc.) |
| Node | v24.14.0 (via nvm) |

---

## Project Structure

```
src/
├── main.js                  # Entry point — restores session, inits router
├── router.js                # Hash router — maps URLs to page components
│
├── auth/
│   ├── supabase.js          # Supabase client (graceful fallback to guest mode)
│   └── authUI.js            # Auth modal UI + session state + navbar button
│
├── store/
│   └── progress.js          # Progress read/write — localStorage + Supabase sync
│
├── engine/
│   └── sqlEngine.js         # sql.js wrapper: initDatabase, executeQuery, validateResult
│
├── ai/
│   ├── aiCoach.js           # GPT-4o hint generation
│   └── aiToggle.js          # Toggle AI Coach on/off in navbar
│
├── data/
│   ├── problems.json        # All 8 levels × N problems (title, story, hints, expectedOutput)
│   └── schema.js            # SQL CREATE TABLE + seed INSERT statements
│
├── pages/
│   ├── LandingPage.js       # Hero page with split-pane editor mockup
│   ├── DashboardPage.js     # 8 level cards with per-level progress bars
│   ├── LevelPage.js         # Problem list for a level
│   ├── LessonPage.js        # Main editor page — Monaco + results + hints + AI coach
│   └── LevelCompletePage.js # Congratulations screen after finishing a level
│
└── components/
    ├── Navbar.js            # Top nav — auth, theme, AI toggle, cheat sheet
    ├── Editor.js            # Monaco editor wrapper
    ├── ResultsTable.js      # Renders query output as a table
    ├── HintPanel.js         # Progressive hints panel
    ├── CheatSheet.js        # SQL reference slide-in panel
    └── DatasetExplorer.js   # Shows available tables + columns
```

---

## Curriculum — 8 Levels, 62–64 Problems

| Level | Topic | Difficulty | Key Concepts |
|---|---|---|---|
| 1 | SELECT Basics | Beginner | SELECT, FROM, DISTINCT, aliases, string concat (`\|\|`) |
| 2 | Filtering | Beginner | WHERE, AND, OR, NOT, LIKE, `<>` |
| 3 | Sorting & Pagination | Beginner | ORDER BY, LIMIT, OFFSET, IN, BETWEEN, NOT IN |
| 4 | Aggregate Functions | Intermediate | COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING |
| 5 | JOIN Operations | Intermediate | INNER JOIN, LEFT JOIN, multi-table joins |
| 6 | DML — Data Mutation | Intermediate | INSERT, UPDATE, DELETE (real mutations to in-memory DB) |
| 7 | String & Date Functions | Advanced | SUBSTR, INSTR, julianday, CASE, COALESCE |
| 8 | Window Functions | Advanced | ROW_NUMBER, RANK, OVER, PARTITION BY, UNION |

---

## In-Memory Database

4 tables, seeded at startup:

| Table | Rows |
|---|---|
| `Customers` | 9 (base seed) |
| `Products` | 9 (base seed) |
| `Orders` | 20 (base seed) |
| `Employees` | 5 (base seed) |

**Important design detail:** Level 6 problems mutate the DB (INSERT/UPDATE/DELETE). Level 7 and 8 `expectedOutput` values were authored assuming those L6 mutations are already applied — this is the source of Bug #1 (see below).

---

## Auth & Progress

- **Guest mode:** Progress saved to `localStorage` only. Works with no env vars.
- **Auth:** Supabase email+password. Auth state restored on page load before router renders.
- **Sync:** On every problem completion, progress is upserted to Supabase. On login, Supabase data is merged back into localStorage. Guest progress is bulk-migrated on first sign-in.
- **Progress shape:** `{ "L1_P1": { completed, withAssist, attempts, updatedAt }, ... }`
- **Supabase table:** `user_progress` with RLS (users can only read/write their own rows).

---

## AI Coach

- GPT-4o via `VITE_AI_API_KEY` in `.env`
- Triggered on wrong answers — returns a 2–3 sentence Socratic hint (does not give the answer)
- When used, `withAssist: true` is recorded in progress
- Hidden automatically if `VITE_AI_API_KEY` is not set

---

## Environment Variables (`.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_AI_API_KEY=sk-...   # OpenAI, optional
```

All three are optional — app degrades gracefully (no Supabase → guest mode, no AI key → AI Coach hidden).

---

## What Is Built and Working

- [x] Core SQL engine (WebAssembly / sql.js) — fully working
- [x] Monaco editor integration
- [x] 8-level curriculum — problems, hints, expectedOutput in `problems.json`
- [x] Results table with correct/incorrect validation
- [x] Progressive hints panel
- [x] Cheat Sheet panel (SQL reference)
- [x] Dataset Explorer (shows tables and columns)
- [x] Dark/light theme toggle (persisted to localStorage)
- [x] AI Coach (GPT-4o Socratic hints on wrong answers)
- [x] Progress tracking in localStorage
- [x] Supabase `user_progress` table with RLS — set up
- [x] Auth modal — Sign In / Sign Up, email shown in navbar
- [x] Session restore on page load (`getSession` before router render)
- [x] `syncToSupabase` — saves progress on every problem completion
- [x] `loadFromSupabase` — loads and merges progress on login
- [x] `migrateGuestProgress` — bulk-uploads localStorage on first sign-in
- [x] Landing page with split-pane editor hero mockup
- [x] Dashboard with 8 level cards and per-level progress bars
- [x] Production build (`dist/`) generated

---

## Known Bugs (see `Bugs.md` for full details)

### Bug #1 — CRITICAL: DB state is session-scoped, not deterministic
**File:** [src/engine/sqlEngine.js](src/engine/sqlEngine.js)

The `db` singleton is initialized once per page load and never reset. Level 6 mutations (INSERT/UPDATE/DELETE) permanently alter the in-memory DB for that session. Level 7 and 8 expected outputs assume L6 mutations are already applied.

**Breaks when:** student refreshes the page mid-L7/L8, navigates directly to L7/L8 via URL, opens a new tab, or does any level out of order.

**~9 affected problems:** L7_P1, L7_P2, L7_P3, L7_P5 (partial), L7_P8, L7_P9, L8_P4, L8_P5, L8_P8

**Proposed fix:** Introduce level-scoped DB snapshots. Reset to base seed for L1–L6. Reset to a "post-L6 snapshot" seed for L7–L8 (base seed + L6 mutations pre-applied). Files: `sqlEngine.js`, `schema.js`, `LessonPage.js`.

---

### Bug #2 — CRITICAL: L7_P4 hardcoded date makes problem permanently unsolvable
**File:** [src/data/problems.json](src/data/problems.json) — problem `L7_P4`

`expectedOutput` contains `{ "days_registered": 1160 }` locked to a specific past date. The result will never match on any other day. Additionally, only 1 row is expected but the correct query returns all customers.

**Proposed fix:** Replace with a problem that computes days between two fixed hardcoded dates (no dependency on `now()`).

---

### Bug #3 — MEDIUM: L7_P5 expected output has 1 row, correct query returns many
**File:** [src/data/problems.json](src/data/problems.json) — problem `L7_P5`

Problem asks to extract email domain. `expectedOutput` has 1 row (`"example.com"`), but the correct query returns one row per customer. A correct answer is always marked wrong.

**Proposed fix:** Either change `expectedOutput` to all rows, or redesign problem to explicitly teach `SELECT DISTINCT`.

---

## Remaining / Next Steps

- [ ] **Fix Bug #1** — level-scoped DB snapshots (highest priority, blocks L7+L8)
- [ ] **Fix Bug #2** — redesign L7_P4 with stable date arithmetic
- [ ] **Fix Bug #3** — fix L7_P5 expected output or problem design
- [ ] **Email confirmation UX** — Supabase sends a confirmation email on sign-up; UI just shows a message
- [ ] **Forgot password flow** — `supabase.auth.resetPasswordForEmail()` not wired up — users currently must reset via Supabase dashboard
- [ ] **Profile page** — user stats, total problems solved, levels completed
- [ ] **Leaderboard** — aggregate `user_progress` across users (Postgres view or Edge Function)
- [ ] **Streak / XP gamification** layer
- [ ] **Mobile editor** — Monaco doesn't work well on small screens; consider textarea fallback
- [ ] **Deploy** — Vite build + Vercel/Netlify; set env vars in hosting dashboard

---

## How to Run Locally

```bash
export PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"
npm install          # first time only
npm run dev          # → http://localhost:3000 (or next available port)
npm run build        # → dist/
```

**Note:** `npm` must be invoked with the nvm node in PATH — it is not on the system PATH by default. Vite will auto-increment the port if 3000/3001 are in use (e.g. → 3002).

## Supabase Status (as of 2026-03-24)

- Project URL: `https://blruqrhfwoipdkxlocgu.supabase.co` — **active and reachable** (confirmed via `getSession()`)
- Anon key format: `sb_publishable_...` (new Supabase key format, compatible with `@supabase/supabase-js` v2.99+)
- Auth modal: Sign In / Sign Up both wired up and visible in navbar
- Sign-in returns "invalid credentials" if account doesn't exist — user must Sign Up first, then confirm email
