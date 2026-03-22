# Badcode SQL Curriculum

**Version:** 1.0
**Total Levels:** 8
**Total Problems:** 57
**Difficulty Range:** Beginner → Advanced
**Domain:** Retail/e-commerce (ShopKart dataset)

---

## Overview

Badcode teaches SQL through a narrative-first approach. Every problem is framed as a real business request at a fictional company called **ShopKart** — an e-commerce retailer. Learners are never asked to "write a query"; they are asked to help a manager, answer a stakeholder's question, or clean the database. This framing grounds abstract syntax in practical outcomes.

The curriculum is structured into 8 sequential modules. Each module introduces a tightly scoped concept cluster, then immediately applies it in 5–9 progressively harder problems. Concepts are layered — skills from earlier modules are required to complete later ones, enforcing retention without explicit review drills.

---

## Dataset

All 57 problems run against the same four-table schema:

| Table | Key Columns | Purpose |
|---|---|---|
| `Customers` | id, first_name, last_name, email, registration_date | User accounts |
| `Products` | id, name, category, price, stock | Product catalog |
| `Orders` | id, customer_id, product_id, amount, status, order_date | Transaction ledger |
| `Employees` | id, first_name, last_name, department, salary | Internal staff |

Using a single, stable dataset across all 8 levels means learners build a mental model of the data itself. By Level 5, they can write JOIN queries without needing to re-read the schema — they already know what the tables contain.

---

## Levels at a Glance

| # | Module | Difficulty | Problems | Core Concepts |
|---|---|---|---|---|
| 1 | Foundations | Beginner | 8 | SELECT, DISTINCT, AS, concatenation |
| 2 | Querying Basics | Beginner | 9 | WHERE, AND, OR, LIKE, NOT |
| 3 | Filtering & Sorting | Beginner | 8 | ORDER BY, LIMIT, OFFSET, IN, BETWEEN, NOT IN |
| 4 | Aggregation | Intermediate | 8 | COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING, COUNT DISTINCT |
| 5 | Joins | Intermediate | 8 | INNER JOIN, LEFT JOIN, multi-table joins, join + filter, join + aggregate |
| 6 | Data Manipulation | Intermediate | 5 | INSERT, UPDATE, DELETE |
| 7 | Functions | Intermediate | 9 | SUBSTR, INSTR, LENGTH, UPPER, LOWER, CAST, REPLACE, julianday |
| 8 | Advanced SQL | Advanced | 9 | Window functions, CTEs, CASE WHEN, UNION, subqueries, ROW_NUMBER |

---

## Level 1 — Foundations
**Difficulty:** Beginner | **Problems:** 8 | **Concepts:** SELECT, DISTINCT, AS, `||` concatenation

The entry point. Every problem in this level is satisfied with a single-clause SELECT statement. The level is designed to build pattern confidence: learners run their first successful query within the first two minutes and repeat that success 7 more times with increasing nuance.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L1_P1 | Customer Directory | SELECT * | Retrieve all columns from Customers |
| L1_P2 | Product Catalog | SELECT * | Retrieve all columns from Products |
| L1_P3 | Customer Contact List | SELECT (specific cols) | Return only first_name and last_name |
| L1_P4 | Order Ledger | SELECT * | Retrieve all columns from Orders |
| L1_P5 | Employee Overview | SELECT (specific cols) | Return first_name, last_name, department |
| L1_P6 | Unique Categories | DISTINCT | Return each product category exactly once |
| L1_P7 | Friendly Column Names | AS | Alias columns for a stakeholder report |
| L1_P8 | Full Name Column | `\|\|` concatenation | Combine first_name + last_name into one column |

**Pedagogical notes:**
- Problems 1–5 use SELECT without any filter, building muscle memory for basic syntax before introducing complexity.
- DISTINCT (P6) is introduced immediately after basic SELECT to illustrate the concept of uniqueness in data — not as an add-on, but as a natural question ("how many categories do we have?").
- Concatenation (P8) is the first problem with no `requiredConcept` tag, signalling that learners are expected to synthesise two prior skills (column selection + the `||` operator) without a direct hint.

---

