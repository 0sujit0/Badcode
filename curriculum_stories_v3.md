# badcode — Curriculum Narratives v3

> Every problem tells a story. Here's the full narrative your learners experience.
>
> 10 levels · 87 problems · Aligned with curriculum v3

---

## Level 1 — SELECT Basics

*Pipeline sidebar shows:* `FROM → SELECT`

### 1.1 · Customer Directory
Welcome to ShopKart. You've just been hired as a data analyst, and your first task is simple: get familiar with the data. Retrieve **all columns** from the `Customers` table.

> 💡 *Notice the pipeline sidebar? SQL starts at FROM — it needs to know which table to look at before it can show you anything. You write SELECT first, but the database reads FROM first.*

### 1.2 · Product Catalog
The warehouse manager just pinged you: "Can you pull everything we have in the system?" Retrieve **all columns** from the `Products` table.

### 1.3 · Customer Contact List
Marketing doesn't need the full customer record — just names. Return only `first_name` and `last_name` from `Customers`. This is your first time choosing _specific_ columns instead of using `*`.

### 1.4 · Employee Overview
Management wants a quick staff snapshot. Return `first_name`, `last_name`, and `department` from the `Employees` table.

### 1.5 · Unique Categories
The head of merchandising asks: "How many product categories do we actually carry?" Use `DISTINCT` to retrieve each category **only once** from the `Products` table.

### 1.6 · Unique Departments
HR wants a clean list of departments that exist in the company. Use `DISTINCT` on the `Employees` table to list every department — no repeats.

### 1.7 · Friendly Column Names
You're building a stakeholder report, and the column names look too technical. Select `first_name`, `last_name`, and `email` from `Customers` and alias them as `first`, `last`, and `contact`. Use the `AS` keyword.

### 1.8 · Full Name Column
The customer-facing team wants a single **full_name** column — not two separate columns. Concatenate `first_name` and `last_name` with a space between them using the `||` operator.

---

## Level 2 — Filtering with WHERE

*Pipeline sidebar shows:* `FROM → WHERE (NEW) → SELECT`

### 2.1 · Processing Orders
The logistics team is triaging today's workload. They need all orders that are still **Processing**. Filter the `Orders` table where `status` equals 'Processing'.

> 💡 *Look at the pipeline — WHERE just appeared between FROM and SELECT. The database filters rows BEFORE it picks columns. That's why WHERE can see every column in the table, even ones you didn't SELECT.*

### 2.2 · Electronics Inventory
The electronics buyer wants to audit their section. Find all products in the **Electronics** category.

### 2.3 · High Value Orders
Finance flagged a threshold: any order above ₹500 needs a second review. Find all orders where `amount` is **greater than 500**.

### 2.4 · Low Stock Alert
The stock manager's dashboard just lit up red. Find all products where `stock` is **less than 30** so we can trigger reorders.

### 2.5 · Active Orders
Operations wants everything that's still in motion. Find all orders that have **NOT** been 'Delivered'. Use the `<>` operator.

### 2.6 · Pricey Electronics
The sales team wants to build a "Premium Electronics" campaign page. Find all products in the **Electronics** category with a `price` **greater than 50**. You'll need `AND` to combine both conditions.

### 2.7 · Shipments in Motion
The shipping partner wants a status update. Find all orders with status **'Shipped'** OR **'Cancelled'** — they handle both outbound and return logistics.

### 2.8 · Keyboard Products
A corporate buyer just called: "Show me everything keyboard-related." Use `LIKE` to find every product whose `name` contains **'Key'**.

### 2.9 · Bulk Non-Electronics
The wholesale team focuses on high-volume, non-tech products. Find all products that are **NOT** in the Electronics category **AND** have `stock` greater than **100**.

### 2.10 · Ghost Emails
You're about to send a mass email campaign, and someone warns you: "Not every customer has an email on file." Find all customers whose `email` is **NULL**.

> ⚠️ *Try writing `WHERE email = NULL` first. It returns zero rows. That's not a bug — NULL isn't a value you can compare with `=`. NULL means "unknown." Use `IS NULL` instead. This is one of the most important lessons in SQL.*

### 2.11 · Verified Contacts
Now find the opposite — all customers who **DO** have an email. Use `IS NOT NULL`. These are the ones safe to include in the campaign.

---

## Level 3 — Sorting & Pagination

