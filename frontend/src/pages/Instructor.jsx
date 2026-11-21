import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Instructor() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [courses, setCourses] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", level: "beginner", category_id: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    api("/instructor/courses").then((d) => setCourses(d.courses || [])).catch((e) => setError(e.message));
  }
  useEffect(() => {
    load();
    api("/categories").then((d) => {
      const list = d.categories || [];
      setCats(list);
      if (list[0]) setForm((f) => ({ ...f, category_id: list[0].id }));
    }).catch(() => {});
  }, []);

  if (!user || (user.role !== "instructor" && user.role !== "admin")) return <Navigate to="/login" />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function create(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const r = await api("/instructor/courses", { method: "POST", body: { ...form, category_id: Number(form.category_id) } });
      const id = r.id || (r.course && r.course.id);
      if (id) nav("/instructor/" + id);
      else load();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="container page rise">
      <h1>Teach on Emberly</h1>
      <p className="muted sub">Create a course, add lessons and a quiz, then send it for approval.</p>
      <div className="detail" style={{ marginTop: 26 }}>
        <div>
          <h2>My courses</h2>
          {courses.length === 0 && <p className="muted">You have no courses yet. Create your first one.</p>}
          <div className="lessons">
            {courses.map((c) => (
              <Link key={c.id} to={"/instructor/" + c.id} className="lesson card hover">
                <span className="lt">{c.title}</span>
                <span className={"badge st st-" + c.status}>{c.status}</span>
                <span className="edit">Edit <ChevronRight size={16} className="chev" /></span>
              </Link>
            ))}
          </div>
        </div>
        <form className="card" onSubmit={create}>
          <h3><Plus size={18} style={{ verticalAlign: -3 }} /> New course</h3>
          <label>Title</label>
          <input placeholder="e.g. Intro to Web Development" value={form.title} onChange={set("title")} required />
          <label>Description</label>
          <textarea rows="4" placeholder="What will students learn in this course?" value={form.description} onChange={set("description")} required />
          <label>Level</label>
          <select value={form.level} onChange={set("level")}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <label>Category</label>
          <select value={form.category_id} onChange={set("category_id")}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {error && <p className="error shake" style={{ marginTop: 12 }}>{error}</p>}
          <button className="btn" style={{ marginTop: 16 }} disabled={busy}>{busy ? "Creating..." : "Create course"}</button>
        </form>
      </div>
    </div>
  );
}
