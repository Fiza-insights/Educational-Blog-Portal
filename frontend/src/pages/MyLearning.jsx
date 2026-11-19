import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Trophy, Bookmark } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

function savedIds() {
  try { return JSON.parse(localStorage.getItem("emberly_marks") || "[]"); } catch (e) { return []; }
}

export default function MyLearning() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api("/courses/mine/enrolled").then(async (d) => {
      setCourses(d.courses);
      const rows = [];
      for (const c of d.courses) {
        try {
          const det = await api("/courses/" + c.id);
          if (det.best_attempt && det.quiz) rows.push({ course: c, quiz: det.quiz, best: det.best_attempt });
        } catch (e) {}
      }
      setAttempts(rows);
    }).catch((e) => setError(e.message));
    api("/engage/saved").then((r) => { if (r.ids.length) api("/posts?limit=100").then((d) => setSaved(d.posts.filter((p) => r.ids.includes(p.id)))); }).catch(() => {});
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const done = (courses || []).filter((c) => c.progress.percent === 100).length;

  return (
    <div className="container page rise">
      <h1>My Learning</h1>
      <p className="muted">Hello {user.name.split(" ")[0]}, pick up where you left off.</p>
      {error && <p className="error">{error}</p>}

      {courses && (
        <div className="cards4 three">
          <div className="card stat"><strong>{courses.length}</strong><span>Enrolled</span></div>
          <div className="card stat"><strong>{done}</strong><span>Completed</span></div>
          <div className="card stat"><strong>{attempts.length}</strong><span>Quizzes taken</span></div>
        </div>
      )}

      <h2 style={{ marginTop: 36 }}>My courses</h2>
      {courses && courses.length === 0 && (
        <p className="muted">You have not enrolled in any course yet. <Link to="/courses">Browse courses</Link></p>
      )}
      <div className="grid" style={{ marginTop: 16 }}>
        {(courses || []).map((c) => (
          <Link key={c.id} to={"/courses/" + c.id} className="card hover course-card">
            <h3>{c.title}</h3>
            <p className="muted small">By {c.instructor_name}</p>
            <div className="progress"><span style={{ width: c.progress.percent + "%" }} /></div>
            <p className="muted small" style={{ marginTop: 8 }}>{c.progress.completed} of {c.progress.total} lessons ({c.progress.percent}%)</p>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}><Trophy size={22} style={{ verticalAlign: -3 }} /> Quiz history</h2>
      {attempts.length === 0 && <p className="muted">No quiz taken yet.</p>}
      <div className="lessons" style={{ marginTop: 14 }}>
        {attempts.map((a) => (
          <Link key={a.quiz.id} to={"/quiz/" + a.quiz.id} className="lesson card hover">
            <span className="lt">{a.course.title}</span>
            <span className="muted small">{a.best.attempts} attempt(s)</span>
            <span className={"badge " + (a.best.passed ? "ok" : "warn")}>{a.best.best_percent}% {a.best.passed ? "passed" : "not passed"}</span>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}><Bookmark size={22} style={{ verticalAlign: -3 }} /> Saved articles</h2>
      {saved.length === 0 && <p className="muted">Save an article with the Save button and it will show up here.</p>}
      <div className="grid" style={{ marginTop: 14 }}>
        {saved.map((p) => (
          <Link key={p.id} to={"/blog/" + p.slug} className="card hover">
            <span className="badge">{p.category_name}</span>
            <h3 style={{ marginTop: 12 }}>{p.title}</h3>
            <p className="muted small">By {p.author_name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

