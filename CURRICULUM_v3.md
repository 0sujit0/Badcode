# badcode — Full Curriculum v3

> 10 levels · 87 problems · From `SELECT *` to window functions
>
> _v3 adds the Execution Pipeline — a progressive visual that teaches learners how SQL actually runs, not just what to type._

---

## Design Philosophy

Most SQL curricula teach syntax. This one teaches **thinking in sets**.

Every level has a single cognitive goal — one new mental model the learner must internalise before advancing. Problems within a level are ordered by scaffolding: the first 2–3 problems isolate the concept, the middle problems combine it with prior knowledge, and the final 1–2 problems are stretch challenges that preview the next level's thinking.

The ShopKart dataset stays constant throughout. Learners should never be confused by the _data_ — only by the _query_.

---

## The Execution Pipeline — How SQL Actually Runs

### Why this matters

Beginners read SQL top-to-bottom and assume it runs that way:

```sql
SELECT first_name        ← "this runs first"
FROM Customers           ← "then this"
WHERE email IS NOT NULL  ← "then this"
ORDER BY first_name      ← "then this"
```

**Wrong.** SQL runs in a completely different order than how you write it. This single misunderstanding is the root cause of 80% of beginner confusion — why aliases don't work in WHERE, why HAVING exists, why you can't reference a window function in WHERE.

### The full execution order