## Level 2 — Querying Basics
**Difficulty:** Beginner | **Problems:** 9 | **Concepts:** WHERE, AND, OR, LIKE, NOT

Filtering is the most frequent real-world SQL operation. This level builds fluency in the full WHERE clause toolkit — single conditions, compound conditions, partial string matches, and exclusion patterns.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L2_P1 | Processing Orders | WHERE | Find orders with status = 'Processing' |
| L2_P2 | Electronics Inventory | WHERE | Find products in the Electronics category |
| L2_P3 | High Value Orders | WHERE | Orders with amount > 500 |
| L2_P4 | Low Stock Alert | WHERE | Products with stock < 30 |
| L2_P5 | Active Orders | WHERE + NOT | Orders that have NOT been Delivered |
| L2_P6 | Pricey Electronics | AND | Electronics products with price > 500 |
| L2_P7 | Shipments in Motion | OR | Orders with status 'Shipped' OR 'Cancelled' |
| L2_P8 | Keyboard Products | LIKE | Products whose name contains 'Key' |
| L2_P9 | Bulk Non-Electronics | AND | Not Electronics AND stock > 100 |

**Pedagogical notes:**
- The level follows a single-condition → compound-condition → pattern-match progression.
- NOT is introduced as a modifier on WHERE (P5) before appearing in compound clauses, reducing cognitive load.
- P9 combines NOT with AND and a numeric comparison — the first problem requiring learners to hold three simultaneous logical conditions.

---

## Level 3 — Filtering & Sorting
**Difficulty:** Beginner | **Problems:** 8 | **Concepts:** ORDER BY, LIMIT, OFFSET, IN, NOT IN, BETWEEN

Control over result ordering and set membership. This level transitions learners from "which rows?" to "which rows, in which order, and how many?".

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L3_P1 | Newest Orders | ORDER BY DESC | Sort orders by date, newest first |
| L3_P2 | Top Expensive Products | LIMIT | Top 3 most expensive products |
| L3_P3 | Selected Customers | IN | Orders from customer_id 1, 2, or 3 |
| L3_P4 | Mid Range Products | BETWEEN | Products priced between $50 and $500 |
| L3_P5 | Preview Orders | LIMIT | 5 most recent orders |
| L3_P6 | Department Roster | ORDER BY (multi-col) | Sort by department ASC, then salary DESC |
| L3_P7 | Excluding Early Customers | NOT IN | Orders NOT from customer_id 1, 2, or 3 |
| L3_P8 | Page 2 of Products | LIMIT + OFFSET | Products 4–6 by id (pagination) |

**Pedagogical notes:**
- ORDER BY is taught before LIMIT deliberately — sorting without limiting first demonstrates what the full sorted set looks like.
- IN and NOT IN are paired across two consecutive problems (P3, P7) as natural complements. This mirrors the earlier WHERE / WHERE + NOT pairing in Level 2.
- P8 (pagination via LIMIT + OFFSET) is the first problem that combines two new clauses, previewing the multi-clause complexity of later levels.
- Multi-column ORDER BY (P6) introduces the concept of sort priority — a real-world pattern that single-column examples can't demonstrate.

---

## Level 4 — Aggregation
**Difficulty:** Intermediate | **Problems:** 8 | **Concepts:** COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING, COUNT(DISTINCT)

The first significant conceptual jump. Aggregation requires learners to shift from row-level thinking ("which rows?") to group-level thinking ("what is true about a set of rows?"). GROUP BY and HAVING introduce a new mental model: the concept of reducing data.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L4_P1 | Total Orders | COUNT | How many orders have been placed? |
| L4_P2 | Total Revenue | SUM | Sum of all order amounts |
| L4_P3 | Average Product Price | AVG | Average price across all products |
| L4_P4 | Orders Per Customer | GROUP BY | Count of orders per customer_id |
| L4_P5 | High Value Customers | HAVING | Customers with more than 1 order |
| L4_P6 | Price Extremes | MIN + MAX | Cheapest and most expensive product |
| L4_P7 | Unique Products Sold | COUNT(DISTINCT) | Count of distinct products ever ordered |
| L4_P8 | Revenue by Product | GROUP BY + ORDER BY | Total revenue per product, sorted |

