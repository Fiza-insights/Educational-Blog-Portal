const express = require("express");
const db = require("../db.js");
const { authenticate, requireRole } = require("../middleware/auth.js");

const router = express.Router();
router.use(authenticate, requireRole("admin"));

router.get("/courses", function (req, res) {
  const status = req.query.status;
  const where = ["draft", "pending", "published", "rejected"].indexOf(status) !== -1 ? " WHERE c.status = '" + status + "'" : "";
  const rows = db.prepare(
    "SELECT c.id, c.title, c.level, c.status, c.created_at, u.name AS instructor_name, cat.name AS category_name, " +
    "(SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lesson_count, " +
    "(SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS student_count " +
    "FROM courses c JOIN users u ON u.id = c.instructor_id LEFT JOIN categories cat ON cat.id = c.category_id" + where + " ORDER BY c.created_at DESC"
  ).all();
  res.json({ courses: rows });
});

router.put("/courses/:id/status", function (req, res) {
  const status = (req.body || {}).status;
  if (["draft", "pending", "published", "rejected"].indexOf(status) === -1) return res.status(400).json({ error: "Invalid status" });
  const info = db.prepare("UPDATE courses SET status = ? WHERE id = ?").run(status, req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Course not found" });
  res.json({ status: status });
});

router.get("/posts", function (req, res) {
  const status = req.query.status;
  const where = ["draft", "pending", "published", "rejected"].indexOf(status) !== -1 ? " WHERE p.status = '" + status + "'" : "";
  const rows = db.prepare(
    "SELECT p.id, p.title, p.slug, p.status, p.created_at, p.published_at, u.name AS author_name, cat.name AS category_name " +
    "FROM posts p JOIN users u ON u.id = p.author_id LEFT JOIN categories cat ON cat.id = p.category_id" + where + " ORDER BY p.created_at DESC"
  ).all();
  res.json({ posts: rows });
});

router.put("/posts/:id/status", function (req, res) {
  const status = (req.body || {}).status;
  if (["pending", "published", "rejected"].indexOf(status) === -1) return res.status(400).json({ error: "Invalid status" });
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const publishedAt = status === "published" ? (post.published_at || new Date().toISOString().replace("T", " ").slice(0, 19)) : post.published_at;
  db.prepare("UPDATE posts SET status = ?, published_at = ? WHERE id = ?").run(status, publishedAt, post.id);
  res.json({ status: status });
});

router.get("/comments", function (req, res) {
  const rows = db.prepare(
    "SELECT c.id, c.body, c.status, c.created_at, u.name AS user_name, p.title AS post_title FROM comments c " +
    "JOIN users u ON u.id = c.user_id JOIN posts p ON p.id = c.post_id ORDER BY c.created_at DESC LIMIT 100"
  ).all();
  res.json({ comments: rows });
});

router.put("/comments/:id/status", function (req, res) {
  const status = (req.body || {}).status;
  if (["approved", "hidden"].indexOf(status) === -1) return res.status(400).json({ error: "Invalid status" });
  const info = db.prepare("UPDATE comments SET status = ? WHERE id = ?").run(status, req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Comment not found" });
  res.json({ status: status });
});

router.get("/users", function (req, res) {
  const rows = db.prepare(
    "SELECT u.id, u.name, u.email, u.role, u.created_at, " +
    "(SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id) AS enrollments, " +
    "(SELECT COUNT(*) FROM courses c WHERE c.instructor_id = u.id) AS courses, " +
    "(SELECT COUNT(*) FROM posts p WHERE p.author_id = u.id) AS posts FROM users u ORDER BY u.created_at DESC"
  ).all();
  res.json({ users: rows });
});

router.put("/users/:id/role", function (req, res) {
  const role = (req.body || {}).role;
  if (["student", "instructor", "admin"].indexOf(role) === -1) return res.status(400).json({ error: "Invalid role" });
  if (Number(req.params.id) === req.user.id) return res.status(400).json({ error: "You cannot change your own role" });
  const info = db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
  if (!info.changes) return res.status(404).json({ error: "User not found" });
  res.json({ role: role });
});

router.get("/reports", function (req, res) {
  const n = function (sql) { return db.prepare(sql).get().n; };
  const attempts = n("SELECT COUNT(*) AS n FROM quiz_attempts");
  const passed = n("SELECT COUNT(*) AS n FROM quiz_attempts WHERE passed = 1");
  const cards = {
    students: n("SELECT COUNT(*) AS n FROM users WHERE role = 'student'"),
    instructors: n("SELECT COUNT(*) AS n FROM users WHERE role = 'instructor'"),
    published_courses: n("SELECT COUNT(*) AS n FROM courses WHERE status = 'published'"),
    pending_courses: n("SELECT COUNT(*) AS n FROM courses WHERE status = 'pending'"),
    enrollments: n("SELECT COUNT(*) AS n FROM enrollments"),
    published_posts: n("SELECT COUNT(*) AS n FROM posts WHERE status = 'published'"),
    pending_posts: n("SELECT COUNT(*) AS n FROM posts WHERE status = 'pending'"),
    comments: n("SELECT COUNT(*) AS n FROM comments"),
    quiz_attempts: attempts,
    pass_rate: attempts ? Math.round((passed * 100) / attempts) : 0,
  };
  const by_course = db.prepare("SELECT c.title, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS students FROM courses c WHERE c.status = 'published' ORDER BY students DESC, c.title").all();
  const by_category = db.prepare("SELECT cat.name, (SELECT COUNT(*) FROM posts p WHERE p.category_id = cat.id AND p.status = 'published') AS posts FROM categories cat ORDER BY posts DESC, cat.name").all();
  const daily = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    daily.push({ date: d, enrollments: n("SELECT COUNT(*) AS n FROM enrollments WHERE date(enrolled_at) = '" + d + "'") });
  }
  res.json({ cards: cards, enrollments_by_course: by_course, posts_by_category: by_category, daily: daily });
});

module.exports = router;