*Pipeline sidebar shows:* `FROM → WHERE → SELECT → DISTINCT (NEW) → ORDER BY (NEW) → LIMIT/OFFSET (NEW)`

### 3.1 · Newest Orders
The CEO's Monday morning question: "What's our latest activity?" Sort all orders by `order_date` in **descending** order — newest first.

> 💡 *ORDER BY just appeared at the bottom of the pipeline. It runs AFTER SELECT. That's why you CAN use column aliases in ORDER BY — the alias already exists by then. Try using an alias in WHERE sometime — it won't work, because WHERE runs before SELECT creates the alias.*

### 3.2 · Top Expensive Products
The premium product page needs content. Show the **Top 3** most expensive products — include only `name` and `price`. You'll need ORDER BY and LIMIT together.

### 3.3 · Selected Customers
A loyalty promotion targets our earliest customers. Find all orders placed by `customer_id` **1, 2, or 3**. Use the `IN` operator — it's cleaner than chaining three OR conditions.

### 3.4 · Mid Range Products
The "Sweet Spot" collection features products that aren't too cheap, aren't too expensive. Find products with a price **between 50 and 500**. `BETWEEN` is inclusive on both ends.

### 3.5 · Preview Orders
Quick sanity check before a meeting: pull just the **5 most recent** orders. Combine `ORDER BY` with `LIMIT`.

### 3.6 · Department Roster
HR wants a clean org chart export. Sort employees **alphabetically by department** (A→Z), then within each department by **salary highest first** (DESC). This is your first multi-column ORDER BY.

### 3.7 · Excluding Early Customers
For a "new customer" campaign, we need to exclude the original three. Return all orders where `customer_id` is **NOT IN (1, 2, 3)**.

### 3.8 · Page 2 of Products
Your product listing shows 3 items per page. The user clicked "Next." Retrieve the **second page** — that's products 4 through 6, ordered by `id`. Use `LIMIT 3 OFFSET 3`.

> 💡 *LIMIT runs dead last in the pipeline. That means the database processes ALL rows through every step, THEN cuts the window. It's not a performance shortcut — it's a display control.*

---

## Level 4 — Aggregate Functions

*Pipeline sidebar shows:* `FROM → WHERE → GROUP BY (NEW) → HAVING (NEW) → SELECT → DISTINCT → ORDER BY → LIMIT/OFFSET`

### 4.1 · Total Orders
The board meeting is tomorrow. First question they'll ask: "How many total orders have we received?" Use `COUNT(*)`.

> 💡 *Two new steps just appeared in your pipeline: GROUP BY and HAVING. They sit between WHERE and SELECT. This is the key to understanding why HAVING exists — it filters AFTER grouping, while WHERE filters BEFORE grouping.*

### 4.2 · Total Revenue
Next board question: "What's our total revenue?" Calculate the `SUM` of all order amounts.

### 4.3 · Average Product Price
The pricing team is benchmarking: "What's the average price across our entire catalog?" Use `AVG`.

### 4.4 · Price Extremes
One slide, two numbers: what's the **cheapest** and **most expensive** product? Return both using `MIN` and `MAX` in a single query.

### 4.5 · Orders Per Customer
Customer success wants to see engagement levels. Count how many orders **each customer** has placed. Show `customer_id` and the count. This is your first `GROUP BY`.

### 4.6 · Revenue by Product
Which products generate the most money? Show each `product_id` and its total revenue (`SUM(amount)`), sorted **highest first**. GROUP BY + SUM + ORDER BY in one query.

### 4.7 · Unique Products Sold
"How many distinct products have actually been ordered?" A product ordered five times should count once. Use `COUNT(DISTINCT product_id)`.

### 4.8 · High Value Customers
Find customers who have placed **more than 1 order**. You can't use WHERE here — you need to filter on the result of COUNT, which means filtering a _group_, not a _row_. That's what `HAVING` is for.

> 💡 *This is the moment the pipeline pays for itself. Look at the sidebar: WHERE is at Step 2 (filters rows). HAVING is at Step 4 (filters groups). They're NOT interchangeable — they run at different stages. If you tried `WHERE COUNT(*) > 1`, the database would reject it, because WHERE runs before GROUP BY even creates the groups.*

