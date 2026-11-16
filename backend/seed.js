const bcrypt = require("bcryptjs");
const db = require("./db.js");
const courses = require("./seed-courses-1.js").concat(require("./seed-courses-2.js"));
const posts = require("./seed-posts.js");

if (db.prepare("SELECT COUNT(*) AS n FROM users").get().n > 0) {
  console.log("Already seeded. Delete emberly.db to start fresh.");
  process.exit(0);
}

const hashes = {};
function pw(p) { if (!hashes[p]) hashes[p] = bcrypt.hashSync(p, 10); return hashes[p]; }
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function ago(days, hour) {
  const d = new Date(Date.now() - days * 86400000);
  d.setHours(hour || 10, 0, 0, 0);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

const commentTexts = [
  "Really clear explanation, thank you!",
  "This helped me understand it much better.",
  "Great article. Can you write one about APIs next?",
  "I tried this and it worked on the first go.",
  "Short and useful. Bookmarking this one.",
  "I wish I had read this when I started.",
  "Good tips, especially the part about small projects.",
  "Simple and easy to follow. Thanks!",
];

const run = db.transaction(function () {
  const insUser = db.prepare("INSERT INTO users (name, email, password_hash, role, bio, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  insUser.run("Fiza Saleem", "admin@emberly.test", pw("Admin@123"), "admin", "Site administrator", ago(60));
  const instructors = [
    ["Ayesha Rahman", "instructor1@emberly.test", "Web developer and teacher."],
    ["Bilal Ahmed", "instructor2@emberly.test", "Software engineer who loves Python and React."],
    ["Hira Anwar", "instructor3@emberly.test", "UI/UX designer and data enthusiast."],
  ].map(function (x, i) { return insUser.run(x[0], x[1], pw("Instructor@123"), "instructor", x[2], ago(55 - i)).lastInsertRowid; });
  const students = [
    ["Sara Khan", "student@emberly.test"], ["Ali Raza", "ali@emberly.test"], ["Maham Tariq", "maham@emberly.test"],
    ["Usman Sheikh", "usman@emberly.test"], ["Zoya Farooq", "zoya@emberly.test"],
  ].map(function (x, i) { return insUser.run(x[0], x[1], pw("Student@123"), "student", null, ago(40 - i)).lastInsertRowid; });

  const catId = {};
  const insCat = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
  ["Web Development", "Python and Data", "Design", "Career Skills"].forEach(function (n) { catId[n] = insCat.run(n, slugify(n)).lastInsertRowid; });

  const insCourse = db.prepare("INSERT INTO courses (title, description, level, category_id, instructor_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const insLesson = db.prepare("INSERT INTO lessons (course_id, title, content, video_url, position, duration_min) VALUES (?, ?, ?, ?, ?, ?)");
  const insQuiz = db.prepare("INSERT INTO quizzes (course_id, title, pass_percent) VALUES (?, ?, ?)");
  const insQ = db.prepare("INSERT INTO questions (quiz_id, text, option_a, option_b, option_c, option_d, correct, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const info = {};
  const pub = [];
  courses.forEach(function (c, ci) {
    const cid = insCourse.run(c.title, c.description, c.level, catId[c.category], instructors[c.instructor], c.status, ago(50 - ci)).lastInsertRowid;
    const lessonIds = c.lessons.map(function (l, li) { return insLesson.run(cid, l[0], l[1], null, li + 1, l[2]).lastInsertRowid; });
    const qid = insQuiz.run(cid, c.quiz.title, c.quiz.pass).lastInsertRowid;
    c.quiz.questions.forEach(function (q) { insQ.run(qid, q[0], q[1], q[2], q[3], q[4], q[5], q[6]); });
    info[cid] = { lessonIds: lessonIds, quizId: qid, total: c.quiz.questions.length };
    if (c.status === "published") pub.push(cid);
  });

  const insEnr = db.prepare("INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, ?)");
  const insProg = db.prepare("INSERT INTO lesson_progress (user_id, lesson_id, completed_at) VALUES (?, ?, ?)");
  const insAtt = db.prepare("INSERT INTO quiz_attempts (quiz_id, user_id, score, total, percent, passed, taken_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  students.forEach(function (sid, s) {
    for (let k = 0; k < 3; k++) {
      const cid = pub[(s * 2 + k) % pub.length];
      const c = info[cid];
      insEnr.run(sid, cid, ago(30 - s * 2 - k));
      const done = Math.min(c.lessonIds.length, (s + k) % 4);
      for (let i = 0; i < done; i++) insProg.run(sid, c.lessonIds[i], ago(20 - s - k - i));
      if (done === c.lessonIds.length) {
        const score = Math.max(1, c.total - ((s + k) % 3 === 0 ? 2 : (s + k) % 2));
        const percent = Math.round((score * 100) / c.total);
        insAtt.run(c.quizId, sid, score, c.total, percent, percent >= 60 ? 1 : 0, ago(10 - s));
      }
    }
  });

  const insPost = db.prepare("INSERT INTO posts (title, slug, excerpt, body, author_id, category_id, status, created_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const insTag = db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)");
  const getTag = db.prepare("SELECT id FROM tags WHERE name = ?");
  const insPT = db.prepare("INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)");
  const insComment = db.prepare("INSERT INTO comments (post_id, user_id, body, status, created_at) VALUES (?, ?, ?, 'approved', ?)");
  posts.forEach(function (p, i) {
    const isPub = p.status === "published";
    const pid = insPost.run(p.title, slugify(p.title), p.excerpt, p.body, instructors[p.author], catId[p.category], p.status, ago(40 - i * 3), isPub ? ago(40 - i * 3, 12) : null).lastInsertRowid;
    p.tags.forEach(function (t) { insTag.run(t); insPT.run(pid, getTag.get(t).id); });
    if (isPub) {
      for (let j = 0; j < 1 + (i % 2); j++) insComment.run(pid, students[(i + j) % students.length], commentTexts[(i * 2 + j) % commentTexts.length], ago(35 - i * 3 - j, 15));
    }
  });
});

run();
const n = function (t) { return db.prepare("SELECT COUNT(*) AS n FROM " + t).get().n; };
console.log("Seed done. Users: " + n("users") + ", Courses: " + n("courses") + ", Lessons: " + n("lessons") + ", Questions: " + n("questions") + ", Enrollments: " + n("enrollments") + ", Posts: " + n("posts") + ", Tags: " + n("tags") + ", Comments: " + n("comments"));
