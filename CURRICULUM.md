# badcode — Full Curriculum

> 8 levels · 62 problems · From `SELECT *` to window functions

---

## Level 1 — SELECT Basics

*Learn to retrieve data from tables using SELECT, DISTINCT, aliases, and string concatenation.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Customer Directory | `SELECT` | Retrieve all columns from the Customers table |
| 2 | Product Catalog | `SELECT` | Retrieve all columns from the Products table |
| 3 | Customer Contact List | `SELECT` | Return only `first_name` and `last_name` from Customers |
| 4 | Order Ledger | `SELECT` | Retrieve all columns from the Orders table |
| 5 | Employee Overview | `SELECT` | Return `first_name`, `last_name`, and `department` from Employees |
| 6 | Unique Categories | `DISTINCT` | Retrieve each product category only once |
| 7 | Friendly Column Names | `AS` | Alias `first_name`, `last_name`, `email` as `first`, `last`, `contact` |
| 8 | Full Name Column | `\|\|` | Concatenate first and last name into a single `full_name` column |

---

## Level 2 — Filtering with WHERE

*Filter rows using WHERE, comparison operators, AND, OR, LIKE, and NOT.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Processing Orders | `WHERE` | Find orders with status 'Processing' |
| 2 | Electronics Inventory | `WHERE` | Find all Electronics products |
| 3 | High Value Orders | `WHERE` | Find orders where amount > 500 |
| 4 | Low Stock Alert | `WHERE` | Find products where stock < 30 |
| 5 | Active Orders | `WHERE` (`<>`) | Find orders NOT 'Delivered' |
| 6 | Pricey Electronics | `AND` | Electronics with price > 50 |
| 7 | Shipments in Motion | `OR` | Orders with status 'Shipped' OR 'Cancelled' |
| 8 | Keyboard Products | `LIKE` | Products whose name contains 'Key' |
| 9 | Bulk Non-Electronics | `AND` | Non-Electronics products with stock > 100 |

---

## Level 3 — Sorting & Pagination

*Order results, limit output, and use IN, BETWEEN, NOT IN, and OFFSET.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Newest Orders | `ORDER BY` | Sort orders by date descending |
| 2 | Top Expensive Products | `LIMIT` | Top 3 most expensive products (name, price) |
| 3 | Selected Customers | `IN` | Orders placed by customer_id 1, 2, or 3 |
| 4 | Mid Range Products | `BETWEEN` | Products with price between 50 and 500 |
| 5 | Preview Orders | `LIMIT` | 5 most recent orders |
| 6 | Department Roster | `ORDER BY` | Employees sorted by department ASC, salary DESC |
| 7 | Excluding Early Customers | `NOT IN` | Orders where customer_id NOT IN (1, 2, 3) |
| 8 | Page 2 of Products | `OFFSET` | Second page of products (3 per page) using LIMIT + OFFSET |

---

## Level 4 — Aggregate Functions

*Summarize data with COUNT, SUM, AVG, MIN, MAX, GROUP BY, and HAVING.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Total Orders | `COUNT` | Count total number of orders |
| 2 | Total Revenue | `SUM` | Sum of all order amounts |
| 3 | Average Product Price | `AVG` | Average price across all products |
| 4 | Orders Per Customer | `GROUP BY` | Count of orders grouped by customer_id |
| 5 | High Value Customers | `HAVING` | Customers with more than 1 order |
| 6 | Price Extremes | `MIN` / `MAX` | Cheapest and most expensive product in one query |
| 7 | Unique Products Sold | `COUNT(DISTINCT)` | Count of distinct products ever ordered |
| 8 | Revenue by Product | `GROUP BY` | Total revenue per product, sorted highest first |

---

## Level 5 — JOIN Operations

*Combine tables using INNER JOIN, LEFT JOIN, multi-table JOINs, and JOINs with filtering/grouping.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Customer Orders | `JOIN` | Show order id and customer first_name |
| 2 | Order Product Names | `JOIN` | Show order id and product name |
| 3 | Order Details Dashboard | `JOIN` (multi) | Three-table JOIN: first_name, product name, amount |
| 4 | Customer Purchase History | `JOIN` (multi) | Show first_name and product name for all orders |
| 5 | Potential Customers | `LEFT JOIN` | Customers who never placed an order |
| 6 | Delivered Order Report | `JOIN` + `WHERE` | Delivered orders with customer names, sorted by date |
| 7 | Revenue by Category | `JOIN` + `GROUP BY` | Order count and total revenue per product category |
| 8 | Premium Deliveries | `JOIN` (multi) | Delivered orders with customer + product names, sorted by amount |

