import initSqlJs from 'sql.js';
import { schema, postL7Mutations } from '../data/schema.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let db = null;
let SQL = null;

async function ensureSqlJs() {
  if (SQL) return;
  SQL = await initSqlJs({
    locateFile: file => file.endsWith('.wasm') ? wasmUrl : file
  });
}

// Resets the database to a clean known state for the given level.
// Levels 1-7 use the base seed. Levels 8-10 additionally apply the
// post-L7 mutations so those levels always start from a deterministic
// post-L7 state regardless of navigation order or page refresh.
export async function resetDatabase(level = 1) {
  await ensureSqlJs();

  if (db) {
    db.close();
  }

  db = new SQL.Database();

  for (const [, tableData] of Object.entries(schema)) {
    db.run(tableData.definition);
    db.run(tableData.seed);
  }

  if (level >= 8) {
    for (const mutation of postL7Mutations) {
      db.run(mutation);
    }
  }

  console.log(`Database initialised for level ${level}`);
  return db;
}

// Kept for backwards compatibility — initialises with the base seed
// if nothing has been set up yet.
export async function initDatabase() {
  if (db) return db;
  return resetDatabase(1);
}

export function executeQuery(sqlStr) {
  if (!db) {
    return { error: 'Database not initialized' };
  }

  try {
    const results = db.exec(sqlStr);
    const rowsModified = db.getRowsModified();

    if (results.length === 0) {
      return { columns: [], rows: [], rowsModified };
    }

    // db.exec returns an array of results for each statement executed
    // We only care about the first one (for SELECTs usually)
    const result = results[0];

    // Map array of arrays to array of objects for easier comparison and rendering
    const rowsAsObjects = result.values.map(row => {
      const obj = {};
      result.columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });

    return {
      columns: result.columns,
      rows: rowsAsObjects,
      rawRows: result.values,
      rowsModified
    };
  } catch (err) {
    return { error: err.message };
  }
}

// Simple array comparison or affected rows comparison
export function validateResult(result, expectedOutput) {
  if (!result) return false;
  if (expectedOutput === null) return !result.error;
  if (!expectedOutput) return false;

  // Handle DML (INSERT, UPDATE, DELETE) validation
  if (expectedOutput && typeof expectedOutput === 'object' && 'affectedRows' in expectedOutput) {
    return result.rowsModified === expectedOutput.affectedRows;
  }

  // Handle SELECT validation
  const userRows = result.rows;
  if (!userRows || userRows.length !== expectedOutput.length) return false;

  // We'll do a basic JSON stringify comparison.
  // Order matters here, robust validation would sort both by ID.
  return JSON.stringify(userRows) === JSON.stringify(expectedOutput);
}

export function validateResultDetailed(result, expectedOutput) {
  if (!result) return { verdict: 'incorrect', reason: 'no_result' };
  
  // Open-ended problems
  if (expectedOutput === null) {
    if (result.error) return { verdict: 'incorrect', reason: 'error' };
    return { verdict: 'correct', reason: 'open_ended' };
  }
  
  if (!expectedOutput) return { verdict: 'incorrect', reason: 'no_result' };

  // DML path
  if (typeof expectedOutput === 'object' && 'affectedRows' in expectedOutput) {
    return result.rowsModified === expectedOutput.affectedRows
      ? { verdict: 'correct' }
      : { verdict: 'incorrect', reason: 'wrong_affected_rows' };
  }

  const userRows = result.rows || [];

  // Exact match
  if (JSON.stringify(userRows) === JSON.stringify(expectedOutput)) {
    return { verdict: 'correct' };
  }

  // Column check
  const userCols = result.columns || [];
  const expectedCols = expectedOutput.length > 0 ? Object.keys(expectedOutput[0]) : [];
  const colsMatch = userCols.length === expectedCols.length && userCols.every(c => expectedCols.includes(c));

  if (!colsMatch) {
    return { verdict: 'partial', reason: 'wrong_columns' };
  }

  // Row count check
  if (userRows.length !== expectedOutput.length) {
    return { verdict: 'partial', reason: 'wrong_row_count', got: userRows.length, expected: expectedOutput.length };
  }

  // Order-insensitive match (right rows, wrong order)
  const normalize = rows => JSON.stringify([...rows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));
  if (normalize(userRows) === normalize(expectedOutput)) {
    return { verdict: 'partial', reason: 'wrong_order' };
  }

  return { verdict: 'partial', reason: 'wrong_values' };
}

// Check if the required concept keyword is present in the query
export function checkConcept(sqlStr, requiredConcept) {
  if (!requiredConcept) return true;
  const upperSql = sqlStr.toUpperCase();
  const upperConcept = requiredConcept.toUpperCase();
  return upperSql.includes(upperConcept);
}
