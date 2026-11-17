import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Circle, PlayCircle, Trophy } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    api("/courses/" + id).then(setData).catch((e) => setError(e.message));
  }
  useEffect(load, [id]);

  async function enroll() {
    if (!user) return nav("/login");
    setBusy(true);
    try {
      await api("/courses/" + id + "/enroll", { method: "POST" });
      load();
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  if (error) return <div className="container page"><p className="error">{error}</p></div>;
  if (!data) return <div className="container page"><p className="muted">Loading...</p></div>;

  const { course, lessons, enrolled, completed_lesson_ids, quiz, best_attempt } = data;
  const done = completed_lesson_ids || [];
  const percent = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;

  return (
    <div className="container page rise">
      <div className="detail">
        <div>
          <div className="row">
            <span className="badge">{course.category_name || "General"}</span>
            <span className="badge">{course.level}</span>
          </div>
          <h1 style={{ marginTop: 14 }}>{course.title}</h1>
          <p className="muted lead">{course.description}</p>
          <p className="muted">Taught by <strong>{course.instructor_name}</strong></p>

          <h2 style={{ marginTop: 34 }}>Lessons</h2>
          <div className="lessons">
            {lessons.map((l, i) => (
              <Link key={l.id} to={"/lesson/" + l.id} className="lesson card hover">
                {done.includes(l.id) ? <CheckCircle2 className="ok-icon" /> : enrolled ? <PlayCircle /> : <Circle />}
                <span className="lt">{i + 1}. {l.title}</span>
                <span className="muted small">{l.duration_min} min</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="card side">
          {enrolled ? (
            <>
              <h3>Your progress</h3>
              <div className="progress"><span style={{ width: percent + "%" }} /></div>
              <p className="muted small">{done.length} of {lessons.length} lessons done ({percent}%)</p>
              {lessons.length > 0 && (
                <Link className="btn" to={"/lesson/" + (lessons.find((l) => !done.includes(l.id)) || lessons[0]).id}>
                  {done.length ? "Continue" : "Start learning"}
                </Link>
              )}
            </>
          ) : (
            <>
              <h3>Ready to start?</h3>
              <p className="muted">Enrol for free and track your progress.</p>
              <button className="btn" onClick={enroll} disabled={busy}>{busy ? "Enrolling..." : "Enrol now"}</button>
            </>
          )}
          {quiz && (
            <div className="quizbox">
              <h4><Trophy size={18} /> Final quiz</h4>
              <p className="muted small">{quiz.question_count} questions &middot; pass at {quiz.pass_percent}%</p>
              {best_attempt && <p className="small">Best score: {best_attempt.best_percent}% {best_attempt.passed ? "(passed)" : ""}</p>}
              {enrolled ? <Link className="btn ghost" to={"/quiz/" + quiz.id}>Take quiz</Link> : <p className="muted small">Enrol to take the quiz.</p>}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

