# Bugs & Structural Issues — SQL Learning Platform

## System Overview

The platform runs entirely client-side. There is no backend for curriculum delivery.

- **Curriculum:** 64 problems across 8 levels, hardcoded in `src/data/problems.json`
- **Database:** SQLite via SQL.js (WebAssembly), runs in the browser
- **Schema:** 4 tables — `Customers` (9 rows), `Products` (9 rows), `Orders` (20 rows), `Employees` (5 rows) — defined and seeded in `src/data/schema.js`
- **Validation:** Student query output is compared as JSON against a hardcoded `expectedOutput` array per problem
- **Progress:** Stored in `localStorage`, optionally synced to Supabase for authenticated users

---

## Bug #1 — Critical: DB State Is Session-Dependent, Not Deterministic

**File:** `src/engine/sqlEngine.js` (line 5–9)

**What's happening:**

The database is initialized as a module-level singleton and never reset:

```js
let db = null;

export async function initDatabase() {
  if (db) return db; // ← only initializes once per page load, never resets
  ...
}
```

Level 6 teaches DML — students run real `INSERT`, `UPDATE`, and `DELETE` statements that permanently mutate the in-memory database for the rest of the session:

| L6 Problem | Operation | What it does to the DB |
|---|---|---|
| L6_P1 | `INSERT INTO Customers` | Adds Rahul Sharma (10th customer) |
| L6_P2 | `INSERT INTO Products` | Adds Gaming Headset (10th product) |
| L6_P4 | `UPDATE Orders SET amount = 40.00 WHERE id = 102` | Changes order 102 amount from 45 → 40 |
| L6_P5 | `DELETE FROM Orders WHERE status = 'Cancelled'` | Removes 2 cancelled orders |

**Level 7 and Level 8 `expectedOutput` values were authored assuming these mutations are already in place.** Examples:

- `L7_P1` expects 10 email prefixes (including `"rahu"` for Rahul)
- `L7_P8` expects 10 products (including `"Gaming Headset"`)
- `L7_P9` expects 10 customers (including Rahul)
- `L8_P5` running revenue shows order 102 with `amount: 40` (post-UPDATE value)
- `L8_P5` excludes the two cancelled orders (post-DELETE state)
- `L8_P8` UNION result includes Rahul (10 customers + 5 employees = 15 rows)

**When does this break?**

| Scenario | Result |
|---|---|
| Student does L6 → L7 → L8 in one browser session | ✅ Works accidentally |
| Student refreshes the page mid-L7 or mid-L8 | ❌ DB resets to seed, Rahul gone, L7/L8 answers never match |
| Student navigates directly to any L7/L8 problem via URL | ❌ Same — L6 mutations never ran |
| Student does L8 before L6 | ❌ All affected problems unsolvable |
| Student opens the app in a new tab | ❌ Breaks immediately |

**Affected problems:** L7_P1, L7_P2, L7_P3, L7_P5 (partially), L7_P8, L7_P9, L8_P4, L8_P5, L8_P8 — approximately **9 problems** are broken under any non-linear or refreshed navigation.

---

## Bug #2 — L7_P4: Hardcoded Date Makes Problem Unsolvable

**File:** `src/data/problems.json` — problem `L7_P4`

**What's happening:**

The problem asks students to calculate "how many days since each customer registered" using `julianday`. The `expectedOutput` is:

```json
[{"first_name": "John", "days_registered": 1160}]
```

Two issues:

1. **Only 1 row is expected**, but the query described in the hints (`SELECT first_name, (julianday(...) - julianday(registration_date)) AS days_registered FROM Customers`) returns all customers — not 1.
2. **The value `1160` is hardcoded** against a specific date (`'2026-03-15'` in the hint). This means the answer is only correct on that exact date. On any other day, the result will never match `expectedOutput`, and the problem is permanently unsolvable.

**Impact:** This problem can never be correctly completed by any student running the app today or in the future.

---

## Bug #3 — L7_P5: Expected Output Has 1 Row, Query Returns Many

**File:** `src/data/problems.json` — problem `L7_P5`

**What's happening:**

The problem asks to "extract the email domain (everything after the `@`)" from the Customers table. The `expectedOutput` is:

```json
[{"domain": "example.com"}]
```

Only 1 row. But the answer query in the hints:

```sql
SELECT SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM Customers
```

...returns a row for **every customer** (all with the same domain `example.com`). There is no `DISTINCT` or `LIMIT` in the hint, and `DISTINCT` is not the `requiredConcept` for this problem.

**Impact:** A student who writes the correct, logical answer gets told they are wrong because their result has 10 rows instead of 1. The only way to pass is to use `LIMIT 1` or `DISTINCT`, neither of which is taught in the problem context.

---

## Summary Table

| # | Problem | Severity | Affected Problems | Root Cause |
|---|---|---|---|---|
| 1 | DB state is session-scoped, not level-scoped | 🔴 Critical | L7_P1, L7_P2, L7_P3, L7_P8, L7_P9, L8_P4, L8_P5, L8_P8 (~9 problems) | `db` singleton never resets between levels |
| 2 | L7_P4 hardcoded date + wrong row count | 🔴 Critical | L7_P4 | `expectedOutput` locked to a specific calendar date |
| 3 | L7_P5 expected output expects 1 row, query returns many | 🟡 Medium | L7_P5 | Missing `DISTINCT` in problem design |

---

## Proposed Fix Direction

### For Bug #1

Introduce **level-scoped DB snapshots**. The engine should reset the database to a known state when entering a new level, rather than relying on session continuity.

- **L1–L6:** Reset to base seed on each level load
- **L7–L8:** Reset to a "post-L6 snapshot" seed — the base seed with L6's mutations pre-applied (Rahul and Gaming Headset added, order 102 updated, cancelled orders removed)

This preserves the pedagogical continuity (Level 7's world reflects what students built in Level 6) while making it fully deterministic regardless of navigation order or page refresh.

**Files to change:** `src/engine/sqlEngine.js` (add `resetDatabase(snapshot)`), `src/data/schema.js` (add post-L6 snapshot seed), `src/pages/LessonPage.js` (trigger reset on level change).

### For Bug #2

Replace `L7_P4` with a redesigned problem that does not depend on `now()`. For example: compute the difference in days between two **fixed, hardcoded dates** in the problem story (e.g., "how many days between their registration date and `2024-01-01`?"). This makes `expectedOutput` stable and correct forever.

### For Bug #3

Either:
- Change `expectedOutput` to include all rows (all `"example.com"` values, one per customer), OR
- Rewrite the problem to explicitly teach `SELECT DISTINCT` and update `requiredConcept` accordingly
