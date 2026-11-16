const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database(path.join(__dirname, "emberly.db"));
db.pragma("foreign_keys = ON");
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

module.exports = db;

if (require.main === module) {
  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
  console.log("Database ready. Tables: " + rows.map(function (r) { return r.name; }).join(", "));
}