### 4.9 · The NULL Trap
Here's a sneaky one. Run two queries on the `Customers` table:
1. `SELECT COUNT(*) FROM Customers`
2. `SELECT COUNT(email) FROM Customers`

Do they return the same number? If not — **why?**

> 🎯 *`COUNT(*)` counts rows. `COUNT(email)` counts non-NULL values. If any customer has a NULL email, the numbers differ. This is the #1 source of wrong numbers in production dashboards. You'll never forget this after seeing it yourself.*

### 4.10 · 🔧 Pipeline Check: Aggregate Query
**This is not a coding problem.** You'll see a query and arrange its execution steps in the correct order. 

Given this query:
```sql
SELECT category, AVG(price) AS avg_price
FROM Products
WHERE stock > 0
GROUP BY category
HAVING AVG(price) > 100
ORDER BY avg_price DESC
LIMIT 3
```
Drag the steps into the order the database actually runs them.

---

## Level 5 — JOIN Operations

*Pipeline sidebar shows:* `FROM / JOIN (UPDATED) → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT/OFFSET`

### 5.1 · Customer Orders
So far you've only queried one table at a time. Real analysis connects tables. **JOIN** the `Customers` and `Orders` tables to show each order's `id` alongside the customer's `first_name`.

> 💡 *Look at the pipeline — FROM just became "FROM / JOIN". The JOIN happens as part of building the source table. By the time WHERE runs, the two tables are already merged into one. That's why WHERE can see columns from BOTH tables.*

### 5.2 · Order Product Names
Which product was in each order? JOIN `Orders` and `Products` to show order `id` and product `name`.

### 5.3 · Order Details Dashboard
The operations dashboard needs the full picture. Show `first_name` (from Customers), product `name` (from Products), and order `amount` — all in one query. This requires joining **three tables**: Customers → Orders → Products.

### 5.4 · Customer Purchase History
Build a clean purchase history: show `first_name` and product `name` for every order. Similar to the dashboard, but focused on the customer-to-product relationship.

### 5.5 · Potential Customers
This is the most important JOIN problem in the entire curriculum.

Some customers registered but never bought anything. Find them. Use a `LEFT JOIN` between Customers and Orders, then filter for rows where the order side is **NULL**.

> 🎯 *LEFT JOIN keeps ALL rows from the left table, even when there's no match on the right. Unmatched rows get NULLs in the right-side columns. Then `WHERE o.id IS NULL` catches exactly those "orphan" rows. This pattern — LEFT JOIN + IS NULL — is how every analyst finds "what's missing." You'll use it hundreds of times in your career.*

### 5.6 · Delivered Order Report
Finance needs a report. Show all **Delivered** orders with the customer's `first_name`, `last_name`, `amount`, and `order_date`. JOIN `Orders` and `Customers`, filter with WHERE, sort by date.

### 5.7 · Revenue by Category
Which product category drives the most revenue? JOIN `Orders` and `Products`, then GROUP BY `category`. Show the order count and total revenue per category, sorted by revenue descending.

### 5.8 · Premium Deliveries
The full three-table JOIN under pressure. Show all **Delivered** orders with customer name (first + last) and product name, sorted by `amount` descending, then by `order_id` ascending as a tiebreaker.

### 5.9 · Department Colleagues
Here's something new: joining a table **to itself**. Find all pairs of employees who work in the **same department**. You'll alias the Employees table twice (e.g., `e1` and `e2`) and join them on `department`. Make sure you don't pair someone with themselves.

> 💡 *A self-join is still just a JOIN — the pipeline doesn't change. You're creating two copies of the same table and matching them. It's the same Step 1 in the pipeline.*

### 5.10 · 🔧 Pipeline Check: JOIN + Aggregation
**Not a coding problem.** Arrange the execution order for this query:
```sql
SELECT c.first_name, COUNT(o.id) AS order_count
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customer_id
WHERE o.status <> 'Cancelled'
GROUP BY c.first_name
HAVING COUNT(o.id) >= 2
ORDER BY order_count DESC
```
After solving, you'll discover a subtle bug in this query — and learn why it matters.

---

## Level 6 — NULL Handling & COALESCE

*Pipeline sidebar shows:* ⚠️ *NULL warning icons appear on WHERE, GROUP BY, SELECT, and ORDER BY — NULL affects every step.*