```
┌─────────────────────────────────────────────────────────────────┐
│                   SQL EXECUTION PIPELINE                        │
│                                                                 │
│   Step 1  ►  FROM / JOIN        What tables? How connected?     │
│   Step 2  ►  WHERE              Filter individual rows          │
│   Step 3  ►  GROUP BY           Collapse rows into groups       │
│   Step 4  ►  HAVING             Filter groups (not rows)        │
│   Step 5  ►  SELECT             Choose & compute columns        │
│   Step 6  ►  DISTINCT           Remove duplicate rows           │
│   Step 7  ►  ORDER BY           Sort the final result           │
│   Step 8  ►  LIMIT / OFFSET     Cut the output window           │
│                                                                 │
│   * Window functions execute between Step 4 and Step 5          │
│   * CASE WHEN executes inside Step 5 (it's part of SELECT)      │
│   * Subqueries execute when the step that contains them runs    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### How we teach it: Progressive Reveal

Learners do NOT see this full pipeline on day one. That would be overwhelming and meaningless without context. Instead, **each level reveals only the pipeline steps the learner has encountered so far.** New steps pulse/highlight when they're introduced.

The pipeline lives as a persistent sidebar widget in the problem view. It starts nearly empty and fills in as the learner progresses. By Level 10, the full pipeline is visible — and the learner built it themselves, step by step.

---

## Database Schema

The entire curriculum runs against **4 tables**:

| Table | Key Columns | Design Notes |
|-------|-------------|--------------|
| **Customers** | `id`, `first_name`, `last_name`, `email`, `registration_date` | Some customers have NULL emails (intentional — teaches NULL handling) |
| **Products** | `id`, `name`, `category`, `price`, `stock` | Price is REAL (not INTEGER) — teaches decimal awareness |
| **Orders** | `id`, `customer_id`, `product_id`, `order_date`, `status`, `amount` | Statuses: Processing, Shipped, Delivered, Cancelled |
| **Employees** | `id`, `first_name`, `last_name`, `department`, `role`, `salary`, `hire_date` | Departments: Engineering, Sales, Marketing, HR, Finance |

**Referential integrity:** `Orders.customer_id → Customers.id`, `Orders.product_id → Products.id`

**Deliberate data quirks** (these become teachable moments):
- At least 1 customer has no orders (for LEFT JOIN discovery)
- At least 1 product has NULL stock (for NULL handling)
- At least 1 customer has NULL email (for IS NULL / COALESCE)
- At least 2 employees share the same salary (for RANK vs DENSE_RANK)
- Order amounts occasionally differ from product price × quantity (real-world messiness)

---

## Level 1 — SELECT Basics

**Mental model:** _A table is a grid. SELECT chooses columns. Every query returns a new grid._

*Learn to retrieve data from tables using SELECT, column selection, DISTINCT, aliases, and expressions.*

**Pipeline sidebar:** `FROM (NEW) → SELECT (NEW)`

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Customer Directory | `SELECT *` | Code | Retrieve all columns from the Customers table |
| 2 | Product Catalog | `SELECT *` | Code | Retrieve all columns from the Products table |
| 3 | Customer Contact List | Column selection | Code | Return only `first_name` and `last_name` from Customers |
| 4 | Employee Overview | Column selection | Code | Return `first_name`, `last_name`, and `department` from Employees |
| 5 | Unique Categories | `DISTINCT` | Code | Retrieve each product category only once |
| 6 | Unique Departments | `DISTINCT` | Code | List every department that exists in Employees |
| 7 | Friendly Column Names | `AS` (alias) | Code | Alias `first_name`, `last_name`, `email` as `first`, `last`, `contact` |
| 8 | Full Name Column | `\|\|` (concat) | Code | Concatenate first and last name into a single `full_name` column |

> **Professor's note:** Problem 1 and 2 seem trivial, but they establish that `SELECT *` is a _tool for exploration_, not production code. By Problem 7, learners already prefer naming exactly what they need.

---

## Level 2 — Filtering with WHERE

**Mental model:** _WHERE is a row-level filter. It evaluates each row independently — TRUE keeps, FALSE discards._

*Filter rows using WHERE, comparison operators, logical connectors, pattern matching, and NULL awareness.*

**Pipeline sidebar:** `FROM → WHERE (NEW) → SELECT`

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Processing Orders | `WHERE =` | Code | Find orders with status 'Processing' |
| 2 | Electronics Inventory | `WHERE =` | Code | Find all Electronics products |
| 3 | High Value Orders | `WHERE >` | Code | Find orders where amount > 500 |
| 4 | Low Stock Alert | `WHERE <` | Code | Find products where stock < 30 |
| 5 | Active Orders | `WHERE <>` | Code | Find orders NOT 'Delivered' |
| 6 | Pricey Electronics | `AND` | Code | Electronics with price > 50 |
| 7 | Shipments in Motion | `OR` | Code | Orders with status 'Shipped' OR 'Cancelled' |
| 8 | Keyboard Products | `LIKE` | Code | Products whose name contains 'Key' |
| 9 | Bulk Non-Electronics | `AND` + `<>` | Code | Non-Electronics products with stock > 100 |
| 10 | Ghost Emails | `IS NULL` | Code | Find customers who have no email on file |
| 11 | Verified Contacts | `IS NOT NULL` | Code | Find customers who DO have an email |

> **Why NULLs here, not later?** NULL is the single most misunderstood concept in SQL. Introducing it as a filtering problem — not a function problem — anchors the right mental model: NULL is _unknown_, not zero, not empty string. If learners try `email = NULL` and get zero rows, they learn why `IS NULL` exists.

---

## Level 3 — Sorting & Pagination

**Mental model:** _ORDER BY reshapes presentation, not data. LIMIT/OFFSET controls the window._

*Order results, limit output, and use IN, BETWEEN, NOT IN, and OFFSET for pagination patterns.*

**Pipeline sidebar:** `FROM → WHERE → SELECT → DISTINCT (NEW) → ORDER BY (NEW) → LIMIT/OFFSET (NEW)`

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Newest Orders | `ORDER BY DESC` | Code | Sort orders by date descending |
| 2 | Top Expensive Products | `ORDER BY` + `LIMIT` | Code | Top 3 most expensive products (name, price) |
| 3 | Selected Customers | `IN` | Code | Orders placed by customer_id 1, 2, or 3 |
| 4 | Mid Range Products | `BETWEEN` | Code | Products with price between 50 and 500 |
| 5 | Preview Orders | `ORDER BY` + `LIMIT` | Code | 5 most recent orders |
| 6 | Department Roster | Multi-column `ORDER BY` | Code | Employees sorted by department ASC, salary DESC |
| 7 | Excluding Early Customers | `NOT IN` | Code | Orders where customer_id NOT IN (1, 2, 3) |
| 8 | Page 2 of Products | `LIMIT` + `OFFSET` | Code | Second page of products (3 per page) |

---

## Level 4 — Aggregate Functions

**Mental model:** _Aggregates collapse many rows into one. GROUP BY defines what "many" means._

*Summarize data with COUNT, SUM, AVG, MIN, MAX, GROUP BY, and HAVING. Understand the distinction between row-level and set-level operations.*

**Pipeline sidebar:** `FROM → WHERE → GROUP BY (NEW) → HAVING (NEW) → SELECT → DISTINCT → ORDER BY → LIMIT/OFFSET`

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Total Orders | `COUNT(*)` | Code | Count total number of orders |
| 2 | Total Revenue | `SUM` | Code | Sum of all order amounts |
| 3 | Average Product Price | `AVG` | Code | Average price across all products |
| 4 | Price Extremes | `MIN` / `MAX` | Code | Cheapest and most expensive product in one query |
| 5 | Orders Per Customer | `GROUP BY` | Code | Count of orders grouped by customer_id |
| 6 | Revenue by Product | `GROUP BY` + `SUM` | Code | Total revenue per product, sorted highest first |
| 7 | Unique Products Sold | `COUNT(DISTINCT)` | Code | Count of distinct products ever ordered |
| 8 | High Value Customers | `HAVING` | Code | Customers with more than 1 order |
| 9 | The NULL Trap | `COUNT(*)` vs `COUNT(col)` | Code | Compare `COUNT(*)` vs `COUNT(email)` — observe the difference |
| 10 | Pipeline Check: Aggregates | Execution order | 🔧 Pipeline | Arrange execution steps for an aggregate query |

> **Why Problem 9?** This is where NULL understanding from Level 2 pays off. `COUNT(*)` counts rows; `COUNT(email)` counts non-NULL values. Every working analyst has been burned by this distinction.

---

## Level 5 — JOIN Operations

**Mental model:** _A JOIN creates a new temporary table by matching rows across two tables. The ON clause is the matching rule._

*Combine tables using INNER JOIN, LEFT JOIN, multi-table JOINs, self JOINs, and JOINs with filtering/grouping.*

**Pipeline sidebar:** `FROM / JOIN (UPDATED) → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT/OFFSET`

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Customer Orders | `INNER JOIN` | Code | Show order id and customer first_name |
| 2 | Order Product Names | `INNER JOIN` | Code | Show order id and product name |
| 3 | Order Details Dashboard | Multi-table `JOIN` | Code | Three-table JOIN: first_name, product name, amount |
| 4 | Customer Purchase History | Multi-table `JOIN` | Code | Show first_name and product name for all orders |
| 5 | Potential Customers | `LEFT JOIN` + `IS NULL` | Code | Customers who never placed an order |
| 6 | Delivered Order Report | `JOIN` + `WHERE` | Code | Delivered orders with customer names, sorted by date |
| 7 | Revenue by Category | `JOIN` + `GROUP BY` | Code | Order count and total revenue per product category |
| 8 | Premium Deliveries | Multi-table `JOIN` | Code | Delivered orders with customer + product names, sorted by amount |
| 9 | Department Colleagues | Self `JOIN` | Code | Find pairs of employees who share the same department |
| 10 | Pipeline Check: JOIN + Agg | Execution order | 🔧 Pipeline | Arrange steps for a LEFT JOIN + GROUP BY query — includes bug hunt |

> **Problem 5 is the most important problem in the entire curriculum.** LEFT JOIN + IS NULL is the canonical pattern for "find what's missing." It appears in every analytics job, every debugging session, every data quality audit.

---

## Level 6 — NULL Handling & COALESCE

**Mental model:** _NULL propagates through everything it touches. COALESCE is your shield._

*Handle missing data with IS NULL, COALESCE, IFNULL, and understand NULL behaviour in arithmetic, comparisons, and aggregates.*

**Pipeline sidebar:** ⚠️ *NULL warning icons appear on WHERE, GROUP BY, SELECT, and ORDER BY — NULL affects every step.*

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Default Email | `COALESCE` | Code | Show customer email, or 'no_email@placeholder.com' if NULL |
| 2 | Safe Stock Count | `COALESCE` | Code | Show product stock, defaulting NULLs to 0 |
| 3 | NULL Arithmetic | `NULL` propagation | Code | Attempt to add 10 to a NULL stock value — observe the result |
| 4 | Full Contact Card | `COALESCE` + `\|\|` | Code | Build "Name <email>" string, handling NULL emails gracefully |
| 5 | Complete Records Only | Multi-column `IS NOT NULL` | Code | Find products where BOTH price AND stock are non-NULL |

> **Why a dedicated NULL level?** In 15 years of teaching, the #1 production bug from junior analysts is NULL mishandling. It deserves its own level, not a footnote.

---

## Level 7 — Data Manipulation (DML)

**Mental model:** _SELECT reads. INSERT/UPDATE/DELETE write. Writes are permanent — there is no undo button._

*Modify data using INSERT, UPDATE, DELETE, and conditional updates.*

**Pipeline sidebar:** *DML has its own mini-pipeline. INSERT adds rows directly. UPDATE and DELETE borrow WHERE from the SELECT pipeline.*

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Add a New Customer | `INSERT` | Code | Insert Rahul Sharma into Customers |
| 2 | New Product Arrival | `INSERT` | Code | Insert Gaming Headset into Products |
| 3 | Restock Inventory | `UPDATE` | Code | Update Laptop stock to 50 |
| 4 | Correct Order Amount | `UPDATE` (specific) | Code | Update order 102 amount to 40.00 |
| 5 | Price Hike | `UPDATE` (conditional) | Code | Increase price by 10% for all Electronics products |
| 6 | Remove Cancelled Orders | `DELETE` | Code | Delete all Cancelled orders |
| 7 | Selective Cleanup | `DELETE` + subquery | Code | Delete orders for products that no longer exist in Products |

> **Problems 5 and 7 bridge to advanced thinking.** A conditional UPDATE reinforces that UPDATE operates on _sets_, not single rows. The DELETE with subquery previews Level 10's subquery concepts.

---

## Level 8 — String & Date Functions

**Mental model:** _Functions transform column values row by row. They don't filter or aggregate — they reshape._

*Manipulate text with SUBSTR, INSTR, UPPER, LOWER, LENGTH, REPLACE, CAST, and date math with julianday.*

**Pipeline sidebar:** *Functions work within existing steps — they can appear in WHERE, SELECT, or ORDER BY.*

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Email Prefix | `SUBSTR` | Code | First 4 characters of each customer's email |
| 2 | Find the @ Symbol | `INSTR` | Code | Position of '@' in each email |
| 3 | Email Username | `SUBSTR` + `INSTR` | Code | Text before the '@' in each email |
| 4 | Customer Email Domain | `SUBSTR` + `INSTR` | Code | Text after the '@' in each email |
| 5 | Uppercase Roster | `UPPER` / `LOWER` | Code | Employee name badge: UPPER last_name, LOWER first_name |
| 6 | Name Length Ranking | `LENGTH` + `ORDER BY` | Code | Employees ranked by full name length |
| 7 | Safe Email Display | `REPLACE` | Code | Replace '@' with ' [at] ' in emails |
| 8 | Integer Price Tags | `CAST` | Code | Truncate product prices to whole numbers |
| 9 | Days Since Registration | `julianday` | Code | Days between each customer's registration and today |
| 10 | Tenure in Years | `julianday` + arithmetic | Code | Employee tenure in whole years (not days) |

> **Problem 10 is deliberately hard.** Converting julian day differences to years requires dividing by 365.25 and casting/rounding. It combines three concepts (date math, arithmetic, CAST) in one query.

---

## Level 9 — CASE WHEN & UNION

**Mental model:** _CASE WHEN adds conditional logic inside a query. UNION stacks result sets vertically._

*Categorise data with CASE WHEN, combine result sets with UNION/UNION ALL, and build derived columns.*

**Pipeline sidebar:** `SELECT` step highlights — *CASE WHEN lives inside SELECT. UNION runs the full pipeline twice, then stacks.*

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Price Tiers | `CASE WHEN` | Code | Categorise products into Budget (<50), Mid-range (50–500), Premium (>500) |
| 2 | Order Status Labels | `CASE WHEN` | Code | Map statuses to human-friendly labels: Processing→'In Progress', etc. |
| 3 | Salary Bands | `CASE WHEN` + `GROUP BY` | Code | Count employees in each salary band (Junior/Mid/Senior) |
| 4 | Company Directory | `UNION` | Code | Combine customers and employees into one name + type list |
| 5 | All People, All Sources | `UNION ALL` | Code | Same as above — duplicates preserved, demonstrating the difference |
| 6 | Conditional Revenue Flag | `CASE WHEN` + `SUM` | Code | Total revenue split into 'High' (>200) and 'Low' (<=200) buckets |

> **Why separate CASE and UNION from Level 10?** Window functions are hard enough without also juggling conditional logic. Isolating CASE WHEN here means learners arrive at window functions already comfortable with derived columns.

---

## Level 10 — Subqueries, CTEs & Window Functions

**Mental model:** _A subquery is a query inside a query. A CTE names it. A window function aggregates without collapsing rows._

*Master subqueries (scalar, correlated), Common Table Expressions, and window functions (RANK, ROW_NUMBER, running totals, PARTITION BY).*

**Pipeline sidebar — COMPLETE:** *Step 4½ (Window Functions) appears between HAVING and SELECT.*

| # | Problem | Concept | Type | Description |
|---|---------|---------|------|-------------|
| 1 | Above-Average Earners | Scalar subquery | Code | Employees earning above the company average |
| 2 | Most Expensive Product Buyer | Subquery in `WHERE` | Code | Customers who ordered the most expensive product |
| 3 | Customer Order Summary | `CTE` | Code | CTE to compute total spending per customer, then SELECT from it |
| 4 | Rank Products by Price | `RANK() OVER` | Code | Rank products from most to least expensive |
| 5 | Employee Salary Ranking | `RANK() OVER` | Code | Rank employees by salary (observe tied ranks) |
| 6 | Department Salary Leaderboard | `PARTITION BY` | Code | Rank employees by salary within each department |
| 7 | Order Row Numbers | `ROW_NUMBER()` | Code | Number each order chronologically (no ties) |
| 8 | Running Revenue | `SUM() OVER` | Code | Cumulative revenue running total ordered by date |
| 9 | Pipeline Check: CTE + Window | Execution order | 🔧 Pipeline | Arrange steps for a CTE + JOIN + window function query |
| 10 | Top Customers by Spending | `CTE` + `RANK()` | Code | CTE for total spending, then rank customers — the capstone |
| 11 | Rank vs Dense Rank | `RANK` vs `DENSE_RANK` | Code | Apply both to employee salaries — explain the difference in output |
| 12 | Pipeline Check: Design Your Own | Execution order | 🔧 Pipeline | Write a query using 5+ pipeline steps, then map its execution order |

> **Problem 10 is the capstone of the entire curriculum.** It requires a CTE (Level 10), aggregation (Level 4), a window function (Level 10), and sorting (Level 3) — four levels of thinking in one query. If a learner can write this independently, they are job-ready for any junior analyst role.

> **Problem 12 is the final problem of badcode.** It flips the model: instead of tracing someone else's query, the learner designs their own query pipeline-first. This is how working analysts think.

---

## "Arrange the Pipeline" Problems — Full Spec

These are non-coding problems where the learner **drags execution steps into the correct order** for a given query. They reinforce the mental model actively.

### Pipeline Problem 1 — Level 4, Problem 10

**Title:** Pipeline Check: Aggregates

**Query shown:**
```sql
SELECT category, AVG(price) AS avg_price
FROM Products
WHERE stock > 0
GROUP BY category
HAVING AVG(price) > 100
ORDER BY avg_price DESC
LIMIT 3
```

**Task:** Arrange these steps in the order SQL executes them:

| Scrambled steps (drag to reorder) |
|-----------------------------------|
| `LIMIT 3` |
| `SELECT category, AVG(price)` |
| `GROUP BY category` |
| `ORDER BY avg_price DESC` |
| `HAVING AVG(price) > 100` |
| `FROM Products` |
| `WHERE stock > 0` |

**Correct answer:**
1. `FROM Products`
2. `WHERE stock > 0`
3. `GROUP BY category`
4. `HAVING AVG(price) > 100`
5. `SELECT category, AVG(price)`
6. `ORDER BY avg_price DESC`
7. `LIMIT 3`

**Debrief:**
> "WHERE filters _rows_ (stock > 0) before grouping. HAVING filters _groups_ (avg_price > 100) after grouping. ORDER BY uses the alias `avg_price` — it works because SELECT already created it."

---

### Pipeline Problem 2 — Level 5, Problem 10

**Title:** Pipeline Check: JOIN + Agg

**Query shown:**
```sql
SELECT c.first_name, COUNT(o.id) AS order_count
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customer_id
WHERE o.status <> 'Cancelled'
GROUP BY c.first_name
HAVING COUNT(o.id) >= 2
ORDER BY order_count DESC
```

**Task:** Arrange these steps in the order SQL executes them:

| Scrambled steps (drag to reorder) |
|-----------------------------------|
| `SELECT c.first_name, COUNT(o.id)` |
| `FROM Customers c LEFT JOIN Orders o` |
| `GROUP BY c.first_name` |
| `HAVING COUNT(o.id) >= 2` |
| `ORDER BY order_count DESC` |
| `WHERE o.status <> 'Cancelled'` |

**Correct answer:**
1. `FROM Customers c LEFT JOIN Orders o`
2. `WHERE o.status <> 'Cancelled'`
3. `GROUP BY c.first_name`
4. `HAVING COUNT(o.id) >= 2`
5. `SELECT c.first_name, COUNT(o.id)`
6. `ORDER BY order_count DESC`

**Debrief:**
> "JOIN is part of FROM — it builds one combined table first. Here's the trap: WHERE on the LEFT JOIN result filters OUT the NULL rows LEFT JOIN created for customers with no orders."

**Bonus bug hunt:**
> "This query has a subtle bug. A customer with ONLY cancelled orders is excluded entirely — even though LEFT JOIN was supposed to preserve them. Fix: move `o.status <> 'Cancelled'` from WHERE to the ON clause."

---

### Pipeline Problem 3 — Level 10, Problem 9

**Title:** Pipeline Check: CTE + Window

**Query shown:**
```sql
WITH customer_spending AS (
    SELECT customer_id, SUM(amount) AS total_spent
    FROM Orders
    GROUP BY customer_id
)
SELECT c.first_name, cs.total_spent,
       RANK() OVER (ORDER BY cs.total_spent DESC) AS spending_rank
