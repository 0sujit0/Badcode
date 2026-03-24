import problems from '../data/problems.json';

// Full concept database, keyed by the level that introduces each concept.
// On a lesson page: concepts from levels 1…currentLevel are shown.
// On any other page: everything is shown as a complete reference.
const CONCEPT_LEVELS = [
  {
    level: 1,
    label: 'The SELECT Statement',
    concepts: [
      {
        keys: ['SELECT', 'FROM'],
        title: 'SELECT & FROM',
        desc: 'Retrieve columns from a table. Use <code>*</code> for all columns.',
        sql: 'SELECT first_name, email\nFROM Customers;',
      },
      {
        keys: ['DISTINCT'],
        title: 'SELECT DISTINCT',
        desc: 'Eliminate duplicate rows from results.',
        sql: 'SELECT DISTINCT category\nFROM Products;',
      },
      {
        keys: ['AS', '||'],
        title: 'Aliasing & Concatenation',
        desc: 'Rename columns with <code>AS</code>, join strings with <code>||</code>.',
        sql: "SELECT first_name || ' ' || last_name AS full_name\nFROM Customers;",
      }
    ],
  },
  {
    level: 2,
    label: 'The WHERE Clause',
    concepts: [
      {
        keys: ['WHERE'],
        title: 'WHERE',
        desc: 'Filter rows with conditions. Combine with <code>AND</code> / <code>OR</code>.',
        sql: "SELECT * FROM Orders\nWHERE status = 'Delivered'\n  AND amount > 50;",
      },
      {
        keys: ['LIKE'],
        title: 'LIKE',
        desc: 'Pattern match (<code>%</code> = any chars).',
        sql: "SELECT * FROM Customers\nWHERE email LIKE '%@example.com';",
      }
    ],
  },
  {
    level: 3,
    label: 'Sorting & Limiting',
    concepts: [
      {
        keys: ['ORDER BY'],
        title: 'ORDER BY',
        desc: 'Sort results. Default is <code>ASC</code>; add <code>DESC</code> for largest-first.',
        sql: 'SELECT * FROM Products\nORDER BY price DESC;',
      },
      {
        keys: ['LIMIT'],
        title: 'LIMIT',
        desc: 'Return only the first <em>n</em> rows.',
        sql: 'SELECT * FROM Products\nORDER BY price DESC\nLIMIT 5;',
      },
      {
        keys: ['IN', 'BETWEEN'],
        title: 'IN / BETWEEN',
        desc: '<code>IN</code> — match a list. <code>BETWEEN</code> — range check.',
        sql: "SELECT * FROM Orders\nWHERE status IN ('Delivered', 'Shipped');\n\nSELECT * FROM Products\nWHERE price BETWEEN 20 AND 100;",
      },
    ],
  },
  {
    level: 4,
    label: 'Grouping & Aggregation',
    concepts: [
      {
        keys: ['GROUP BY', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
        title: 'GROUP BY & Aggregates',
        desc: 'Summarise rows into groups. Combine with <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>.',
        sql: 'SELECT category,\n       COUNT(*) AS total,\n       AVG(price) AS avg_price\nFROM Products\nGROUP BY category;',
      },
      {
        keys: ['HAVING'],
        title: 'HAVING',
        desc: 'Filter <em>after</em> grouping — like <code>WHERE</code>, but for aggregate results.',
        sql: 'SELECT category, COUNT(*) AS total\nFROM Products\nGROUP BY category\nHAVING total > 2;',
      },
    ],
  },
  {
    level: 5,
    label: 'Multiple Tables',
    concepts: [
      {
        keys: ['JOIN', 'INNER JOIN'],
        title: 'INNER JOIN',
        desc: 'Returns only rows that have a matching value in both tables.',
        sql: 'SELECT o.id, c.first_name\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.id;',
      },
      {
        keys: ['LEFT JOIN'],
        title: 'LEFT JOIN',
        desc: 'All rows from the left table; matched rows from the right (or <code>NULL</code> if no match).',
        sql: 'SELECT c.first_name, o.id\nFROM Customers c\nLEFT JOIN Orders o ON c.id = o.customer_id;',
      },
    ],
  },
  {
    level: 6,
    label: 'Handling NULL Values',
    concepts: [
      {
        keys: ['IS NULL', 'IS NOT NULL'],
        title: 'IS NULL / IS NOT NULL',
        desc: 'Check for missing values. Never use <code>= NULL</code> — it never matches.',
        sql: 'SELECT * FROM Orders\nWHERE status IS NOT NULL;',
      },
      {
        keys: ['COALESCE'],
        title: 'COALESCE',
        desc: 'Returns the first non-NULL value in a list of arguments.',
        sql: "SELECT first_name, COALESCE(email, 'No Email') AS contact\nFROM Customers;",
      }
    ],
  },
  {
    level: 7,
    label: 'Database Mutations (DML)',
    concepts: [
      {
        keys: ['INSERT', 'INSERT INTO'],
        title: 'INSERT INTO',
        desc: 'Add a new row to a table.',
        sql: "INSERT INTO Products\n  (id, name, category, price, stock)\nVALUES\n  (10, 'Headset', 'Electronics', 99.99, 40);",
      },
      {
        keys: ['UPDATE', 'SET'],
        title: 'UPDATE … SET',
        desc: 'Modify existing rows. Always use <code>WHERE</code> — omitting it updates every row.',
        sql: 'UPDATE Orders\nSET amount = 40.00\nWHERE id = 102;',
      },
      {
        keys: ['DELETE', 'DELETE FROM'],
        title: 'DELETE FROM',
        desc: 'Remove rows. Always use <code>WHERE</code> — omitting it deletes the entire table.',
        sql: "DELETE FROM Orders\nWHERE status = 'Cancelled';",
      },
    ],
  },
  {
    level: 8,
    label: 'Functions & Formatting',
    concepts: [
      {
        keys: ['SUBSTR', 'INSTR'],
        title: 'SUBSTR / INSTR',
        desc: '<code>SUBSTR(str, start, len)</code> slices a string. <code>INSTR(str, sub)</code> returns the character position.',
        sql: "SELECT SUBSTR(email, 1, 4)          AS prefix,\n       INSTR(email, '@')            AS at_pos,\n       SUBSTR(email, INSTR(email,'@')+1) AS domain\nFROM Customers;",
      },
      {
        keys: ['UPPER', 'LOWER', 'LENGTH', 'REPLACE'],
        title: 'String Functions',
        desc: 'Case conversion, string length, and substring replacement.',
        sql: "SELECT UPPER(first_name),\n       LENGTH(last_name),\n       REPLACE(email, 'example.com', 'shop.com')\nFROM Customers;",
      },
      {
        keys: ['CAST'],
        title: 'CAST',
        desc: 'Convert a value from one data type to another.',
        sql: "SELECT CAST(price AS INTEGER)\nFROM Products;",
      },
      {
        keys: ['strftime', 'julianday'],
        title: 'Date Functions',
        desc: 'Format dates with <code>strftime</code> and do date math with <code>julianday</code>.',
        sql: "SELECT strftime('%Y-%m', order_date) AS month,\n       COUNT(*) AS orders\nFROM Orders\nGROUP BY month;\n\nSELECT julianday('2024-01-01') - julianday(registration_date)\nFROM Customers;",
      },
    ],
  },
  {
    level: 9,
    label: 'Complex Logic',
    concepts: [
      {
        keys: ['CASE', 'WHEN', 'THEN', 'ELSE', 'END'],
        title: 'CASE WHEN',
        desc: 'Conditional logic in SQL, akin to if-else statements.',
        sql: "SELECT name, price,\n  CASE\n    WHEN price > 50 THEN 'Expensive'\n    WHEN price > 20 THEN 'Moderate'\n    ELSE 'Cheap'\n  END AS price_tier\nFROM Products;",
      },
      {
        keys: ['UNION', 'UNION ALL'],
        title: 'UNION / UNION ALL',
        desc: 'Combine rows from two queries. <code>UNION</code> removes duplicates, <code>UNION ALL</code> keeps them.',
        sql: "SELECT first_name AS name, 'Customer' AS role FROM Customers\nUNION ALL\nSELECT first_name AS name, 'Employee' AS role FROM Employees;",
      }
    ],
  },
  {
    level: 10,
    label: 'Subqueries & Windows',
    concepts: [
      {
        keys: ['WITH', 'CTE'],
        title: 'Common Table Expressions (WITH)',
        desc: 'Define temporary result sets that can be referenced within a SELECT statement.',
        sql: "WITH HighValueOrders AS (\n  SELECT * FROM Orders WHERE amount > 100\n)\nSELECT c.first_name, h.amount\nFROM HighValueOrders h\nJOIN Customers c ON h.customer_id = c.id;",
      },
      {
        keys: ['OVER', 'PARTITION BY'],
        title: 'Window Functions — OVER',
        desc: 'Compute a value across a set of rows without collapsing them. <code>PARTITION BY</code> resets the window per group.',
        sql: 'SELECT first_name,\n       SUM(amount) OVER (PARTITION BY customer_id) AS total_spent\nFROM Orders\nJOIN Customers ON customer_id = Customers.id;',
      },
      {
        keys: ['ROW_NUMBER', 'RANK', 'DENSE_RANK'],
        title: 'ROW_NUMBER / RANK',
        desc: 'Number rows in a window. <code>RANK</code> leaves gaps on ties; <code>ROW_NUMBER</code> never gaps.',
        sql: 'SELECT first_name, salary,\n       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,\n       RANK()       OVER (ORDER BY salary DESC) AS rnk\nFROM Employees;',
      },
      {
        keys: ['LAG', 'LEAD'],
        title: 'LAG / LEAD',
        desc: 'Access a value from a row <em>n</em> steps before (<code>LAG</code>) or after (<code>LEAD</code>) the current row.',
        sql: 'SELECT order_date, amount,\n       LAG(amount)  OVER (ORDER BY order_date) AS prev_amount,\n       LEAD(amount) OVER (ORDER BY order_date) AS next_amount\nFROM Orders;',
      },
    ],
  },
];

// Returns { level, requiredConcept } from the current URL, or null if not on a lesson.
function getCurrentContext() {
  const hash = window.location.hash || '';
  if (!hash.startsWith('#/lesson/')) return null;
  const lessonId = hash.split('/').pop();
  const problem = problems.find(p => p.id === lessonId);
  if (!problem) return null;
  return { level: problem.level, requiredConcept: (problem.requiredConcept || '').toUpperCase() };
}

// Returns true if the concept's keys match the required concept keyword.
function isCurrentConcept(concept, requiredConcept) {
  if (!requiredConcept) return false;
  return concept.keys.some(k => k.toUpperCase() === requiredConcept || requiredConcept.includes(k.toUpperCase()));
}

function buildCards(context) {
  const levelsToShow = context
    ? CONCEPT_LEVELS.filter(g => g.level <= context.level)
    : CONCEPT_LEVELS;

  // Collect all concepts; mark the one matching requiredConcept
  const allConcepts = [];
  for (const group of levelsToShow) {
    for (const c of group.concepts) {
      const pinned = context ? isCurrentConcept(c, context.requiredConcept) : false;
      allConcepts.push({ ...c, group, pinned });
    }
  }

  // Pinned concept goes first
  allConcepts.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  let lastGroup = null;
  return allConcepts.map(c => {
    let groupHeader = '';
    if (c.group !== lastGroup) {
      lastGroup = c.group;
      groupHeader = `
        <div style="
          font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          margin-top: ${lastGroup === c.group && allConcepts[0].group === c.group ? '0' : '0.5rem'};
          padding: 0 0.1rem;
        ">Level ${c.group.level} — ${c.group.label}</div>
      `;
    }

    const pinnedBadge = c.pinned ? `
      <span style="
        display: inline-flex; align-items: center; gap: 0.3rem;
        background: rgba(200,245,66,0.12); color: var(--accent);
        border: 1px solid rgba(200,245,66,0.3);
        font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.08em; padding: 0.15rem 0.55rem;
        border-radius: 99px;
      ">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="var(--accent)"><circle cx="5" cy="5" r="4.5"/></svg>
        Current Topic
      </span>
    ` : '';

    const cardBorder = c.pinned
      ? '1px solid rgba(200,245,66,0.35)'
      : '1px solid var(--border)';
    const cardBg = c.pinned
      ? 'rgba(200,245,66,0.04)'
      : 'var(--bg-elevated)';

    return `
      ${groupHeader}
      <div style="
        background: ${cardBg};
        border: ${cardBorder};
        border-radius: 10px;
        padding: 0.9rem 1rem;
        display: flex; flex-direction: column; gap: 0.5rem;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
          <h4 style="
            font-family: var(--font-mono);
            font-size: 0.82rem; font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.01em;
            margin: 0;
          ">${c.title}</h4>
          ${pinnedBadge}
        </div>
        <p style="
          font-size: 0.79rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
        ">${c.desc}</p>
        <pre style="
          background: #1A1A24;
          color: #C8F542;
          border: 1px solid rgba(200,245,66,0.15);
          padding: 0.65rem 0.85rem;
          border-radius: 7px;
          font-family: var(--font-mono);
          font-size: 0.73rem;
          line-height: 1.6;
          overflow-x: auto;
          margin: 0;
          white-space: pre;
        ">${c.sql}</pre>
      </div>
    `;
  }).join('');
}

export function toggleCheatSheet() {
  let panel = document.getElementById('cheatsheet-panel');

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'cheatsheet-panel';

    Object.assign(panel.style, {
      position:        'fixed',
      top:             '0',
      right:           '-440px',
      width:           '440px',
      height:          '100vh',
      zIndex:          '9999',
      display:         'flex',
      flexDirection:   'column',
      transition:      'right 0.3s cubic-bezier(0.4,0,0.2,1)',
      backgroundColor: 'var(--bg-card)',
      borderLeft:      '1px solid var(--border)',
      boxShadow:       '-8px 0 32px rgba(0,0,0,0.18)',
    });

    panel.innerHTML = `
      <div id="cheatsheet-header" style="
        display: flex; align-items: center; justify-content: space-between;
        padding: 1.2rem 1.4rem;
        border-bottom: 1px solid var(--border);
        background: var(--bg-elevated);
        flex-shrink: 0;
      ">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <div style="
            width: 26px; height: 26px; border-radius: 6px;
            background: var(--accent);
            display: flex; align-items: center; justify-content: center;
          ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-inverse)" stroke-width="2.5">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <div style="
              font-family: var(--font-mono);
              font-size: 0.9rem; font-weight: 700;
              color: var(--text-primary);
              letter-spacing: -0.02em;
            ">SQL Cheat Sheet</div>
            <div id="cheatsheet-subtitle" style="
              font-size: 0.72rem; color: var(--text-muted); margin-top: 1px;
            "></div>
          </div>
        </div>
        <button id="close-cheatsheet" style="
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 50%; width: 30px; height: 30px;
          cursor: pointer; color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, color 0.15s;
        " onmouseenter="this.style.borderColor='var(--border-hover)';this.style.color='var(--text-primary)'"
           onmouseleave="this.style.borderColor='var(--border)';this.style.color='var(--text-secondary)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div id="cheatsheet-body" style="
        flex: 1; overflow-y: auto; padding: 1.1rem;
        display: flex; flex-direction: column; gap: 0.75rem;
      "></div>
    `;

    document.body.appendChild(panel);

    document.getElementById('close-cheatsheet').addEventListener('click', () => {
      panel.style.right = '-440px';
    });
  }

  // Always refresh content on open so it reflects current page context
  const isOpen = panel.style.right === '0px';
  if (!isOpen) {
    const context = getCurrentContext();
    const body = document.getElementById('cheatsheet-body');
    const subtitle = document.getElementById('cheatsheet-subtitle');

    if (context) {
      subtitle.textContent = `Showing Level 1–${context.level} concepts`;
    } else {
      subtitle.textContent = 'Complete SQL reference';
    }

    body.innerHTML = buildCards(context);
    panel.style.right = '0px';
  } else {
    panel.style.right = '-440px';
  }
}
