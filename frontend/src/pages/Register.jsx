import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, GraduationCap, PenLine } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const d = await api("/auth/register", { method: "POST", body: form });
      login(d.token, d.user);
      nav(d.user.role === "instructor" ? "/instructor" : "/courses");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="container auth rise">
      <form className="card" onSubmit={submit}>
        <h2>Join Emberly</h2>
        <p className="muted">Learn new skills or share what you know.</p>
        <label>Full name</label>
        <input autoComplete="name" placeholder="Your full name" value={form.name} onChange={set("name")} required />
        <label>Email</label>
        <input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
        <label>Password</label>
        <div className="pw">
          <input type={show ? "text" : "password"} autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={set("password")} required />
          <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <label>I want to</label>
        <div className="roles">
          <button type="button" className={"role" + (form.role === "student" ? " on" : "")} onClick={() => setForm({ ...form, role: "student" })}>
            <GraduationCap size={20} /> <strong>Learn</strong><small>Join as a student</small>
          </button>
          <button type="button" className={"role" + (form.role === "instructor" ? " on" : "")} onClick={() => setForm({ ...form, role: "instructor" })}>
            <PenLine size={20} /> <strong>Teach</strong><small>Join as an instructor</small>
          </button>
        </div>
        {error && <p className="error shake" style={{ marginTop: 12 }}>{error}</p>}
        <button className="btn wide" disabled={busy}><UserPlus size={16} /> {busy ? "Creating..." : "Create account"}</button>
        <p className="muted" style={{ marginTop: 16 }}>Already a member? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
