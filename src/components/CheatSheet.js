export function toggleCheatSheet() {
  // Destroy and recreate so styles react to current theme
  let panel = document.getElementById('cheatsheet-panel');

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'cheatsheet-panel';

    // Shared styles
    Object.assign(panel.style, {
      position:      'fixed',
      top:           '0',
      right:         '-420px',
      width:         '420px',
      height:        '100vh',
      zIndex:        '9999',
      display:       'flex',
      flexDirection: 'column',
      transition:    'right 0.3s cubic-bezier(0.4,0,0.2,1)',
      // Theme-aware via CSS vars
      backgroundColor: 'var(--bg-card)',
      borderLeft:    '1px solid var(--border)',
      boxShadow:     '-8px 0 32px rgba(0,0,0,0.18)',
    });

    const concepts = [
      {
        title: 'SELECT & FROM',
        desc:  'Basic data retrieval. Use <code>*</code> for all columns.',
        sql:   'SELECT first_name, email\nFROM Customers;',
      },
      {
        title: 'WHERE Clause',
        desc:  'Filter rows with conditions. Combine with <code>AND</code> / <code>OR</code>.',
        sql:   'SELECT * FROM Orders\nWHERE total_amount > 100;',
      },
      {
        title: 'ORDER BY',
        desc:  'Sort results. Use <code>DESC</code> for largest-first.',
        sql:   'SELECT * FROM Products\nORDER BY price DESC;',
      },
      {
        title: 'GROUP BY & aggregate',
        desc:  'Summarise rows into groups with functions like <code>COUNT()</code>, <code>SUM()</code>.',
        sql:   'SELECT category, COUNT(*) AS total\nFROM Products\nGROUP BY category;',
      },
      {
        title: 'JOIN',
        desc:  'Combine rows from two tables on a matching column.',
        sql:   'SELECT o.id, c.first_name\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.id;',
      },
      {
        title: 'LIMIT',
        desc:  'Return only the first <em>n</em> rows.',
        sql:   'SELECT * FROM Products\nORDER BY price DESC\nLIMIT 5;',
      },
    ];

    const cards = concepts.map(c => `
      <div style="
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 1rem 1.1rem;
        display: flex; flex-direction: column; gap: 0.55rem;
      ">
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.82rem; font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        ">${c.title}</h4>
        <p style="
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.55;
        ">${c.desc}</p>
        <pre style="
          background: #1A1A24;
          color: #C8F542;
          border: 1px solid rgba(200,245,66,0.18);
          padding: 0.7rem 0.9rem;
          border-radius: 7px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          line-height: 1.6;
          overflow-x: auto;
          margin: 0;
          white-space: pre;
        ">${c.sql}</pre>
      </div>
    `).join('');

    panel.innerHTML = `
      <!-- Header -->
      <div style="
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
          <span style="
            font-family: var(--font-mono);
            font-size: 0.9rem; font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
          ">SQL Cheat Sheet</span>
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

      <!-- Scrollable body -->
      <div style="
        flex: 1; overflow-y: auto; padding: 1.2rem;
        display: flex; flex-direction: column; gap: 0.85rem;
      ">
        <p style="
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          margin-bottom: 0.25rem;
        ">Quick Reference</p>
        ${cards}
      </div>
    `;

    document.body.appendChild(panel);

    document.getElementById('close-cheatsheet').addEventListener('click', () => {
      panel.style.right = '-420px';
    });
  }

  // Toggle
  panel.style.right = panel.style.right === '0px' ? '-420px' : '0px';
}
