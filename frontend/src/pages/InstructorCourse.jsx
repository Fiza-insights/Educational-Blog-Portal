import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Trash2, Pencil, Send } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import QuizEditor from "../components/QuizEditor.jsx";

const blank = { title: "", content: "", video_url: "", duration_min: 5 };

export default function InstructorCourse() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  function load() {
    api("/instructor/courses/" + id).then((d) => {
      setCourse(d.course || d);
      setLessons(d.lessons || (d.course && d.course.lessons) || []);
      setQuiz(d.quiz || (d.course && d.course.quiz) || null);
    }).catch((e) => setError(e.message));
  }
  useEffect(load, [id]);

  if (!user || (user.role !== "instructor" && user.role !== "admin")) return <Navigate to="/login" />;
  if (!course) return <div className="container page">{error ? <p className="error">{error}</p> : <p className="muted">Loading...</p>}</div>;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function saveLesson(e) {
    e.preventDefault();
    setError(""); setMsg("");
    const body = { ...form, duration_min: Number(form.duration_min) || 1 };
    try {
      if (editing) await api("/instructor/lessons/" + editing, { method: "PUT", body });
      else await api("/instructor/courses/" + id + "/lessons", { method: "POST", body });
      setForm(blank); setEditing(null); setMsg("Lesson saved."); load();
    } catch (err) { setError(err.message); }
  }

  function edit(l) {
    setEditing(l.id);
    setForm({ title: l.title, content: l.content || "", video_url: l.video_url || "", duration_min: l.duration_min || 5 });
    window.scrollTo(0, 0);
  }

  async function remove(lid) {
    if (!window.confirm("Delete this lesson?")) return;
    try { await api("/instructor/lessons/" + lid, { method: "DELETE" }); load(); } catch (err) { setError(err.message); }
  }

  async function submitForApproval() {
    setError(""); setMsg("");
    try { await api("/instructor/courses/" + id + "/submit", { method: "PUT" }); setMsg("Sent for admin approval."); load(); }
    catch (err) { setError(err.message); }
  }

  async function deleteCourse() {
    if (!window.confirm("Delete the whole course?")) return;
    try { await api("/instructor/courses/" + id, { method: "DELETE" }); nav("/instructor"); } catch (err) { setError(err.message); }
  }

  return (
    <div className="container page rise">
      <Link to="/instructor" className="back">Back to my courses</Link>
      <div className="row" style={{ marginTop: 14 }}>
        <span className={"badge st st-" + course.status}>{course.status}</span>
        <span className="badge">{course.level}</span>
      </div>
      <h1 style={{ marginTop: 12 }}>{course.title}</h1>
      <p className="muted plain">{course.description}</p>
      <div className="row" style={{ margin: "14px 0" }}>
        <button className="btn" onClick={submitForApproval}><Send size={16} /> Send for approval</button>
        <button className="btn ghost" onClick={deleteCourse}><Trash2 size={16} /> Delete course</button>
      </div>
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}

      <div className="detail" style={{ marginTop: 20 }}>
        <div>
          <h2>Lessons ({lessons.length})</h2>
          {lessons.length === 0 && <p className="muted">No lessons yet. Add the first one.</p>}
          <div className="lessons">
            {lessons.map((l, i) => (
              <div key={l.id} className="lesson card">
                <span className="lt">{i + 1}. {l.title}</span>
                <span className="muted small">{l.duration_min} min</span>
                <button className="iconbtn" onClick={() => edit(l)} aria-label="Edit"><Pencil size={16} /></button>
                <button className="iconbtn" onClick={() => remove(l.id)} aria-label="Delete"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <form className="card" onSubmit={saveLesson}>
          <h3>{editing ? "Edit lesson" : "Add lesson"}</h3>
          <label>Title</label>
          <input value={form.title} onChange={set("title")} placeholder="e.g. Introduction to Phishing" required />
          <label>Lesson text</label>
          <textarea rows="6" value={form.content} onChange={set("content")} placeholder="Write the lesson content here..." />
          <label>Video link (optional, YouTube)</label>
          <input value={form.video_url} onChange={set("video_url")} placeholder="https://www.youtube.com/watch?v=..." />
          <label>Duration (minutes)</label>
          <input type="number" min="1" value={form.duration_min} onChange={set("duration_min")} />
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn">{editing ? "Save changes" : "Add lesson"}</button>
            {editing && <button type="button" className="btn ghost" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <QuizEditor courseId={id} initial={quiz} onSaved={load} />
    </div>
  );
}



