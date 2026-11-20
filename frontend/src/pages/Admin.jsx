import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

const LABELS = {
  students: "Students", instructors: "Instructors", published_courses: "Live courses", pending_courses: "Courses waiting",
  enrollments: "Enrolments", published_posts: "Live articles", pending_posts: "Articles waiting", comments: "Comments",
  quiz_attempts: "Quiz attempts", pass_rate: "Pass rate",
};

const SINGLE = {
  students: "Student", instructors: "Instructor", published_courses: "Live course", pending_courses: "Course waiting",
  enrollments: "Enrolment", published_posts: "Live article", pending_posts: "Article waiting", comments: "Comment",
  quiz_attempts: "Quiz attempt",
};
const lab = (k, n) => (n === 1 && SINGLE[k] ? SINGLE[k] : LABELS[k] || k);

function BarRows({ data, labelKey, valueKey, unit, color }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]));
  return (
    <div className="barrows">
      {data.map((d, i) => (
        <div key={d[labelKey]} className="brow">
          <span className="blabel" title={d[labelKey]}>{d[labelKey]}</span>
          <div className="btrack">
            <div className="bfill" style={{ width: (d[valueKey] / max) * 100 + "%", background: color, animationDelay: i * 70 + "ms" }} />
          </div>
          <span className="bval">{d[valueKey]} {d[valueKey] === 1 ? unit : unit + "s"}</span>
        </div>
      ))}
    </div>
  );
}

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
          <div key={k} className="card stat"><strong>{k === "pass_rate" ? r.cards[k] + "%" : r.cards[k]}</strong><span>{lab(k, r.cards[k])}</span></div>
        ))}
      </div>
      <div className="charts">
        <div className="card chartbox">
          <h3>Students per course</h3>
          <BarRows data={r.enrollments_by_course} labelKey="title" valueKey="students" unit="student" color="linear-gradient(90deg, #6a48cf, #a78bfa)" />
        </div>
        <div className="card chartbox">
          <h3>Articles per category</h3>
          <BarRows data={r.posts_by_category} labelKey="name" valueKey="posts" unit="article" color="linear-gradient(90deg, #f4a97f, #FED7B8)" />
        </div>
        <div className="card chartbox wide">
          <h3>Enrolments, last days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={r.daily} margin={{ right: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,60,160,0.15)" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 11 }} interval="preserveStartEnd" padding={{ left: 22, right: 14 }} tickMargin={10} />
              <YAxis allowDecimals={false} tickMargin={8} width={34} domain={[0, (m) => Math.max(3, m + 1)]} />
              <Tooltip separator=": " formatter={(v) => [v, "Enrolments"]} labelFormatter={(d) => d} />
              <Line type="monotone" dataKey="enrollments" stroke="#6a48cf" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8, strokeWidth: 3, stroke: "#ffffff" }} />
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
      <p className="muted sub">Platform overview, content moderation and activity summary.</p>
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





