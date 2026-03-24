export const schema = {
  Customers: {
    definition: `
      CREATE TABLE Customers (
        id INTEGER PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        registration_date DATE
      );
    `,
    seed: `
      INSERT INTO Customers (id, first_name, last_name, email, registration_date) VALUES 
      (1, 'John', 'Doe', 'john@example.com', '2023-01-10'),
      (2, 'Sarah', 'Smith', 'sarah.smith@example.com', '2023-02-20'),
      (3, 'Michael', 'Johnson', 'mjohnson@example.com', '2023-03-05'),
      (4, 'Emily', 'Davis', 'emily.d@example.com', '2023-03-10'),
      (5, 'David', 'Wilson', 'dwilson@example.com', '2023-04-01'),
      (6, 'Jessica', 'Taylor', 'jtaylor@example.com', '2023-04-15'),
      (7, 'Chris', 'Anderson', 'canderson@example.com', '2023-05-01'),
      (8, 'Sophie', 'Martinez', 'smartinez@example.com', '2023-05-15'),
      (9, 'Isabella', 'Garcia', 'igarcia@example.com', '2023-06-01'),
      (10, 'Alex', 'Patel', NULL, '2023-07-01');
    `,
    description: "Contains all user accounts registered on ShopKart."
  },
  Products: {
    definition: `
      CREATE TABLE Products (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        price DECIMAL(10,2),
        stock INTEGER
      );
    `,
    seed: `
      INSERT INTO Products (id, name, category, price, stock) VALUES
      (1, 'Laptop', 'Electronics', 1200.00, 20),
      (2, 'Wireless Mouse', 'Electronics', 25.00, 150),
      (3, 'Mechanical Keyboard', 'Electronics', 89.99, 50),
      (4, 'Coffee Mug', 'Home', 12.50, 300),
      (5, 'Desk Lamp', 'Home', 45.00, 75),
      (6, 'Laptop Stand', 'Accessories', 35.00, 120),
      (7, 'Bluetooth Speaker', 'Electronics', 55.00, 200),
      (8, 'Notebook', 'Office', 5.00, 500),
      (9, 'Keyboard', 'Electronics', 70.00, 100),
      (10, 'Webcam', 'Electronics', 39.99, NULL);
    `,
    description: "Catalog of all products sold on ShopKart."
  },
  Orders: {
    definition: `
      CREATE TABLE Orders (
        id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        product_id INTEGER,
        order_date DATE,
        status VARCHAR(20),
        amount DECIMAL(10,2),
        FOREIGN KEY(customer_id) REFERENCES Customers(id),
        FOREIGN KEY(product_id) REFERENCES Products(id)
      );
    `,
    seed: `
      INSERT INTO Orders (id, customer_id, product_id, order_date, status, amount) VALUES
      (101, 1, 1, '2023-05-01', 'Delivered', 1200.00),
      (102, 2, 2, '2023-05-02', 'Processing', 45.00),
      (103, 2, 4, '2023-05-03', 'Delivered', 12.50),
      (104, 3, 5, '2023-05-04', 'Shipped', 45.00),
      (105, 4, 3, '2023-05-05', 'Delivered', 89.99),
      (106, 5, 6, '2023-05-06', 'Processing', 35.00),
      (107, 1, 7, '2023-05-07', 'Delivered', 55.00),
      (108, 6, 8, '2023-05-08', 'Cancelled', 5.00),
      (109, 2, 9, '2023-05-09', 'Delivered', 70.00),
      (110, 7, 2, '2023-05-10', 'Shipped', 25.00),
      (111, 8, 4, '2023-05-11', 'Delivered', 12.50),
      (112, 1, 1, '2023-05-12', 'Processing', 1200.00),
      (113, 3, 3, '2023-05-13', 'Delivered', 89.99),
      (114, 4, 2, '2023-05-14', 'Shipped', 25.00),
      (115, 5, 5, '2023-05-15', 'Delivered', 45.00),
      (116, 9, 7, '2023-05-16', 'Delivered', 55.00),
      (117, 2, 1, '2023-05-17', 'Delivered', 1200.00),
      (118, 6, 6, '2023-05-18', 'Cancelled', 35.00),
      (119, 7, 3, '2023-05-19', 'Processing', 89.99),
      (120, 8, 9, '2023-05-25', 'Delivered', 70.00);
    `,
    description: "Records of customer purchases."
  },
  Employees: {
    definition: `
      CREATE TABLE Employees (
        id INTEGER PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        department VARCHAR(50),
        role VARCHAR(50),
        salary DECIMAL(10,2),
        hire_date DATE
      );
    `,
     seed: `
      INSERT INTO Employees (id, first_name, last_name, department, role, salary, hire_date) VALUES 
      (1, 'Alice', 'Brown', 'Sales', 'Manager', 95000.00, '2021-03-01'),
      (2, 'Bob', 'Thompson', 'Engineering', 'Developer', 85000.00, '2022-06-15'),
      (3, 'Charlie', 'Davis', 'Marketing', 'Specialist', 65000.00, '2020-11-20'),
      (4, 'Diana', 'Price', 'Sales', 'Representative', 55000.00, '2023-01-10'),
      (5, 'Evan', 'Wright', 'Engineering', 'Lead', 110000.00, '2022-08-01'),
      (6, 'Fiona', 'Clark', 'Engineering', 'Developer', 85000.00, '2023-03-15');
    `,
    description: "Internal staff records for ShopKart."
  }
};

// SQL mutations that L7 students apply to the database.
// Applied automatically when loading Level 8, 9, or 10 so those levels
// always start from a deterministic post-L7 state regardless of
// navigation order or page refresh.
export const postL7Mutations = [
  "INSERT INTO Customers (id, first_name, last_name, email, registration_date) VALUES (11, 'Rahul', 'Sharma', 'r.sharma@example.com', '2023-10-25');",
  "INSERT INTO Products (id, name, category, price, stock) VALUES (11, 'Gaming Headset', 'Electronics', 99.99, 40);",
  "UPDATE Products SET stock = 50 WHERE name = 'Laptop';",
  "UPDATE Orders SET amount = 40.00 WHERE id = 102;",
  "UPDATE Products SET price = price * 1.1 WHERE category = 'Electronics';",
  "DELETE FROM Orders WHERE status = 'Cancelled';",
  "DELETE FROM Orders WHERE product_id NOT IN (SELECT id FROM Products);"
];