### 6.1 · Default Email
Remember those customers with missing emails from Level 2? Now we handle them properly. Show each customer's `first_name` and `email`, but replace NULL emails with `'no_email@placeholder.com'`. Use `COALESCE`.

> 💡 *COALESCE takes a list of values and returns the first non-NULL one. Think of it as: "Give me this value. If it's NULL, give me this fallback instead."*

### 6.2 · Safe Stock Count
Some products have NULL stock values (we don't know the count yet). Show every product's `name` and `stock`, but default NULL stock to `0`. Use `COALESCE(stock, 0)`.

### 6.3 · NULL Arithmetic
Try this: `SELECT name, stock + 10 AS boosted_stock FROM Products`. Look at the rows where stock was NULL. What happened?

> ⚠️ *NULL + 10 = NULL. NULL propagates through any arithmetic. It doesn't become 10 — it stays unknown. That's why you need COALESCE BEFORE doing math on nullable columns, not after.*

### 6.4 · Full Contact Card
Build a formatted contact string: `"FirstName LastName <email>"`. But some emails are NULL, and you don't want the output to say `"Rahul Sharma <>"` — you want `"Rahul Sharma <no email>"`. Combine `||` concatenation with `COALESCE` to handle this gracefully.

### 6.5 · Complete Records Only
The data quality team wants to know: which products have **both** `price` and `stock` filled in? Find all products where neither column is NULL. Use `IS NOT NULL` on both columns with `AND`.

---

## Level 7 — Data Manipulation (DML)

*Pipeline sidebar shows:* *DML has its own mini-pipeline. INSERT adds rows directly. UPDATE and DELETE borrow WHERE from the SELECT pipeline.*

### 7.1 · Add a New Customer
A new customer just signed up. Insert **Rahul Sharma** with email `r.sharma@example.com` and registration date `2023-10-25` into the `Customers` table.

> 💡 *INSERT doesn't use the SELECT pipeline at all. It's a direct write operation. No FROM, no WHERE — you're just adding a row.*

### 7.2 · New Product Arrival
New inventory! Insert a `Gaming Headset` in the `Electronics` category, priced at `99.99` with `40` units in stock.

### 7.3 · Restock Inventory
A shipment of Laptops arrived. Update the `stock` of the product named **'Laptop'** to `50`. Your WHERE clause targets a specific product.

### 7.4 · Correct Order Amount
Order 102 had a coupon that wasn't applied at checkout. Update its `amount` to `40.00`. Your WHERE targets a specific order by `id`.

### 7.5 · Price Hike
The supplier raised costs. Increase the price by **10%** for all products in the **Electronics** category. This is a conditional UPDATE — the WHERE clause targets a _set_ of rows, not just one.

> 💡 *This is where DML meets set-based thinking. UPDATE doesn't loop through rows one by one — it applies the change to every row that matches the WHERE condition simultaneously. Think of it like WHERE in a SELECT query, but instead of viewing the matches, you modify them.*

### 7.6 · Remove Cancelled Orders
Time to clean house. Delete all orders with a `status` of **'Cancelled'**.

### 7.7 · Selective Cleanup
A product was pulled from the catalog, but its orders are still in the system. Delete all orders whose `product_id` doesn't exist in the `Products` table. You'll need a **subquery** inside your DELETE — this previews Level 10.

> ⚠️ *Think before you delete. Run the WHERE condition as a SELECT first to see what would be affected. There's no undo button in SQL.*

---

## Level 8 — String & Date Functions

*Pipeline sidebar shows:* *Functions work WITHIN existing pipeline steps — they can appear in WHERE, SELECT, or ORDER BY.*

### 8.1 · Email Prefix
The support team uses the first 4 characters of each email as a quick identifier. Extract the first 4 characters of every customer's `email` using `SUBSTR`.

### 8.2 · Find the @ Symbol
Before we can split emails into usernames and domains, we need to know where the `@` sits. Use `INSTR` to find the character position of `@` in each customer's email.

### 8.3 · Email Username
Now split it. Extract the text **before** the `@` symbol — this is the username portion of each email. Combine `SUBSTR` with `INSTR`.

### 8.4 · Customer Email Domain
Extract the text **after** the `@` — this is the domain (like `gmail.com` or `example.com`). You'll use `SUBSTR` and `INSTR` again, but the math is slightly different.

### 8.5 · Uppercase Roster
HR is printing name badges. Each badge shows the last name in **ALL CAPS** and first name in **all lowercase**. Use `UPPER` on `last_name` and `LOWER` on `first_name`. Alias them as `upper_last` and `lower_first`.

### 8.6 · Name Length Ranking
Which employee has the longest full name? Concatenate `first_name` and `last_name` with a space, compute its `LENGTH`, and sort **longest first**. Break ties alphabetically by the full name.

### 8.7 · Safe Email Display
To prevent email harvesting bots, replace the `@` symbol in every customer's email with ` [at] ` (with spaces on both sides). Show `first_name` and the modified email as `safe_email`. Use `REPLACE`.

### 8.8 · Integer Price Tags
The quick-view price display rounds down to whole numbers. Use `CAST(price AS INTEGER)` to truncate each product's price. Show `name`, `price`, and the truncated value as `price_int`. Order by price descending.

### 8.9 · Days Since Registration
The marketing team wants to segment customers by how long they've been with us. Calculate the number of days between each customer's `registration_date` and the current date using `julianday('now') - julianday(registration_date)`. Round to whole numbers.

### 8.10 · Tenure in Years
Convert employee tenure from days to **whole years**. Use `julianday('now') - julianday(hire_date)`, divide by 365.25 (to account for leap years), and `CAST` the result to INTEGER. Show `first_name`, `last_name`, and `tenure_years`.

> 🎯 *This problem combines three concepts: date math, arithmetic, and CAST. It's deliberately harder than anything else in this level — the kind of compound thinking that real SQL work demands. If you can write this in one query, you're ready for Level 9.*

---

## Level 9 — CASE WHEN & UNION

*Pipeline sidebar shows:* `SELECT` step now highlights — *CASE WHEN lives inside SELECT. UNION runs the full pipeline twice, then stacks.*

### 9.1 · Price Tiers
The e-commerce team wants to tag every product. Categorise them into three tiers:
- **'Budget'** — price under 50
- **'Mid-range'** — price 50 to 500
- **'Premium'** — price over 500

Show `name`, `price`, and a new column `price_tier` using `CASE WHEN`.

> 💡 *CASE WHEN is part of SELECT — it creates a new derived column. Look at the pipeline sidebar: it runs at Step 5. The value of the tier depends on the data in each row, computed one row at a time.*

### 9.2 · Order Status Labels
The customer-facing app needs friendlier status names. Map each order status to a human-readable label:
- Processing → `'In Progress'`
- Shipped → `'On Its Way'`
- Delivered → `'Completed'`
- Cancelled → `'Cancelled'`

Show `id`, `status`, and `display_status` using `CASE WHEN`.

### 9.3 · Salary Bands
The HR director wants a headcount summary by compensation tier. Define:
- **'Junior'** — salary under 50000
- **'Mid'** — salary 50000 to 80000
- **'Senior'** — salary over 80000

Use `CASE WHEN` inside a query with `GROUP BY` to count employees in each band.

### 9.4 · Company Directory
ShopKart is building an internal directory that includes **both** customers and employees. Use `UNION` to combine them into one list with two columns: `name` (first_name) and `type` (either 'Customer' or 'Employee'). Sort alphabetically by name.

> 💡 *UNION runs two separate pipelines and stacks the results. That's why both SELECTs must have the same number of columns — the database is gluing two grids together vertically.*

### 9.5 · All People, All Sources
Run the same Company Directory query, but use `UNION ALL` instead of `UNION`. Compare the results. If any person is both a customer and an employee (same first_name), they'll now appear **twice**.

> 🎯 *UNION removes duplicates (which costs processing time). UNION ALL keeps everything. In production, UNION ALL is almost always what you want unless you explicitly need deduplication.*

### 9.6 · Conditional Revenue Flag
Finance wants to split total revenue into two buckets. Use `CASE WHEN` **inside** a `SUM` to calculate:
- Total revenue from **'High'** orders (amount > 200)
- Total revenue from **'Low'** orders (amount <= 200)

Return both numbers as columns in a single row. This combines CASE WHEN with an aggregate function — a pattern you'll see constantly in business reporting.

---

## Level 10 — Subqueries, CTEs & Window Functions

*Pipeline sidebar shows: COMPLETE — including Step 4½ (Window Functions) between HAVING and SELECT.*

### 10.1 · Above-Average Earners
The CEO asks: "Who earns more than average?" Find all employees whose `salary` is **above the company-wide average**. Use a **subquery** inside your WHERE clause — the subquery calculates `AVG(salary)`, and the outer query filters against it.

> 💡 *A subquery is a query inside a query. This one sits inside WHERE, so it runs when WHERE runs (Step 2). The database computes the average first, then uses that number to filter rows.*

### 10.2 · Most Expensive Product Buyer
Which customers ordered the most expensive product in our catalog? Use a subquery to find `MAX(price)` from Products, then find orders matching that product, then get the customer names. You can nest this or break it into steps — either way, you're chaining queries.

### 10.3 · Customer Order Summary
Instead of nesting subqueries, let's name them. Write a **CTE** (Common Table Expression) that calculates total spending per `customer_id`, then SELECT from it to show `customer_id` and `total_spent`.

> 💡 *A CTE is declared with `WITH ... AS (...)` before the main query. Think of it as creating a temporary named table. In the pipeline, the CTE runs its own mini-pipeline first, then its result becomes available at Step 1 (FROM) of the main query.*

### 10.4 · Rank Products by Price
Rank all products from most expensive to cheapest. Show `name`, `price`, and `price_rank` using `RANK() OVER (ORDER BY price DESC)`.

> 💡 *The pipeline sidebar just revealed Step 4½ — window functions run AFTER grouping and filtering, but BEFORE SELECT finalises. That's why you can't use a window function result in WHERE — WHERE already ran by the time the window function executes.*

### 10.5 · Employee Salary Ranking
Rank all employees by `salary` descending. Show `first_name`, `salary`, and `salary_rank`. Notice what happens when two employees have the **same salary** — RANK will assign them the same rank and skip the next number.

### 10.6 · Department Salary Leaderboard
Now rank employees by salary, but **within their own department**. Use `RANK() OVER (PARTITION BY department ORDER BY salary DESC)`. This gives each department its own ranking — the #1 earner in Sales is ranked separately from the #1 earner in Engineering.

### 10.7 · Order Row Numbers
Number each order chronologically using `ROW_NUMBER() OVER (ORDER BY order_date)`. Unlike RANK, ROW_NUMBER **never ties** — even if two orders share a date, they get unique sequential numbers.

### 10.8 · Running Revenue
Calculate the **cumulative revenue** as it grows day by day. Use `SUM(amount) OVER (ORDER BY order_date)` to create a running total. Show `order_date`, `amount`, and `running_total`.

> 🎯 *This is one of the most practical window functions. Think of a bank statement: each row shows the transaction AND the balance-so-far. That's exactly what a running SUM does.*

### 10.9 · 🔧 Pipeline Check: CTE + Window Function
**Not a coding problem.** Arrange the execution order for this query:
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
This is the most complex pipeline you've seen. A CTE, a JOIN, a WHERE filter, a window function, and a LIMIT — all in one query.

### 10.10 · Top Customers by Spending
**The capstone problem.**

Find the top-spending customers, ranked. First, write a **CTE** that calculates total spending per customer. Then, in the main query, JOIN it with Customers to get names, apply `RANK()` to order by spending, and sort by rank.

This single query requires:
- A CTE (Level 10)
- An aggregate with GROUP BY (Level 4)
- A JOIN (Level 5)
- A window function (Level 10)
- ORDER BY (Level 3)

If you can write this independently, you have the SQL skills of a job-ready junior analyst.

### 10.11 · Rank vs Dense Rank
Apply **both** `RANK()` and `DENSE_RANK()` to employee salaries. Show `first_name`, `salary`, `rank`, and `dense_rank`. Observe the difference: when two employees tie, RANK skips the next number (1, 2, 2, 4) while DENSE_RANK doesn't (1, 2, 2, 3).

> 🎯 *This isn't just trivia — it determines whether your "Top 5" report actually returns 5 rows or 6. Knowing the difference matters in production.*

### 10.12 · 🔧 Pipeline Check: Design Your Own
**The final problem of badcode.**

No starter query. No hints. Write a query that uses **at least 5 of the 8 pipeline steps**. Then, in a separate tab, list the execution order of your query step by step.

> 🎯 *This flips everything. Instead of reading someone else's query and tracing its pipeline, you're designing a query with the pipeline in mind. This is how working analysts think — pipeline-first, syntax second. If you've made it here, you don't just write SQL. You understand the engine underneath it.*

---

## Narrative Design Principles

These principles guided every problem description in this file:

1. **Every problem has a business reason.** "The marketing team needs..." is always more motivating than "Write a SELECT statement." Learners should feel like they're solving a real request, not completing homework.

2. **Pipeline callouts (💡) appear at inflection points** — when a new pipeline step is introduced, or when a problem demonstrates why execution order matters. They're sparse by design. Too many and learners stop reading them.

3. **Warning icons (⚠️) mark traps.** NULL arithmetic, LEFT JOIN + WHERE interaction, DELETE without SELECT-first confirmation. These aren't mistakes to avoid — they're experiences to have. The narrative sets up the trap, then explains it.

4. **Target icons (🎯) mark career-relevant insights.** COUNT(*) vs COUNT(col), UNION vs UNION ALL, running totals — these are the patterns that separate an SQL student from an SQL practitioner.

5. **Problem titles are scannable.** A learner scrolling the level menu should know what each problem is about from the title alone: "Ghost Emails" → NULL filtering, "Price Hike" → conditional UPDATE, "Department Colleagues" → self JOIN.

6. **Tone stays human.** "Someone pinged you." "Finance needs a report." "Think before you delete." The narrator is a helpful colleague, not a textbook.

---

## Problem Index — Quick Reference

| # | Level | Problem | Type | Key Concept |
|---|-------|---------|------|-------------|
| 1.1 | L1 | Customer Directory | Code | SELECT * |
| 1.2 | L1 | Product Catalog | Code | SELECT * |
| 1.3 | L1 | Customer Contact List | Code | Column selection |
| 1.4 | L1 | Employee Overview | Code | Column selection |
| 1.5 | L1 | Unique Categories | Code | DISTINCT |
| 1.6 | L1 | Unique Departments | Code | DISTINCT |
| 1.7 | L1 | Friendly Column Names | Code | AS (alias) |
| 1.8 | L1 | Full Name Column | Code | \|\| (concat) |
| 2.1 | L2 | Processing Orders | Code | WHERE = |
| 2.2 | L2 | Electronics Inventory | Code | WHERE = |
| 2.3 | L2 | High Value Orders | Code | WHERE > |
| 2.4 | L2 | Low Stock Alert | Code | WHERE < |
| 2.5 | L2 | Active Orders | Code | WHERE <> |
| 2.6 | L2 | Pricey Electronics | Code | AND |
| 2.7 | L2 | Shipments in Motion | Code | OR |
| 2.8 | L2 | Keyboard Products | Code | LIKE |
| 2.9 | L2 | Bulk Non-Electronics | Code | AND + <> |
| 2.10 | L2 | Ghost Emails | Code | IS NULL |
| 2.11 | L2 | Verified Contacts | Code | IS NOT NULL |
| 3.1 | L3 | Newest Orders | Code | ORDER BY DESC |
| 3.2 | L3 | Top Expensive Products | Code | ORDER BY + LIMIT |
| 3.3 | L3 | Selected Customers | Code | IN |
| 3.4 | L3 | Mid Range Products | Code | BETWEEN |
| 3.5 | L3 | Preview Orders | Code | ORDER BY + LIMIT |
| 3.6 | L3 | Department Roster | Code | Multi-column ORDER BY |
| 3.7 | L3 | Excluding Early Customers | Code | NOT IN |
| 3.8 | L3 | Page 2 of Products | Code | LIMIT + OFFSET |
| 4.1 | L4 | Total Orders | Code | COUNT(*) |
| 4.2 | L4 | Total Revenue | Code | SUM |
| 4.3 | L4 | Average Product Price | Code | AVG |
| 4.4 | L4 | Price Extremes | Code | MIN / MAX |
| 4.5 | L4 | Orders Per Customer | Code | GROUP BY |
| 4.6 | L4 | Revenue by Product | Code | GROUP BY + SUM |
| 4.7 | L4 | Unique Products Sold | Code | COUNT(DISTINCT) |
| 4.8 | L4 | High Value Customers | Code | HAVING |
| 4.9 | L4 | The NULL Trap | Code | COUNT(*) vs COUNT(col) |
| 4.10 | L4 | Pipeline Check: Aggregates | 🔧 Pipeline | Execution order |
| 5.1 | L5 | Customer Orders | Code | INNER JOIN |
| 5.2 | L5 | Order Product Names | Code | INNER JOIN |
| 5.3 | L5 | Order Details Dashboard | Code | Multi-table JOIN |
| 5.4 | L5 | Customer Purchase History | Code | Multi-table JOIN |
| 5.5 | L5 | Potential Customers | Code | LEFT JOIN + IS NULL |
| 5.6 | L5 | Delivered Order Report | Code | JOIN + WHERE |
| 5.7 | L5 | Revenue by Category | Code | JOIN + GROUP BY |
| 5.8 | L5 | Premium Deliveries | Code | Multi-table JOIN |
| 5.9 | L5 | Department Colleagues | Code | Self JOIN |
| 5.10 | L5 | Pipeline Check: JOIN + Agg | 🔧 Pipeline | Execution order + bug hunt |
| 6.1 | L6 | Default Email | Code | COALESCE |
| 6.2 | L6 | Safe Stock Count | Code | COALESCE |
| 6.3 | L6 | NULL Arithmetic | Code | NULL propagation |
| 6.4 | L6 | Full Contact Card | Code | COALESCE + \|\| |
| 6.5 | L6 | Complete Records Only | Code | Multi-column IS NOT NULL |
| 7.1 | L7 | Add a New Customer | Code | INSERT |
| 7.2 | L7 | New Product Arrival | Code | INSERT |
| 7.3 | L7 | Restock Inventory | Code | UPDATE |
| 7.4 | L7 | Correct Order Amount | Code | UPDATE (specific row) |
| 7.5 | L7 | Price Hike | Code | UPDATE (conditional) |
| 7.6 | L7 | Remove Cancelled Orders | Code | DELETE |
| 7.7 | L7 | Selective Cleanup | Code | DELETE + subquery |
| 8.1 | L8 | Email Prefix | Code | SUBSTR |
| 8.2 | L8 | Find the @ Symbol | Code | INSTR |
| 8.3 | L8 | Email Username | Code | SUBSTR + INSTR |
| 8.4 | L8 | Customer Email Domain | Code | SUBSTR + INSTR |
| 8.5 | L8 | Uppercase Roster | Code | UPPER / LOWER |
| 8.6 | L8 | Name Length Ranking | Code | LENGTH + ORDER BY |
| 8.7 | L8 | Safe Email Display | Code | REPLACE |
| 8.8 | L8 | Integer Price Tags | Code | CAST |
| 8.9 | L8 | Days Since Registration | Code | julianday |
| 8.10 | L8 | Tenure in Years | Code | julianday + CAST |
| 9.1 | L9 | Price Tiers | Code | CASE WHEN |
| 9.2 | L9 | Order Status Labels | Code | CASE WHEN |
| 9.3 | L9 | Salary Bands | Code | CASE WHEN + GROUP BY |
| 9.4 | L9 | Company Directory | Code | UNION |
| 9.5 | L9 | All People, All Sources | Code | UNION ALL |
| 9.6 | L9 | Conditional Revenue Flag | Code | CASE WHEN + SUM |
| 10.1 | L10 | Above-Average Earners | Code | Scalar subquery |
| 10.2 | L10 | Most Expensive Product Buyer | Code | Subquery in WHERE |
| 10.3 | L10 | Customer Order Summary | Code | CTE |
| 10.4 | L10 | Rank Products by Price | Code | RANK() OVER |
| 10.5 | L10 | Employee Salary Ranking | Code | RANK() OVER |
| 10.6 | L10 | Department Salary Leaderboard | Code | PARTITION BY |
| 10.7 | L10 | Order Row Numbers | Code | ROW_NUMBER() |
| 10.8 | L10 | Running Revenue | Code | SUM() OVER |
| 10.9 | L10 | Pipeline Check: CTE + Window | 🔧 Pipeline | Full pipeline trace |
| 10.10 | L10 | Top Customers by Spending | Code | CTE + RANK (capstone) |
| 10.11 | L10 | Rank vs Dense Rank | Code | RANK vs DENSE_RANK |
| 10.12 | L10 | Pipeline Check: Design Your Own | 🔧 Pipeline | Open-ended capstone |

---

**Summary:** 83 coding problems + 4 pipeline problems = **87 problems total**

---

*87 problem narratives across 10 levels — badcode curriculum v3*
