const express = require("express");
const db = require("../db.js");

const router = express.Router();

router.get("/categories", function (req, res) {
  const rows = db.prepare(
    "SELECT c.id, c.name, c.slug, " +
    "(SELECT COUNT(*) FROM courses x WHERE x.category_id = c.id AND x.status = 'published') AS course_count, " +
    "(SELECT COUNT(*) FROM posts p WHERE p.category_id = c.id AND p.status = 'published') AS post_count " +
    "FROM categories c ORDER BY c.name"
  ).all();
  res.json({ categories: rows });
});

router.get("/tags", function (req, res) {
  const rows = db.prepare(
    "SELECT t.id, t.name, COUNT(p.id) AS post_count FROM tags t " +
    "JOIN post_tags pt ON pt.tag_id = t.id JOIN posts p ON p.id = pt.post_id AND p.status = 'published' " +
    "GROUP BY t.id ORDER BY post_count DESC, t.name"
  ).all();
  res.json({ tags: rows });
});

module.exports = router;
