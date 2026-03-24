import { schema } from '../data/schema.js';

export function renderDatasetExplorer(containerId, problem = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Determine which tables are actively referenced in this problem
  const activeTables = new Set();
  if (problem) {
    const searchStr = (problem.story + ' ' + problem.hints.join(' ') + ' ' + (problem.title || '')).toLowerCase();
    Object.keys(schema).forEach(tableName => {
      if (searchStr.includes(tableName.toLowerCase())) {
        activeTables.add(tableName);
      }
    });
  }

  const tablesHtml = Object.keys(schema).map(tableName => {
    const tableInfo = schema[tableName];
    const inUse = activeTables.has(tableName);

    const badgeHtml = inUse
      ? `<span class="badge badge-accent" style="margin-left: 0.5rem; font-size: 0.6rem;">IN USE</span>`
      : '';

    // Extract column definitions
    const lines = tableInfo.definition.split('\n');
    const columnLines = lines.slice(2, lines.length - 2);

    const columnsHtml = columnLines.map(line => {
      const parts = line.trim().replace(',', '').split(' ');
      if (parts.length >= 2 && !line.includes('FOREIGN KEY')) {
        const colName = parts[0];
        let colTypeBadge = '';
        if (parts.includes('PRIMARY') && parts.includes('KEY')) {
          colTypeBadge = `<span class="type-pill pk">PK</span> <span class="type-pill">${parts.slice(1, parts.indexOf('PRIMARY')).join(' ')}</span>`;
        } else {
          colTypeBadge = `<span class="type-pill">${parts.slice(1).join(' ')}</span>`;
        }
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.25rem 0; border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-primary); font-family: var(--font-mono); font-size: 0.72rem; font-weight: 500;">${colName}</span>
            <div style="display: flex; gap: 0.4rem;">${colTypeBadge}</div>
          </div>
        `;
      }
      return '';
    }).join('');

    return `
      <div style="border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1rem; background: var(--bg-card);">
        <div
          class="schema-table-header${inUse ? ' active' : ''}"
          data-table="${tableName}"
          style="padding: 0.75rem 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s, border-left 0.2s;"
          onclick="
            const body = this.nextElementSibling;
            const chev = this.querySelector('.ds-chev');
            const open = body.style.display !== 'none';
            body.style.display = open ? 'none' : 'block';
            chev.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
          "
        >
          <h5 style="margin: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;">
            <svg class="table-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: ${inUse ? '0.8' : '0.45'}; transition: opacity 0.2s;"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span class="schema-table-name" style="font-weight: 600;">${tableName}</span>
            ${badgeHtml}
          </h5>
          <svg class="ds-chev" style="transition: transform 0.2s ease; flex-shrink: 0; opacity: 0.5;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div style="padding: 1rem; display: block; border-top: 1px solid var(--border);">
          <p style="font-size: 0.72rem; color: var(--text-secondary); margin-bottom: 0.6rem;">${tableInfo.description}</p>
          <div style="padding: 0; border-radius: var(--radius-sm);">
            ${columnsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div>
      <h3 class="mb-4" style="font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
        SCHEMA EXPLORER
      </h3>
      ${tablesHtml}
    </div>
  `;
}