FROM Customers c
JOIN customer_spending cs ON c.id = cs.customer_id
WHERE cs.total_spent > 100
ORDER BY spending_rank
LIMIT 5
```

**Task:** Arrange these steps in the order SQL executes them:

| Scrambled steps (drag to reorder) |
|-----------------------------------|
| `SELECT c.first_name, cs.total_spent, RANK() OVER (...)` |
| `CTE: SUM(amount) GROUP BY customer_id` |
| `FROM Customers JOIN customer_spending` |
| `LIMIT 5` |
| `WHERE cs.total_spent > 100` |
| `RANK() window function evaluates` |
| `ORDER BY spending_rank` |

**Correct answer:**
1. `CTE: SUM(amount) GROUP BY customer_id` — _(runs first, becomes a virtual table)_
2. `FROM Customers JOIN customer_spending`
3. `WHERE cs.total_spent > 100`
4. `RANK() window function evaluates` — _(Step 4½: after filtering, before SELECT)_
5. `SELECT c.first_name, cs.total_spent, RANK() OVER (...)`
6. `ORDER BY spending_rank`
7. `LIMIT 5`

**Debrief:**
> "The CTE runs its own mini-pipeline first. RANK() runs at Step 4½ — after WHERE filtered out customers below 100, but before SELECT. That's why `spending_rank` starts at 1 even though some customers were excluded."

---

### Pipeline Problem 4 — Level 10, Problem 12

**Title:** Pipeline Check: Design Your Own

**No query shown. Learner writes from scratch.**

**Task:** "Write a query that uses at least 5 of the 8 pipeline steps. Then, on a separate tab, list the execution order of your query step-by-step."

**Why this is the final problem:** It flips the model. Instead of reading execution order from a given query, the learner must _design_ a query with the pipeline in mind. This is how working analysts think — pipeline-first, syntax second.

---

## Pipeline Reveal Map — What the learner sees at each level

### Level 1

```
┌──────────────────────────┐
│  ①  FROM         ● NEW   │
│  ②  SELECT       ● NEW   │
└──────────────────────────┘
```

### Level 2

```
┌──────────────────────────┐
│  ①  FROM                 │
│  ②  WHERE        ● NEW   │
│  ③  SELECT               │
└──────────────────────────┘
```

### Level 3

```
┌──────────────────────────┐
│  ①  FROM                 │
│  ②  WHERE                │
│  ③  SELECT               │
│  ④  DISTINCT     ● NEW   │
│  ⑤  ORDER BY     ● NEW   │
│  ⑥  LIMIT/OFFSET ● NEW   │
└──────────────────────────┘
```

### Level 4

```
┌──────────────────────────┐
│  ①  FROM                 │
│  ②  WHERE                │
│  ③  GROUP BY     ● NEW   │
│  ④  HAVING       ● NEW   │
│  ⑤  SELECT               │
│  ⑥  DISTINCT             │
│  ⑦  ORDER BY             │
│  ⑧  LIMIT/OFFSET         │
└──────────────────────────┘
```

### Level 5

```
┌──────────────────────────────┐
│  ①  FROM / JOIN      ● UPD   │
│  ②  WHERE                    │
│  ③  GROUP BY                 │
│  ④  HAVING                   │
│  ⑤  SELECT                   │
│  ⑥  DISTINCT                 │
│  ⑦  ORDER BY                 │
│  ⑧  LIMIT/OFFSET             │
└──────────────────────────────┘
```

### Level 6

```
┌──────────────────────────────────────┐
│  ①  FROM / JOIN                      │
│  ②  WHERE          ⚠ NULL trap       │
│  ③  GROUP BY       ⚠ NULL trap       │
│  ④  HAVING                           │
│  ⑤  SELECT         ⚠ NULL trap       │
│  ⑥  DISTINCT                         │
│  ⑦  ORDER BY       ⚠ NULL trap       │
│  ⑧  LIMIT/OFFSET                     │
└──────────────────────────────────────┘
```

### Level 7

```
┌──────────────────────────────────────────┐
│  INSERT  →  Adds rows directly           │
│  UPDATE  →  WHERE filters → modify rows  │
│  DELETE  →  WHERE filters → remove rows  │
└──────────────────────────────────────────┘
```

### Level 8

```
┌──────────────────────────────────────────────────┐
│  ①  FROM / JOIN                                  │
│  ②  WHERE          ← functions work here         │
│  ③  GROUP BY                                     │
│  ④  HAVING                                       │
│  ⑤  SELECT         ← functions work here too     │
│  ⑥  DISTINCT                                     │
│  ⑦  ORDER BY       ← and here                    │
│  ⑧  LIMIT/OFFSET                                 │
└──────────────────────────────────────────────────┘
```

### Level 9

```
┌──────────────────────────────────────────────────────┐
│  ①  FROM / JOIN                                      │
│  ②  WHERE                                            │
│  ③  GROUP BY                                         │
│  ④  HAVING                                           │
│  ⑤  SELECT         ← CASE WHEN lives here    ● UPD  │
│  ⑥  DISTINCT                                         │
│  ⑦  ORDER BY                                         │
│  ⑧  LIMIT/OFFSET                                     │
│                                                      │
│  UNION: runs the full pipeline twice,        ● NEW   │
│         then stacks the results                      │
└──────────────────────────────────────────────────────┘
```

### Level 10

```
┌──────────────────────────────────────────────────────────────┐
│  ①  FROM / JOIN                                              │
│  ②  WHERE              ← subqueries can run here             │
│  ③  GROUP BY                                                 │
│  ④  HAVING             ← subqueries can run here too         │
│  ④½ WINDOW FUNCTIONS   ← runs AFTER grouping, BEFORE SELECT │
│  ⑤  SELECT             ← CTE is just a named Step ①         │
│  ⑥  DISTINCT                                                 │
│  ⑦  ORDER BY                                                 │
│  ⑧  LIMIT/OFFSET                                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Concept Progression

