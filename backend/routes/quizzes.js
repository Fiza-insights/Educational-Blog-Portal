const express = require("express");
const db = require("../db.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

function canTake(user, quiz) {
  if (user.role === "admin") return true;
  const course = db.prepare("SELECT instructor_id FROM courses WHERE id = ?").get(quiz.course_id);
  if (course && course.instructor_id === user.id) return true;
  return !!db.prepare("SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?").get(user.id, quiz.course_id);
}

router.get("/:id", authenticate, function (req, res) {
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  if (!canTake(req.user, quiz)) return res.status(403).json({ error: "Enrol in this course to take its quiz" });
  const questions = db.prepare("SELECT id, text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ? ORDER BY id").all(quiz.id);
  const course = db.prepare("SELECT id, title FROM courses WHERE id = ?").get(quiz.course_id);
  res.json({ quiz: quiz, course: course, questions: questions });
});

router.post("/:id/submit", authenticate, function (req, res) {
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  if (!canTake(req.user, quiz)) return res.status(403).json({ error: "Enrol in this course to take its quiz" });
  const answers = (req.body && req.body.answers) || {};
  const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ? ORDER BY id").all(quiz.id);
  let score = 0;
  const results = questions.map(function (q) {
    const mine = String(answers[q.id] || "").toLowerCase();
    const ok = mine === q.correct;
    if (ok) score++;
    return { question_id: q.id, your_answer: mine || null, correct_answer: q.correct, is_correct: ok, explanation: q.explanation };
  });
  const total = questions.length;
  const percent = total ? Math.round((score * 100) / total) : 0;
  const passed = percent >= quiz.pass_percent ? 1 : 0;
  db.prepare("INSERT INTO quiz_attempts (quiz_id, user_id, score, total, percent, passed) VALUES (?, ?, ?, ?, ?, ?)").run(quiz.id, req.user.id, score, total, percent, passed);
  res.json({ score: score, total: total, percent: percent, passed: !!passed, pass_percent: quiz.pass_percent, results: results });
});

router.get("/:id/attempts", authenticate, function (req, res) {
  const rows = db.prepare("SELECT id, score, total, percent, passed, taken_at FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY id DESC").all(req.params.id, req.user.id);
  res.json({ attempts: rows });
});

module.exports = router;
