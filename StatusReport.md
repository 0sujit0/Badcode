# StatusReport — badcode SQL Learning Platform

> Last updated: 2026-03-24
> Project directory: `/Users/solarsystem/.gemini/antigravity/playground/ruby-feynman`

---

## What This Project Is

**badcode** is a browser-based, hands-on SQL learning platform. Users write real SQL queries inside a Monaco editor, the query runs against an in-memory SQLite database (via sql.js / WebAssembly), and results are validated against expected output. There are no videos or slides — just problems, a query editor, and real data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Bundler | Vite 8 |
| Runtime | Vanilla JS (no framework) |
| SQL Engine | sql.js (SQLite compiled to WebAssembly) |
| Code Editor | Monaco Editor |
| Auth + Database | Supabase (Postgres, Supabase Auth) |
| AI Coach | OpenAI GPT-4o (`gpt-4o`) |
| Styling | Custom CSS with CSS variables, light/dark theme |
| Routing | Hash-based (`#/dashboard`, `#/level/1`, etc.) |

---

## Project Structure

```
src/
├── main.js                  # Entry point — restores session, inits router
├── router.js                # Hash router — maps URLs to page components
│
├── auth/
│   ├── supabase.js          # Supabase client init (graceful fallback to guest mode)
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
│   └── schema.js            # SQL CREATE TABLE + seed INSERT statements for in-memory DB
│
├── pages/
│   ├── LandingPage.js       # Hero page — CTA to dashboard
│   ├── DashboardPage.js     # 8 level cards with per-level progress bars
│   ├── LevelPage.js         # Problem list for a given level
│   ├── LessonPage.js        # Main editor page — Monaco + results + hints + AI coach
│   └── LevelCompletePage.js # Congratulations screen after finishing a level
│
└── components/
    ├── Navbar.js            # Top nav — auth button, theme toggle, AI toggle, cheat sheet
    ├── Editor.js            # Monaco editor wrapper
    ├── ResultsTable.js      # Renders query output as a table
    ├── HintPanel.js         # Progressive hints panel
    ├── CheatSheet.js        # SQL reference slide-in panel
    └── DatasetExplorer.js   # Shows available tables and columns
```

---

## Curriculum

8 levels, each with multiple problems. Difficulty ramps from beginner to advanced:

| Level | Name | Difficulty | Key Concepts |
|---|---|---|---|
| 1 | Foundations | Beginner | SELECT, FROM, basic queries |
| 2 | Filtering | Beginner | WHERE, AND, OR, NOT |
| 3 | Sorting & Limiting | Beginner | ORDER BY, LIMIT |
| 4 | Aggregation | Intermediate | COUNT, SUM, AVG, GROUP BY |
| 5 | Joins | Intermediate | INNER JOIN, LEFT JOIN |
| 6 | Subqueries | Intermediate | Nested SELECT |
| 7 | Advanced Filtering | Advanced | HAVING, CASE, COALESCE |
| 8 | Advanced Joins | Advanced | Multi-table joins, complex queries |

Problems have: `id`, `level`, `title`, `story` (narrative context), `requiredConcept`, `hints[]`, and `expectedOutput`.

---

## In-Memory Database (sql.js)

The SQL engine runs entirely in the browser using WebAssembly. No backend server is needed for query execution.

- Tables are defined in `src/data/schema.js` (CREATE TABLE + seed data)
- `initDatabase()` bootstraps the DB on first use
- `executeQuery(sql)` runs a query and returns `{ columns, rows, rowsModified }`
- `validateResult(result, expectedOutput)` compares output (supports SELECT and DML)
- `checkConcept(sql, requiredConcept)` ensures the user used the required SQL keyword

---

## Auth & User Accounts

### Supabase Auth
- Client initialized in `src/auth/supabase.js` using env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- If env vars are missing, the app runs in **guest mode** (auth button hidden, localStorage only)
- Sign-in / Sign-up via email + password (Supabase handles hashing, JWT, sessions)

### Auth UI (`src/auth/authUI.js`)
- Navbar shows **"Sign In"** when logged out, **"username · Sign Out"** when logged in
- Modal has a toggle between Sign In and Sign Up modes
- Enter key submits the form; backdrop click closes it
- On sign-in: guest localStorage progress is migrated to Supabase, then Supabase data is loaded back

### Session Restore
- `main.js` calls `supabase.auth.getSession()` before the router renders, so auth state is available on page refresh without flicker

---

## Progress Tracking

### Storage Strategy: localStorage-first, Supabase as sync layer

