# badcode — Curriculum Narratives

> Every problem tells a story. Here's the full narrative your learners experience.

---

## Level 1 — SELECT Basics

### 1.1 · Customer Directory
As a new data analyst, the first thing you need to do is explore our customer base. Retrieve **all columns** from the `Customers` table.

### 1.2 · Product Catalog
The warehouse manager needs a list of all products. Retrieve **all columns** from the `Products` table.

### 1.3 · Customer Contact List
The marketing team only needs customer names. Return only the `first_name` and `last_name` columns from `Customers`.

### 1.4 · Order Ledger
Let's look at what's been happening in sales. Retrieve **all columns** from the `Orders` table.

### 1.5 · Employee Overview
Management wants a simple staff list. Return `first_name`, `last_name`, and `department` from the `Employees` table.

### 1.6 · Unique Categories
How many product categories does ShopKart carry? Use `DISTINCT` to retrieve each category **only once** from the `Products` table.

### 1.7 · Friendly Column Names
The stakeholder report needs friendlier column headers. Select `first_name`, `last_name`, and `email` from `Customers` and alias them as `first`, `last`, and `contact`.

### 1.8 · Full Name Column
Build a single `full_name` column by combining `first_name` and `last_name` with a space between them. Use the `||` concatenation operator.

---

## Level 2 — Filtering with WHERE

### 2.1 · Processing Orders
The logistics team needs to know which orders are still **Processing**. Filter the `Orders` table where the `status` is 'Processing'.

### 2.2 · Electronics Inventory
Find all products that belong to the **Electronics** category.

### 2.3 · High Value Orders
We need to track significant sales. Find all orders where the `amount` is **greater than 500**.

### 2.4 · Low Stock Alert
Alert the stock manager! Find products where the `stock` is **less than 30**.

### 2.5 · Active Orders
Find all orders that have **NOT** been 'Delivered'.

### 2.6 · Pricey Electronics
The sales team wants Electronics products that are worth promoting as premium items. Find all products in the **Electronics** category with a `price` **greater than 50**. Use `AND` to combine both conditions.

### 2.7 · Shipments in Motion
Operations needs to see all orders that are either in transit or were cancelled. Find all orders with status **'Shipped'** OR **'Cancelled'**.

### 2.8 · Keyboard Products
A customer wants to see all keyboard-related products. Use `LIKE` to find every product whose `name` contains the word **'Key'**.

### 2.9 · Bulk Non-Electronics
Find all products that are **NOT** in the Electronics category and have `stock` greater than **100**. These are our high-volume non-tech items.

---

## Level 3 — Sorting & Pagination

### 3.1 · Newest Orders
The CEO wants to see our latest activity. Sort all orders by `order_date` in descending order (newest first).

### 3.2 · Top Expensive Products
Show me the **Top 3** most expensive products in our catalog. Include only the `name` and `price`.

### 3.3 · Selected Customers
A special promotion is running for our first three customers. Find all orders placed by `customer_id` **1, 2, or 3**.

### 3.4 · Mid Range Products
Find products with a price **between 50 and 500**.

### 3.5 · Preview Orders
Quick check! Return only the **5 most recent** orders.

### 3.6 · Department Roster
HR wants employees sorted **alphabetically by department**, then by **salary highest first** within each department. Sort by two columns.

### 3.7 · Excluding Early Customers
For a targeted campaign, exclude orders from the first three customers. Return all orders where `customer_id` is **NOT IN** (1, 2, 3).

### 3.8 · Page 2 of Products
Your product page shows 3 items at a time. Retrieve the **second page** — that's products 4 through 6 ordered by `id`. Use `LIMIT` with `OFFSET`.

---

## Level 4 — Aggregate Functions

### 4.1 · Total Orders
How many total orders have been placed so far? Use `COUNT`.

### 4.2 · Total Revenue
Calculate the `SUM` of all order amounts.

### 4.3 · Average Product Price
What is the average price of all the products we sell?

### 4.4 · Orders Per Customer
Count how many orders each customer has placed. Show `customer_id` and the count.

### 4.5 · High Value Customers
Find `customer_id`s of people who have placed **more than 1 order**. Use `HAVING`.

### 4.6 · Price Extremes
What is the **cheapest** and **most expensive** product in our catalog? Return both values in a single query using `MIN` and `MAX`.

### 4.7 · Unique Products Sold
How many **distinct products** have ever been ordered? A product ordered multiple times should only count once. Use `COUNT(DISTINCT ...)`.

### 4.8 · Revenue by Product
Which products generate the most revenue? Show each `product_id` and its total revenue, sorted highest first.

---

## Level 5 — JOIN Operations