**Pedagogical notes:**
- Aggregate functions (COUNT, SUM, AVG) are introduced first as whole-table operations (P1–P3), before GROUP BY is introduced. This means learners understand what an aggregate does before they apply it to groups.
- HAVING (P5) is taught immediately after GROUP BY (P4) — the pairing communicates that HAVING is the filtering mechanism for grouped data, just as WHERE is the filtering mechanism for rows.
- P8 combines GROUP BY with ORDER BY — the first problem requiring learners to apply a sequence of clauses in the correct order (SELECT → FROM → GROUP BY → ORDER BY).

---

## Level 5 — Joins
**Difficulty:** Intermediate | **Problems:** 8 | **Concepts:** INNER JOIN, LEFT JOIN, multi-table joins, join + filter, join + aggregate

The conceptually most challenging level. Joins require learners to understand relational keys and how multiple tables relate — a genuinely new mental model, not just additional syntax. The level scaffolds from the simplest two-table join to a three-table join with filtering and sorting.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L5_P1 | Customer Orders | INNER JOIN (2 tables) | Show order id + customer first_name |
| L5_P2 | Order Product Names | INNER JOIN (2 tables) | Show order id + product name |
| L5_P3 | Order Details Dashboard | JOIN (3 tables) | Show first_name, product name, amount |
| L5_P4 | Customer Purchase History | JOIN | Show what each customer has bought |
| L5_P5 | Potential Customers | LEFT JOIN | Customers who have never placed an order |
| L5_P6 | Delivered Order Report | JOIN + WHERE | Delivered orders with customer names |
| L5_P7 | Revenue by Category | JOIN + GROUP BY | Total revenue per product category |
| L5_P8 | Premium Deliveries | JOIN + WHERE + ORDER BY | Delivered orders sorted by amount |

**Pedagogical notes:**
- The first two problems (P1, P2) each join exactly two tables, but use different foreign key relationships (Orders→Customers, Orders→Products). This establishes the join pattern without introducing the three-table case prematurely.
- LEFT JOIN (P5) is deferred until after learners have mastered INNER JOIN. It is introduced through a business question ("find customers who have never ordered") that naturally motivates the need for a left join — making it conceptually memorable.
- P7 is the first problem that combines three separate SQL features: JOIN, GROUP BY, and ORDER BY. It is placed as the penultimate problem so learners have sufficient confidence before attempting the composition.

---

## Level 6 — Data Manipulation
**Difficulty:** Intermediate | **Problems:** 5 | **Concepts:** INSERT, UPDATE, DELETE

DML operations. This is the shortest level by design — the three DML verbs are conceptually simple once a learner understands SELECT, but the stakes of getting them wrong (mutating data) justify a focused, careful treatment.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L6_P1 | Add a New Customer | INSERT | Insert a new customer record |
| L6_P2 | New Product Arrival | INSERT | Insert a new product with all fields |
| L6_P3 | Restock Inventory | UPDATE | Update the stock of a specific product |
| L6_P4 | Correct Order Amount | UPDATE | Update a specific order's amount |
| L6_P5 | Remove Cancelled Orders | DELETE | Delete all orders with status 'Cancelled' |

**Pedagogical notes:**
- INSERT appears twice (P1, P2) to reinforce the column-value mapping pattern before moving to mutation operations.
- UPDATE is taught before DELETE because it is safer in intuition: modify something, not remove it.
- DELETE (P5) uses a WHERE clause that matches multiple rows — intentional, to demonstrate the power and responsibility of DELETE without a WHERE.
- This level notably does not include a `DELETE FROM table` without a WHERE clause — a deliberate omission to avoid teaching a dangerous pattern.

---

## Level 7 — Functions
**Difficulty:** Intermediate | **Problems:** 9 | **Concepts:** SUBSTR, INSTR, LENGTH, UPPER, LOWER, CAST, REPLACE, julianday