```
L1   SELECT · DISTINCT · AS · ||
  ↓
L2   WHERE · = · > · < · <> · AND · OR · LIKE · IS NULL · IS NOT NULL
  ↓
L3   ORDER BY · LIMIT · IN · BETWEEN · NOT IN · OFFSET
  ↓
L4   COUNT · SUM · AVG · MIN · MAX · GROUP BY · HAVING · COUNT(*) vs COUNT(col) · 🔧 Pipeline
  ↓
L5   INNER JOIN · LEFT JOIN · Multi-table JOIN · Self JOIN · JOIN + WHERE · JOIN + GROUP BY · 🔧 Pipeline
  ↓
L6   COALESCE · IFNULL · NULL propagation · Multi-column NULL checks
  ↓
L7   INSERT · UPDATE · DELETE · Conditional UPDATE · DELETE with subquery
  ↓
L8   SUBSTR · INSTR · UPPER · LOWER · LENGTH · REPLACE · CAST · julianday
  ↓
L9   CASE WHEN · UNION · UNION ALL · CASE + GROUP BY · CASE + SUM
  ↓
L10  Subquery · CTE · RANK · DENSE_RANK · ROW_NUMBER · PARTITION BY · SUM OVER · 🔧 Pipeline × 2
```

---

## Problem Counts

