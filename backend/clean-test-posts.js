const db = require("./db");

const titles = ["Safety check post", "My first post from the API"];
const marks = titles.map(function () { return "?"; }).join(",");
const ids = db.prepare("SELECT id FROM posts WHERE title IN (" + marks + ")").all(...titles).map(function (r) { return r.id; });

if (!ids.length) {
  console.log("No test posts found");
  process.exit(0);
}

const idMarks = ids.map(function () { return "?"; }).join(",");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all().map(function (t) { return t.name; });

const run = db.transaction(function () {
  tables.forEach(function (t) {
    db.prepare("PRAGMA foreign_key_list(" + t + ")").all().forEach(function (fk) {
      if (fk.table === "posts") db.prepare("DELETE FROM " + t + " WHERE " + fk.from + " IN (" + idMarks + ")").run(...ids);
    });
  });
  db.prepare("DELETE FROM posts WHERE id IN (" + idMarks + ")").run(...ids);
});
run();
console.log("Deleted " + ids.length + " test posts");