String and type manipulation. These are tools learners reach for when the data isn't in the right shape — a common real-world scenario. Problems are built around the ShopKart email field and employee names, making every function feel practically motivated.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L7_P1 | Email Prefix | SUBSTR | First 4 characters of each email |
| L7_P2 | Find the @ Symbol | INSTR | Character position of '@' in each email |
| L7_P3 | Email Username | SUBSTR + INSTR | Text before the '@' in each email |
| L7_P4 | Customer Tenure | julianday | Days since each customer registered |
| L7_P5 | Customer Email Domain | SUBSTR + INSTR | Email domain (after the '@') |
| L7_P6 | Uppercase Roster | UPPER + LOWER | Name badge with UPPER first, LOWER last |
| L7_P7 | Name Length Ranking | LENGTH + concatenation | Longest full name by character count |
| L7_P8 | Integer Price Tags | CAST | Truncate prices to whole numbers |
| L7_P9 | Safe Email Display | REPLACE | Replace '@' with '[at]' in all emails |

**Pedagogical notes:**
- SUBSTR and INSTR are taught in sequence across three problems (P1 → P2 → P3), where each builds on the previous. P3 requires composing SUBSTR and INSTR together — the first function composition problem in the curriculum.
- P5 mirrors P3 with SUBSTR but extracts the suffix rather than the prefix, training learners to adapt a known pattern to a new direction.
- julianday (P4) is SQLite-specific and is taught without pretending to be portable — a pragmatic choice given the in-browser SQLite engine.
- CAST (P8) introduces type awareness — the idea that SQL values have types and that types matter. This lays conceptual groundwork for Level 8's window functions.

---

## Level 8 — Advanced SQL
**Difficulty:** Advanced | **Problems:** 9 | **Concepts:** Window functions (OVER, RANK, ROW_NUMBER, SUM OVER), CTEs, CASE WHEN, UNION, subqueries

The capstone level. Every problem here requires composing multiple features simultaneously. The level introduces SQL patterns that appear in analytical and data engineering work: ranking, running totals, conditional logic, set operations, and correlated subqueries.

| ID | Title | Concept | Business Request |
|---|---|---|---|
| L8_P1 | Rank Products by Price | RANK() OVER | Rank products from most to least expensive |
| L8_P2 | Employee Salary Ranking | RANK() OVER | Rank employees by salary globally |
| L8_P3 | Department Salary Leaderboard | RANK() OVER PARTITION BY | Rank employees by salary within departments |
| L8_P4 | Top Customers by Spending | CTE + RANK | CTE for total spend → rank customers |
| L8_P5 | Running Revenue | SUM() OVER ORDER BY | Cumulative revenue day by day |
| L8_P6 | Order Row Numbers | ROW_NUMBER() OVER | Chronological row numbers on orders |
| L8_P7 | Price Tiers | CASE WHEN | Categorise products: Budget / Mid-range / Premium |
| L8_P8 | Company Directory | UNION | Combine Customers and Employees into one list |
| L8_P9 | Above-Average Earners | Subquery in WHERE | Employees earning above the company average |

**Pedagogical notes:**
- Window functions are introduced twice without PARTITION BY (P1, P2) before introducing PARTITION BY (P3). This isolates the windowing concept before the partitioning concept is layered on.
- CTEs (P4) are motivated by a problem that would require nesting a subquery inside an ORDER BY — a case where CTE readability wins clearly. The learner experiences the "why" before the "how".
- Running totals (P5) use SUM() OVER ORDER BY, which demonstrates that window functions can produce cumulative results — a distinct use case from ranking.
- CASE WHEN (P7) and UNION (P8) are near the end but are simpler in syntax than the window functions, providing a confidence reset before the final problem.
- The final problem (P9) uses a subquery in WHERE — deliberately closing the curriculum with a pattern that echoes the very first SELECT query, now composed inside a larger one. This demonstrates how far learners have come.

---

## Concept Coverage Map

