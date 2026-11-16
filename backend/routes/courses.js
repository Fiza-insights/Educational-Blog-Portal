const express = require("express");
const db = require("../db.js");
const { authenticate, optionalAuth } = require("../middleware/auth.js");

const router = express.Router();

const LIST_SQL =
  "SELECT c.id, c.title, c.description, c.level, c.status, c.category_id, cat.name AS category_name, c.instructor_id, u.name AS instructor_name, " +
  "(SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lesson_count, " +
  "(SELECT COALESCE(SUM(duration_min), 0) FROM lessons l WHERE l.course_id = c.id) AS duration_min, " +
  "(SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS student_count " +
  "FROM courses c LEFT JOIN categories cat ON cat.id = c.category_id JOIN users u ON u.id = c.instructor_id";

function progressOf(userId, courseId) {
  const total = db.prepare("SELECT COUNT(*) AS n FROM lessons WHERE course_id = ?").get(courseId).n;
  const completed = db.prepare("SELECT COUNT(*) AS n FROM lesson_progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.user_id = ? AND l.course_id = ?").get(userId, courseId).n;
  return { completed: completed, total: total, percent: total ? Math.round((completed * 100) / total) : 0 };
}

function isEnrolled(user, courseId) {
  return !!(user && db.prepare("SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?").get(user.id, courseId));
}

function isOwner(user, course) {
  return !!(user && (user.role === "admin" || user.id === course.instructor_id));
}

router.get("/", function (req, res) {
  const where = ["c.status = 'published'"];
  const args = [];
  const q = String(req.query.search || "").trim();
  if (q) { where.push("(c.title LIKE ? OR c.description LIKE ?)"); args.push("%" + q + "%", "%" + q + "%"); }
  if (req.query.category) { where.push("c.category_id = ?"); args.push(Number(req.query.category)); }
  if (["beginner", "intermediate", "advanced"].indexOf(req.query.level) !== -1) { where.push("c.level = ?"); args.push(req.query.level); }
  const rows = db.prepare(LIST_SQL + " WHERE " + where.join(" AND ") + " ORDER BY c.created_at DESC").all(...args);
  res.json({ courses: rows });
});

router.get("/mine/enrolled", authenticate, function (req, res) {
  const rows = db.prepare(LIST_SQL + " JOIN enrollments en ON en.course_id = c.id WHERE en.user_id = ? ORDER BY en.enrolled_at DESC").all(req.user.id);
  res.json({ courses: rows.map(function (c) { return { ...c, progress: progressOf(req.user.id, c.id) }; }) });
});

router.get("/:id", optionalAuth, function (req, res) {
  const course = db.prepare(LIST_SQL + " WHERE c.id = ?").get(req.params.id);
  if (!course || (course.status !== "published" && !isOwner(req.user, course))) return res.status(404).json({ error: "Course not found" });
  const lessons = db.prepare("SELECT id, title, position, duration_min FROM lessons WHERE course_id = ? ORDER BY position").all(course.id);
  const user = req.user;
  const out = { course: course, lessons: lessons, enrolled: isEnrolled(user, course.id), can_edit: isOwner(user, course), completed_lesson_ids: [], quiz: null, best_attempt: null };
  if (user) {
    out.completed_lesson_ids = db.prepare("SELECT p.lesson_id FROM lesson_progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.user_id = ? AND l.course_id = ?").all(user.id, course.id).map(function (r) { return r.lesson_id; });
  }
  out.quiz = db.prepare("SELECT id, title, pass_percent, (SELECT COUNT(*) FROM questions WHERE quiz_id = quizzes.id) AS question_count FROM quizzes WHERE course_id = ?").get(course.id) || null;
  if (user && out.quiz) {
    out.best_attempt = db.prepare("SELECT MAX(percent) AS best_percent, MAX(passed) AS passed, COUNT(*) AS attempts FROM quiz_attempts WHERE quiz_id = ? AND user_id = ?").get(out.quiz.id, user.id);
    if (!out.best_attempt.attempts) out.best_attempt = null;
  }
  res.json(out);
});

router.post("/:id/enroll", authenticate, function (req, res) {
  const course = db.prepare("SELECT * FROM courses WHERE id = ? AND status = 'published'").get(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (course.instructor_id === req.user.id) return res.status(400).json({ error: "You cannot enrol in your own course" });
  db.prepare("INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)").run(req.user.id, course.id);
  res.status(201).json({ enrolled: true, progress: progressOf(req.user.id, course.id) });
});

router.get("/:id/lessons/:lessonId", authenticate, function (req, res) {
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (!isOwner(req.user, course) && !isEnrolled(req.user, course.id)) return res.status(403).json({ error: "Enrol in this course to read its lessons" });
  const lesson = db.prepare("SELECT * FROM lessons WHERE id = ? AND course_id = ?").get(req.params.lessonId, course.id);
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  const all = db.prepare("SELECT id FROM lessons WHERE course_id = ? ORDER BY position").all(course.id).map(function (r) { return r.id; });
  const i = all.indexOf(lesson.id);
  const done = !!db.prepare("SELECT 1 FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").get(req.user.id, lesson.id);
  res.json({ lesson: lesson, completed: done, prev_id: i > 0 ? all[i - 1] : null, next_id: i < all.length - 1 ? all[i + 1] : null });
});

router.post("/:id/lessons/:lessonId/complete", authenticate, function (req, res) {
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (!isEnrolled(req.user, course.id)) return res.status(403).json({ error: "Enrol in this course first" });
  const lesson = db.prepare("SELECT id FROM lessons WHERE id = ? AND course_id = ?").get(req.params.lessonId, course.id);
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  db.prepare("INSERT OR IGNORE INTO lesson_progress (user_id, lesson_id) VALUES (?, ?)").run(req.user.id, lesson.id);
  res.json({ progress: progressOf(req.user.id, course.id) });
});

module.exports = router;
