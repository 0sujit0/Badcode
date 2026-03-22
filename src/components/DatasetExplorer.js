import { schema } from '../data/schema.js';

export function renderDatasetExplorer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tablesHtml = Object.keys(schema).map(tableName => {
    const tableInfo = schema[tableName];
    
    // Extract column definitions simply via regex on the CREATE TABLE statement
    // Real parser would be better, but regex works for our clean schema definition
    const lines = tableInfo.definition.split('\n');
    const columnLines = lines.slice(2, lines.length - 2); 
    
    const columnsHtml = columnLines.map(line => {
      const parts = line.trim().replace(',', '').split(' ');
      if (parts.length >= 2 && !line.includes('FOREIGN KEY')) {
        const colName = parts[0];
        const colType = parts.slice(1).join(' ');
        return `
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid var(--border);">
            <span style="color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; font-weight: 500;">${colName}</span>
            <span style="color: var(--text-primary); font-weight: 400; font-size: 0.75rem; text-transform: uppercase;">${colType}</span>
          </div>
        `;
      }
      return '';
    }).join('');

    return `
      <div style="border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1rem; background: var(--bg-card);">
        <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="
          const body = this.nextElementSibling;
          const chev = this.querySelector('.ds-chev');
          const open = body.style.display !== 'none';
          body.style.display = open ? 'none' : 'block';
          chev.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
        ">
          <h5 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            ${tableName}
          </h5>
          <svg class="ds-chev" style="transition: transform 0.2s ease; flex-shrink: 0;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div style="padding: 1rem; display: block;">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">${tableInfo.description}</p>
          <div style="background: var(--bg-primary); padding: 0.5rem; border-radius: var(--radius-sm);">
            ${columnsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div>
      <h3 class="mb-4" style="font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
        Dataset Explorer
      </h3>
      ${tablesHtml}
    </div>
  `;
}