| Level | Topic | Code | 🔧 Pipeline | Total |
|-------|-------|------|-------------|-------|
| L1 | SELECT Basics | 8 | — | **8** |
| L2 | WHERE Filtering | 11 | — | **11** |
| L3 | Sorting & Pagination | 8 | — | **8** |
| L4 | Aggregates | 9 | 1 | **10** |
| L5 | JOINs | 9 | 1 | **10** |
| L6 | NULL Handling | 5 | — | **5** |
| L7 | DML | 7 | — | **7** |
| L8 | String & Date Functions | 10 | — | **10** |
| L9 | CASE WHEN & UNION | 6 | — | **6** |
| L10 | Subqueries/CTEs/Windows | 10 | 2 | **12** |
| | **TOTAL** | **83** | **4** | **87** |

---

## Implementation Spec — Pipeline Sidebar Widget

For the badcode app (Vanilla JS, no frameworks):

### Data structure

```javascript
const PIPELINE_STEPS = [
  { id: 'from',     label: 'FROM / JOIN',     step: 1 },
  { id: 'where',    label: 'WHERE',           step: 2 },
  { id: 'group',    label: 'GROUP BY',        step: 3 },
  { id: 'having',   label: 'HAVING',          step: 4 },
  { id: 'window',   label: 'WINDOW FUNCTIONS', step: 4.5 },
  { id: 'select',   label: 'SELECT',          step: 5 },
  { id: 'distinct', label: 'DISTINCT',        step: 6 },
  { id: 'order',    label: 'ORDER BY',        step: 7 },
  { id: 'limit',    label: 'LIMIT / OFFSET',  step: 8 },
];

const PIPELINE_VISIBILITY = {
  1:  ['from', 'select'],
  2:  ['from', 'where', 'select'],
  3:  ['from', 'where', 'select', 'distinct', 'order', 'limit'],
  4:  ['from', 'where', 'group', 'having', 'select', 'distinct', 'order', 'limit'],
  5:  ['from', 'where', 'group', 'having', 'select', 'distinct', 'order', 'limit'],
  6:  ['from', 'where', 'group', 'having', 'select', 'distinct', 'order', 'limit'],
  7:  ['from', 'where', 'group', 'having', 'select', 'distinct', 'order', 'limit'],
  8:  ['from', 'where', 'group', 'having', 'select', 'distinct', 'order', 'limit'],
  9:  ['from', 'where', 'group', 'having', 'select', 'distinct', 'order', 'limit'],
  10: ['from', 'where', 'group', 'having', 'window', 'select', 'distinct', 'order', 'limit'],
};

const PIPELINE_HIGHLIGHTS = {
  1:  ['from', 'select'],
  2:  ['where'],
  3:  ['distinct', 'order', 'limit'],
  4:  ['group', 'having'],
  5:  ['from'],  // FROM gets updated to "FROM / JOIN"
  6:  [],        // No new steps — NULL warning icons appear on all steps
  7:  [],        // DML has its own mini-pipeline
  8:  [],        // Functions work within existing steps
  9:  ['select'], // CASE WHEN clarified as part of SELECT
  10: ['window'], // Window functions get their own step
};
```

