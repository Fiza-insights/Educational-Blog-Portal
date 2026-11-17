import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
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
        <input value={form.name} onChange={set("name")} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={set("email")} required />
        <label>Password (min 6 characters)</label>
        <input type="password" value={form.password} onChange={set("password")} required />
        <label>I want to</label>
        <select value={form.role} onChange={set("role")}>
          <option value="student">Learn (student)</option>
          <option value="instructor">Teach (instructor)</option>
        </select>
        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
        <button className="btn" style={{ marginTop: 18, width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>
        <p className="muted" style={{ marginTop: 16 }}>Already a member? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
