const db = require("./db");
const rows = db.prepare("SELECT id, content FROM lessons").all();
const up = db.prepare("UPDATE lessons SET content = ? WHERE id = ?");
let n = 0;
for (const r of rows) {
  let t = String(r.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (/^use[A-Z]/.test(t)) t = "The " + t;
  t = t.replace(/(^|[.!?] )(?!use[A-Z])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  if (t !== r.content) { up.run(t, r.id); n++; }
}
console.log("Badle:", n, "of", rows.length);
