const express = require("express");
const db = require("../db.js");
const { authenticate, requireRole } = require("../middleware/auth.js");

const router = express.Router();
router.use(authenticate, requireRole("instructor", "admin"));

function ownCourse(req, res) {
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!course) { res.status(404).json({ error: "Course not found" }); return null; }
  if (req.user.role !== "admin" && course.instructor_id !== req.user.id) { res.status(403).json({ error: "This is not your course" }); return null; }
  return course;
}

function readCourse(body) {
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const level = ["beginner", "intermediate", "advanced"].indexOf(body.level) !== -1 ? body.level : "beginner";
  const category_id = Number(body.category_id) || null;
  if (title.length < 3) return { error: "Please enter a course title" };
  if (description.length < 10) return { error: "Please write a short description (at least 10 characters)" };
  if (category_id && !db.prepare("SELECT id FROM categories WHERE id = ?").get(category_id)) return { error: "Category not found" };
  return { data: { title: title, description: description, level: level, category_id: category_id } };
}

router.get("/courses", function (req, res) {
  const where = req.user.role === "admin" ? "" : " WHERE c.instructor_id = " + Number(req.user.id);
  const rows = db.prepare(
    "SELECT c.id, c.title, c.level, c.status, c.created_at, cat.name AS category_name, " +
    "(SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) AS lesson_count, " +
    "(SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS student_count " +
    "FROM courses c LEFT JOIN categories cat ON cat.id = c.category_id" + where + " ORDER BY c.created_at DESC"
  ).all();
  res.json({ courses: rows });
});

router.post("/courses", function (req, res) {
  const r = readCourse(req.body || {});
  if (r.error) return res.status(400).json({ error: r.error });
  const d = r.data;
  const info = db.prepare("INSERT INTO courses (title, description, level, category_id, instructor_id, status) VALUES (?, ?, ?, ?, ?, 'draft')").run(d.title, d.description, d.level, d.category_id, req.user.id);
  res.status(201).json({ course: db.prepare("SELECT * FROM courses WHERE id = ?").get(info.lastInsertRowid) });
});

router.get("/courses/:id", function (req, res) {
  const course = ownCourse(req, res);
  if (!course) return;
  const lessons = db.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY position").all(course.id);
  const quiz = db.prepare("SELECT * FROM quizzes WHERE course_id = ?").get(course.id);
  const questions = quiz ? db.prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY id").all(quiz.id) : [];
  res.json({ course: course, lessons: lessons, quiz: quiz || null, questions: questions });
});

router.put("/courses/:id", function (req, res) {
  const course = ownCourse(req, res);
  if (!course) return;
  const r = readCourse(req.body || {});
  if (r.error) return res.status(400).json({ error: r.error });
  const d = r.data;
  db.prepare("UPDATE courses SET title = ?, description = ?, level = ?, category_id = ? WHERE id = ?").run(d.title, d.description, d.level, d.category_id, course.id);
  res.json({ course: db.prepare("SELECT * FROM courses WHERE id = ?").get(course.id) });
});

router.put("/courses/:id/submit", function (req, res) {
  const course = ownCourse(req, res);
  if (!course) return;
  if (course.status === "published" || course.status === "pending") return res.status(400).json({ error: "This course is already " + course.status });
  const n = db.prepare("SELECT COUNT(*) AS n FROM lessons WHERE course_id = ?").get(course.id).n;
  if (n < 1) return res.status(400).json({ error: "Add at least one lesson before submitting for approval" });
  db.prepare("UPDATE courses SET status = 'pending' WHERE id = ?").run(course.id);
  res.json({ status: "pending" });
});

router.delete("/courses/:id", function (req, res) {
  const course = ownCourse(req, res);
  if (!course) return;
  const n = db.prepare("SELECT COUNT(*) AS n FROM enrollments WHERE course_id = ?").get(course.id).n;
  if (n > 0) return res.status(400).json({ error: "This course has students enrolled and cannot be deleted" });
  db.prepare("DELETE FROM courses WHERE id = ?").run(course.id);
  res.json({ deleted: true });
});

router.post("/courses/:id/lessons", function (req, res) {
  const course = ownCourse(req, res);
  if (!course) return;
  const b = req.body || {};
  const title = String(b.title || "").trim();
  const content = String(b.content || "").trim();
  if (title.length < 2) return res.status(400).json({ error: "Please enter a lesson title" });
  if (content.length < 5) return res.status(400).json({ error: "Please write the lesson content" });
  const pos = db.prepare("SELECT COALESCE(MAX(position), 0) + 1 AS p FROM lessons WHERE course_id = ?").get(course.id).p;
  const info = db.prepare("INSERT INTO lessons (course_id, title, content, video_url, position, duration_min) VALUES (?, ?, ?, ?, ?, ?)")
    .run(course.id, title, content, String(b.video_url || "").trim() || null, pos, Math.max(1, Number(b.duration_min) || 10));
  res.status(201).json({ lesson: db.prepare("SELECT * FROM lessons WHERE id = ?").get(info.lastInsertRowid) });
});

router.put("/lessons/:lessonId", function (req, res) {
  const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  req.params.id = lesson.course_id;
  if (!ownCourse(req, res)) return;
  const b = req.body || {};
  const title = String(b.title || "").trim();
  const content = String(b.content || "").trim();
  if (title.length < 2 || content.length < 5) return res.status(400).json({ error: "Title and content are required" });
  db.prepare("UPDATE lessons SET title = ?, content = ?, video_url = ?, duration_min = ? WHERE id = ?")
    .run(title, content, String(b.video_url || "").trim() || null, Math.max(1, Number(b.duration_min) || lesson.duration_min), lesson.id);
  res.json({ lesson: db.prepare("SELECT * FROM lessons WHERE id = ?").get(lesson.id) });
});

router.delete("/lessons/:lessonId", function (req, res) {
  const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  req.params.id = lesson.course_id;
  if (!ownCourse(req, res)) return;
  db.prepare("DELETE FROM lessons WHERE id = ?").run(lesson.id);
  res.json({ deleted: true });
});

router.put("/courses/:id/quiz", function (req, res) {
  const course = ownCourse(req, res);
  if (!course) return;
  const b = req.body || {};
  const title = String(b.title || "").trim() || "Course Quiz";
  const pass = Math.min(100, Math.max(1, Number(b.pass_percent) || 60));
  const qs = Array.isArray(b.questions) ? b.questions : [];
  if (qs.length < 1) return res.status(400).json({ error: "Add at least one question" });
  for (const q of qs) {
    const o = q.options || [];
    if (!String(q.text || "").trim() || o.length !== 4 || o.some(function (x) { return !String(x).trim(); }) || ["a", "b", "c", "d"].indexOf(q.correct) === -1) {
      return res.status(400).json({ error: "Each question needs text, 4 options and a correct answer (a, b, c or d)" });
    }
  }
  const save = db.transaction(function () {
    db.prepare("DELETE FROM quizzes WHERE course_id = ?").run(course.id);
    const qid = db.prepare("INSERT INTO quizzes (course_id, title, pass_percent) VALUES (?, ?, ?)").run(course.id, title, pass).lastInsertRowid;
    const ins = db.prepare("INSERT INTO questions (quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    qs.forEach(function (q) { ins.run(qid, String(q.text).trim(), q.options[0], q.options[1], q.options[2], q.options[3], q.correct, String(q.explanation || "").trim() || null); });
    return qid;
  });
  res.json({ quiz_id: save(), questions: qs.length });
});

module.exports = router;