### Visual states per step

```css
.pipeline-step          { opacity: 0; }
.pipeline-step.visible  { opacity: 1; }
.pipeline-step.new      { animation: pulse 1.5s; color: var(--accent); }
.pipeline-step.active   { background: var(--highlight); }
.pipeline-step.warning  { border-left: 3px solid var(--warning); }
```

### Drag-and-drop for pipeline problems

```javascript
const pipelineProblem = {
  type: 'arrange_pipeline',
  query: `SELECT category, AVG(price) ...`,
  scrambled: ['LIMIT 3', 'SELECT ...', 'GROUP BY ...', ...],
  correct: ['FROM Products', 'WHERE stock > 0', 'GROUP BY category', ...],
  debrief: 'Notice: WHERE filters rows before grouping...',
};
```

---

## Difficulty Curve

```
        Difficulty
        ▲
   L10  │                                          ●●●●●●●●●●●●
   L9   │                                    ●●●●●●
   L8   │                              ●●●●●●●●●●
   L7   │                        ●●●●●●●
   L6   │                   ●●●●●
   L5   │              ●●●●●●●●●●
   L4   │         ●●●●●●●●●●
   L3   │     ●●●●●●●●
   L2   │  ●●●●●●●●●●●
   L1   │●●●●●●●●
        └──────────────────────────────────────────────────────→ Problems
```

---

## What Changed from v2 → v3

| Change | Rationale |
|--------|-----------|
| **Added Execution Pipeline system** | Explains _why_ SQL works the way it does, not just _what_ to type |
| **Progressive reveal per level** | Learners build the pipeline incrementally — no overload on day one |
| **4 "Arrange the Pipeline" problems** | Active recall > passive reading. Placed at L4, L5, and L10 |
| **Pipeline Problem 2 includes a bug hunt** | LEFT JOIN + WHERE trap taught as a pipeline consequence |
| **Pipeline Problem 4 is open-ended** | Final problem — learner designs their own query pipeline-first |
| **Problem tables include Type column** | Code vs 🔧 Pipeline clearly distinguished |
| **Problem titles synced with narratives** | Every title matches curriculum_stories_v3.md exactly |
| **Implementation spec included** | Vanilla JS data structures, CSS states, drag-drop approach |
| **Problem count verified: 87** | 83 code + 4 pipeline = 87, counted per-table and cross-checked |

---

*87 problems across 10 levels — badcode curriculum v3*
*Now learners don't just write SQL. They understand the machine underneath it.*
