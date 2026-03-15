import initSqlJs from 'sql.js';
import { schema } from '../data/schema.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let db = null;

// Ensure WASM is loaded correctly
export async function initDatabase() {
  if (db) return db;

  try {
    const SQL = await initSqlJs({
      locateFile: file => file.endsWith('.wasm') ? wasmUrl : file
    });

    db = new SQL.Database();
    
    // Execute all table creation and seed data
    for (const [tableName, tableData] of Object.entries(schema)) {
      db.run(tableData.definition);
      db.run(tableData.seed);
    }
    
    console.log("Database initialized successfully!");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
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
  if (!result || !expectedOutput) return false;
  
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

// Check if the required concept keyword is present in the query
export function checkConcept(sqlStr, requiredConcept) {
  if (!requiredConcept) return true;
  const upperSql = sqlStr.toUpperCase();
  const upperConcept = requiredConcept.toUpperCase();
  return upperSql.includes(upperConcept);
}