---

## Level 6 — Data Manipulation (DML)

*Modify data using INSERT, UPDATE, and DELETE statements.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Add a New Customer | `INSERT` | Insert Rahul Sharma into Customers |
| 2 | New Product Arrival | `INSERT` | Insert Gaming Headset into Products |
| 3 | Restock Inventory | `UPDATE` | Update Laptop stock to 50 |
| 4 | Correct Order Amount | `UPDATE` | Update order 102 amount to 40.00 |
| 5 | Remove Cancelled Orders | `DELETE` | Delete all Cancelled orders |

---

## Level 7 — String & Date Functions

*Manipulate text with SUBSTR, INSTR, UPPER, LOWER, LENGTH, REPLACE, CAST, and date math with julianday.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Email Prefix | `SUBSTR` | First 4 characters of each customer's email |
| 2 | Find the @ Symbol | `INSTR` | Position of '@' in each email |
| 3 | Email Username | `SUBSTR` + `INSTR` | Text before the '@' in each email |
| 4 | Days Until New Year | `julianday` | Days from registration to 2024-01-01 |
| 5 | Customer Email Domain | `SUBSTR` | Text after the '@' in each email |
| 6 | Uppercase Roster | `UPPER` / `LOWER` | Employee name badge with case formatting |
| 7 | Name Length Ranking | `LENGTH` | Employees ranked by full name length |
| 8 | Integer Price Tags | `CAST` | Truncate product prices to whole numbers |
| 9 | Safe Email Display | `REPLACE` | Replace '@' with ' [at] ' in emails |

---

## Level 8 — Advanced SQL

*Window functions (RANK, ROW_NUMBER, running totals), CTEs, CASE WHEN, UNION, and subqueries.*

| # | Problem | Concept | Description |
|---|---------|---------|-------------|
| 1 | Rank Products by Price | `RANK() OVER` | Rank products from most to least expensive |
| 2 | Employee Salary Ranking | `RANK() OVER` | Rank employees by salary |
| 3 | Department Salary Leaderboard | `PARTITION BY` | Rank employees by salary within each department |
| 4 | Top Customers by Spending | `CTE` + `RANK()` | CTE for total spending, then rank customers |
| 5 | Running Revenue | `SUM() OVER` | Cumulative revenue running total by date |
| 6 | Order Row Numbers | `ROW_NUMBER()` | Number each order chronologically |
| 7 | Price Tiers | `CASE WHEN` | Categorise products into Budget/Mid-range/Premium |
| 8 | Company Directory | `UNION` | Combine customers and employees into one list |
| 9 | Above-Average Earners | Subquery | Employees earning above the company average |

---

## Database Schema

The entire curriculum runs against **4 tables**:

| Table | Key Columns |
|-------|-------------|
| **Customers** | `id`, `first_name`, `last_name`, `email`, `registration_date` |
| **Products** | `id`, `name`, `category`, `price`, `stock` |
| **Orders** | `id`, `customer_id`, `product_id`, `order_date`, `status`, `amount` |
| **Employees** | `id`, `first_name`, `last_name`, `department`, `role`, `salary`, `hire_date` |

---

## Concept Progression

```
L1  SELECT · DISTINCT · AS · ||
 ↓
L2  WHERE · = · > · < · <> · AND · OR · LIKE
 ↓
L3  ORDER BY · LIMIT · IN · BETWEEN · NOT IN · OFFSET
 ↓
L4  COUNT · SUM · AVG · MIN · MAX · GROUP BY · HAVING
 ↓
L5  INNER JOIN · LEFT JOIN · Multi-table JOIN · JOIN + WHERE · JOIN + GROUP BY
 ↓
L6  INSERT · UPDATE · DELETE
 ↓
L7  SUBSTR · INSTR · UPPER · LOWER · LENGTH · REPLACE · CAST · julianday
 ↓
L8  RANK · ROW_NUMBER · PARTITION BY · CTE · SUM OVER · CASE WHEN · UNION · Subquery
```

---

*62 problems total across 8 levels — badcode curriculum v1*
