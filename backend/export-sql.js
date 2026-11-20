const fs = require("fs");
const path = require("path");
const db = require("./db");

const outDir = path.join(__dirname, "..", "database");
fs.mkdirSync(outDir, { recursive: true });

fs.copyFileSync(path.join(__dirname, "schema.sql"), path.join(outDir, "schema.sql"));

function lit(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
}

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid")
  .all()
  .map(function (t) { return t.name; });

let out = "-- Emberly demo data (dummy data only)\nPRAGMA foreign_keys = OFF;\nBEGIN TRANSACTION;\n";
let total = 0;
tables.forEach(function (t) {
  const rows = db.prepare("SELECT * FROM " + t).all();
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  out += "\n-- " + t + " (" + rows.length + " rows)\n";
  rows.forEach(function (r) {
    out += "INSERT INTO " + t + " (" + cols.join(", ") + ") VALUES (" + cols.map(function (c) { return lit(r[c]); }).join(", ") + ");\n";
  });
  total += rows.length;
});
out += "\nCOMMIT;\nPRAGMA foreign_keys = ON;\n";

fs.writeFileSync(path.join(outDir, "seed.sql"), out);
console.log("Exported " + tables.length + " tables, " + total + " rows to " + outDir);