| Scenario | Behavior |
|---|---|
| Guest user | Progress saved to `localStorage` only (key: `queryquest_progress`) |
| Guest signs in | Existing localStorage progress bulk-upserted to Supabase (`migrateGuestProgress`), then Supabase data merged back |
| Logged-in user completes problem | Saved to localStorage + synced to Supabase (fire-and-forget) |
| Returning user on new device | Signs in → `loadFromSupabase` fetches all rows → merged into localStorage |

### Progress shape (localStorage)
```json
{
  "L1_P1": { "completed": true, "withAssist": false, "attempts": 2, "updatedAt": "ISO_DATE" },
  "L2_P3": { "completed": true, "withAssist": true, "attempts": 5, "updatedAt": "ISO_DATE" }
}
```

### Supabase table: `user_progress`
```sql
create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  problem_id text not null,         -- e.g. "L1_P1"
  completed boolean default false,
  with_assist boolean default false,
  attempts integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, problem_id)
);
-- RLS: users can only read/write their own rows
alter table user_progress enable row level security;
create policy "own rows only" on user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Merge conflict resolution: the row with the newer `updated_at` timestamp wins.

---

## AI Coach

- Powered by **OpenAI GPT-4o** (`src/ai/aiCoach.js`)
- Requires `VITE_AI_API_KEY` in `.env`
- Activated via the AI toggle button in the navbar
- On a wrong answer, sends the problem context + user's query to GPT-4o and receives a 2–3 sentence Socratic hint (does not give the answer directly)
- When AI assist is used on a problem, `withAssist: true` is recorded in progress

---

## Environment Variables

Create a `.env` file at project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_AI_API_KEY=sk-...   # OpenAI key, optional
```

All three are optional — the app degrades gracefully:
- No Supabase keys → guest mode (localStorage only, no auth)
- No AI key → AI Coach button is hidden

---

## Running Locally

Node is managed via nvm. The active version is `v24.14.0`.

```bash
# Activate node
export PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH"

# Install deps (first time only)
npm install

# Start dev server
npm run dev
# → http://localhost:3000 (or next available port — 3001, 3002, etc.)
```

> **Note:** Node is not on the system PATH by default. The `export PATH` line above must be run in each new shell session, or added to `~/.zshrc`.

---

## What Has Been Done

- [x] Core SQL engine with WebAssembly (sql.js) — fully working
- [x] 8-level curriculum with problems, hints, expected output
- [x] Monaco editor integration
- [x] Results table with correct/incorrect validation
- [x] AI Coach (GPT-4o hints on wrong answers)
- [x] Progress tracking in localStorage
- [x] Dark/light theme toggle (persisted to localStorage)
- [x] Cheat Sheet panel, Dataset Explorer, Hint Panel
- [x] Supabase project created and `user_progress` table set up with RLS
- [x] Auth modal — Sign In / Sign Up toggle, email displayed in navbar
- [x] Session restore on page load (`getSession` before router render)
- [x] `syncToSupabase` — saves progress to Supabase on every problem completion
- [x] `loadFromSupabase` — loads and merges Supabase progress on login
- [x] `migrateGuestProgress` — bulk-uploads localStorage data when a guest signs in
- [x] Landing page redesigned with split-pane editor hero mockup
- [x] Breadcrumb navigation in Navbar (Modules → Level → Problem)
- [x] Supabase project confirmed active and reachable (2026-03-24)
- [x] Auth key format updated to new `sb_publishable_...` format (compatible with supabase-js v2.99+)
- [x] Dev server running — port auto-increments if 3000/3001 are in use

---

## What Remains / Possible Next Steps

- [ ] **Email confirmation UX** — Supabase sends a confirmation email on sign-up; the UI currently just shows a message. Could auto-switch to sign-in mode or poll for confirmation.
- [ ] **Forgot password flow** — `supabase.auth.resetPasswordForEmail()` not yet wired up — users must currently reset via Supabase dashboard
- [ ] **Profile page** — show user stats, total problems solved, levels completed
- [ ] **Leaderboard** — aggregate `user_progress` data across users (requires a Postgres view or Edge Function)
- [ ] **Streak / XP system** — gamification layer on top of progress
- [ ] **More problems** — expand Level 7 and 8 with additional advanced queries
- [ ] **Mobile editor** — Monaco doesn't behave well on small screens; could swap for a textarea on mobile
- [ ] **Deploy** — Vite build + deploy to Vercel/Netlify; set env vars in hosting dashboard