| Concept | Level Introduced | Revisited In |
|---|---|---|
| SELECT | 1 | 2, 3, 4, 5, 6, 7, 8 |
| DISTINCT | 1 | 4 (COUNT DISTINCT) |
| AS (aliases) | 1 | 4, 5, 7, 8 |
| String concatenation (`\|\|`) | 1 | 7 |
| WHERE | 2 | 3, 5, 6, 8 |
| AND / OR | 2 | 3, 5 |
| LIKE | 2 | — |
| NOT / NOT IN | 2, 3 | — |
| ORDER BY | 3 | 4, 5, 7, 8 |
| LIMIT / OFFSET | 3 | 8 |
| IN / BETWEEN | 3 | — |
| COUNT / SUM / AVG / MIN / MAX | 4 | 5, 8 |
| GROUP BY | 4 | 5 |
| HAVING | 4 | — |
| INNER JOIN | 5 | 6, 7 |
| LEFT JOIN | 5 | — |
| INSERT / UPDATE / DELETE | 6 | — |
| String functions (SUBSTR, INSTR, etc.) | 7 | — |
| CAST | 7 | — |
| Date functions (julianday) | 7 | — |
| Window functions (RANK, SUM OVER) | 8 | — |
| ROW_NUMBER | 8 | — |
| CTEs | 8 | — |
| CASE WHEN | 8 | — |
| UNION | 8 | — |
| Subqueries | 8 | — |

---

## Pedagogical Principles

### 1. Narrative Motivation
Every problem is a business request. Learners are never asked to produce arbitrary output — they are always answering a question from a named stakeholder (the CEO, the marketing team, the warehouse manager). This reduces the "why does this matter?" friction that abstract exercises create.

### 2. Scaffolded Complexity
Each level introduces 1–3 new concepts, then applies them across 5–9 problems of increasing difficulty. The final 1–2 problems in every level require combining the new concept with skills from prior levels.

### 3. Single Domain Coherence
The ShopKart dataset is used from problem 1 to problem 57. Learners develop an intuition for the data (what tables exist, how they relate, what typical values look like) that pays dividends in later levels — particularly Joins (Level 5), where knowing the schema reduces cognitive load.

### 4. Progressive Hint System
Every problem has three hints, unlocked incrementally:
- **Hint 1:** Always visible — conceptual direction ("Use the SELECT keyword...")
- **Hint 2:** Unlocks on first attempt — structural guidance ("The asterisk * selects all columns")
- **Hint 3:** Unlocks on second attempt — near-complete worked example ("Try: SELECT * FROM Customers;")

This system encourages a "try first" habit rather than immediately reaching for help.

### 5. DML Taught Late, Briefly
INSERT, UPDATE, and DELETE are placed in Level 6 — after learners have a strong SELECT foundation. This ordering means learners can verify DML results by writing a SELECT query after each operation, turning DML into a verifiable skill rather than a blind write.

---

## Benchmarking Reference

### Scope Comparison

| Feature | Badcode | SQLZoo | Mode Analytics | Khan Academy SQL |
|---|---|---|---|---|
| Total problems | 57 | ~100+ | ~30 (tutorials) | ~10 |
| Window functions | Yes (Level 8) | Yes | Yes | No |
| CTEs | Yes (Level 8) | Partial | Yes | No |
| DML (INSERT/UPDATE/DELETE) | Yes (Level 6) | Yes | No | No |
| String functions | Yes (Level 7) | Partial | No | No |
| Narrative framing | Yes (every problem) | Minimal | Minimal | Yes |
| Single domain dataset | Yes | No (varies per module) | No | Yes |
| Progressive hints | Yes (3-tier) | No | No | Yes |
| In-browser SQL execution | Yes | Yes | No | Yes |

### Coverage Gaps (opportunities for future levels)

The following SQL concepts are commonly taught in intermediate SQL courses but are not yet covered in Badcode:

- **INTERSECT / EXCEPT** — set operations beyond UNION
- **Self-joins** — joining a table to itself (e.g., employee/manager hierarchies)
- **Correlated subqueries** (beyond the single example in L8_P9)
- **ROLLUP / CUBE** — advanced aggregation
- **Indexes and EXPLAIN** — query performance awareness
- **Transactions (BEGIN / COMMIT / ROLLBACK)** — data integrity
- **Views** — reusable query abstractions
- **Recursive CTEs** — hierarchical data queries
- **JSON functions** — increasingly common in modern SQL dialects
- **Date arithmetic** (beyond julianday in SQLite — DATEADD, DATE_TRUNC in PostgreSQL/BigQuery syntax)

These gaps represent natural candidates for Levels 9–12 in a future curriculum expansion.
