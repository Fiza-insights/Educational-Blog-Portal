import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

const LABELS = {
  students: "Students", instructors: "Instructors", published_courses: "Live courses", pending_courses: "Courses waiting",
  enrollments: "Enrolments", published_posts: "Live articles", pending_posts: "Articles waiting", comments: "Comments",
  quiz_attempts: "Quiz attempts", pass_rate: "Pass rate %",
};

function Overview() {
  const [r, setR] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api("/admin/reports").then(setR).catch((e) => setError(e.message)); }, []);
  if (error) return <p className="error">{error}</p>;
  if (!r) return <p className="muted">Loading...</p>;
  return (
    <div>
      <div className="cards4">
        {Object.keys(r.cards).map((k) => (
          <div key={k} className="card stat"><strong>{r.cards[k]}</strong><span>{LABELS[k] || k}</span></div>
        ))}
      </div>
      <div className="charts">
        <div className="card chartbox">
          <h3>Students per course</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={r.enrollments_by_course}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,60,160,0.15)" />
              <XAxis dataKey="title" tick={{ fontSize: 11 }} interval={0} angle={-15} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="students" fill="#7c5cdb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chartbox">
          <h3>Articles per category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={r.posts_by_category}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,60,160,0.15)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="posts" fill="#f4a97f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chartbox wide">
          <h3>Enrolments, last days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={r.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,60,160,0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="enrollments" stroke="#6a48cf" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Queue({ kind, titleOf, subOf, actions }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  function load() { api("/admin/" + kind).then((d) => setItems(d[kind] || [])).catch((e) => setError(e.message)); }
  useEffect(load, [kind]);

  async function act(id, status) {
    setError("");
    try { await api("/admin/" + kind + "/" + id + "/status", { method: "PUT", body: { status } }); load(); }
    catch (e) { setError(e.message); }
  }

  if (!items) return <div>{error ? <p className="error">{error}</p> : <p className="muted">Loading...</p>}</div>;
  const sorted = items.slice().sort((a, b) => (a.status === "pending" ? -1 : 0) - (b.status === "pending" ? -1 : 0));
  return (
    <div>
      {error && <p className="error">{error}</p>}
      {sorted.length === 0 && <p className="muted">Nothing here yet.</p>}
      <div className="lessons">
        {sorted.map((it) => (
          <div key={it.id} className="card qrow">
            <div className="qtext">
              <strong>{titleOf(it)}</strong>
              <span className="muted small">{subOf(it)}</span>
            </div>
            <span className={"badge" + (it.status === "pending" ? " warn" : "")}>{it.status}</span>
            <div className="row">
              {actions.map((a) => (
                <button key={a.status} className={"btn " + (a.ghost ? "ghost" : "")} disabled={it.status === a.status} onClick={() => act(it.id, a.status)}>{a.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  function load() { api("/admin/users").then((d) => setUsers(d.users || [])).catch((e) => setError(e.message)); }
  useEffect(load, []);
  async function setRole(id, role) {
    setError("");
    try { await api("/admin/users/" + id + "/role", { method: "PUT", body: { role } }); load(); }
    catch (e) { setError(e.message); }
  }
  if (!users) return <div>{error ? <p className="error">{error}</p> : <p className="muted">Loading...</p>}</div>;
  return (
    <div>
      {error && <p className="error">{error}</p>}
      <div className="lessons">
        {users.map((u) => (
          <div key={u.id} className="card qrow">
            <div className="qtext"><strong>{u.name}</strong><span className="muted small">{u.email}</span></div>
            <select style={{ width: 150 }} value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
              <option value="student">student</option>
              <option value="instructor">instructor</option>
              <option value="admin">admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  if (!user || user.role !== "admin") return <Navigate to="/login" />;
  const tabs = [["overview", "Overview"], ["courses", "Courses"], ["posts", "Articles"], ["comments", "Comments"], ["users", "Users"]];
  const approve = [{ label: "Approve", status: "published" }, { label: "Reject", status: "rejected", ghost: true }];
  return (
    <div className="container page rise">
      <h1>Admin panel</h1>
      <div className="row tabs">
        {tabs.map(([k, l]) => <button key={k} className={"badge tagbtn" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div style={{ marginTop: 22 }}>
        {tab === "overview" && <Overview />}
        {tab === "courses" && <Queue kind="courses" titleOf={(c) => c.title} subOf={(c) => "By " + c.instructor_name} actions={approve} />}
        {tab === "posts" && <Queue kind="posts" titleOf={(p) => p.title} subOf={(p) => "By " + p.author_name} actions={approve} />}
        {tab === "comments" && <Queue kind="comments" titleOf={(c) => c.body} subOf={(c) => "By " + c.user_name} actions={[{ label: "Hide", status: "hidden", ghost: true }, { label: "Show", status: "visible" }]} />}
        {tab === "users" && <Users />}
      </div>
    </div>
  );
}