### 5.1 · Customer Orders
We need the customer names for each order. `JOIN` the **Customers** and **Orders** tables. Show order `id` and customer `first_name`.

### 5.2 · Order Product Names
Which product was purchased in each order? JOIN **Orders** and **Products** to show order `id` and product `name`.

### 5.3 · Order Details Dashboard
The dashboard needs a detailed view. Show `first_name` (from Customers), product `name`, and order `amount`.

### 5.4 · Customer Purchase History
Show a history of what each customer has bought. Select `first_name` and product `name`.

### 5.5 · Potential Customers
We might have users who registered but never placed an order. Find the `first_name` of customers who have no entries in the `Orders` table.

### 5.6 · Delivered Order Report
Finance needs a report of all **Delivered** orders with customer names. JOIN `Orders` and `Customers`, filter for Delivered status, and show `first_name`, `last_name`, `amount`, and `order_date` sorted by date.

### 5.7 · Revenue by Category
Which product category drives the most revenue? JOIN `Orders` and `Products`, then group by `category` to show the order count and total revenue per category. Sort by revenue descending.

### 5.8 · Premium Deliveries
Show all **Delivered** orders with customer name and product name, sorted by amount descending then by order id ascending. This is the full three-table JOIN in action.

---

## Level 6 — Data Manipulation (DML)

### 6.1 · Add a New Customer
We have a walk-in! Insert a new customer named **Rahul Sharma** with email `r.sharma@example.com` and today's date `2023-10-25`.

### 6.2 · New Product Arrival
New inventory! Insert a `Gaming Headset` in the `Electronics` category for `99.99` with `40` in stock.

### 6.3 · Restock Inventory
A shipment of Laptops arrived. Update the `stock` of the **Laptop** to `50`.

### 6.4 · Correct Order Amount
Order 102 had a coupon we forgot to apply. Update its `amount` to `40.00`.

### 6.5 · Remove Cancelled Orders
Clean up the database. Delete all orders that have a `status` of **Cancelled**.

---

## Level 7 — String & Date Functions

### 7.1 · Email Prefix
Extract the first 4 characters of every customer's email.

### 7.2 · Find the @ Symbol
Determine the character position of the '@' symbol in each email.

### 7.3 · Email Username
Extract the text *before* the '@' symbol in each email.

### 7.4 · Days Until New Year
The marketing team wants to know how many days each customer had to wait from their registration date until New Year's Day 2024. Use `julianday` to compute the difference.

### 7.5 · Customer Email Domain
Extract the email domain (everything after the '@') for every customer.

### 7.6 · Uppercase Roster
Generate a formatted name badge for each employee. Return a single column `upper_first` using `UPPER`, and `lower_last` using `LOWER` on their last name.

### 7.7 · Name Length Ranking
Which employee has the longest full name? Concatenate `first_name` and `last_name` with a space, compute its `LENGTH`, and sort longest first. Break ties alphabetically by full name.

### 7.8 · Integer Price Tags
For a quick price display, truncate each product's price to a whole number using `CAST`. Show `name`, `price`, and `price_int`. Order by price descending.

### 7.9 · Safe Email Display
To prevent email harvesting, replace the `@` symbol in every customer's email with ` [at] ` (with spaces). Show `first_name` and `safe_email`.

---

## Level 8 — Advanced SQL

### 8.1 · Rank Products by Price
Rank our products from most expensive to cheapest. Show name, price, and rank.

### 8.2 · Employee Salary Ranking
Rank employees based on their `salary` across the whole company.

### 8.3 · Department Salary Leaderboard
Rank employees by salary **within their own departments**.

### 8.4 · Top Customers by Spending
Find the top spending customers. First calculate total spending per customer in a **CTE**, then rank them.

### 8.5 · Running Revenue
Calculate the cumulative (running) total of revenue as it grows day by day.

### 8.6 · Order Row Numbers
Number each order chronologically using `ROW_NUMBER()`. Show the first 5 orders with their row number, date, and amount.

### 8.7 · Price Tiers
Categorise every product into **'Budget'** (under $20), **'Mid-range'** ($20–$100), or **'Premium'** (over $100) using `CASE WHEN`. Show `name`, `price`, and `price_tier`, ordered by price ascending.

### 8.8 · Company Directory
Combine customers and employees into a single directory using `UNION`. Show `name` (first_name) and `type` ('Customer' or 'Employee'). Sort alphabetically by name.

### 8.9 · Above-Average Earners
Find all employees whose salary is **above the company average**. Use a **subquery** inside your WHERE clause to compute the average on the fly.

---

*62 problem narratives — badcode curriculum v1*
