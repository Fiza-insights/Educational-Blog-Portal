import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const d = await api("/auth/login", { method: "POST", body: { email, password } });
      login(d.token, d.user);
      nav(d.user.role === "admin" ? "/admin" : d.user.role === "instructor" ? "/instructor" : "/my-learning");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  function fill(e, p) {
    setEmail(e);
    setPassword(p);
  }

  return (
    <div className="container auth rise">
      <form className="card" onSubmit={submit}>
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue learning and writing.</p>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
        <button className="btn" style={{ marginTop: 18, width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Logging in..." : "Log in"}
        </button>
        <p className="muted" style={{ marginTop: 16 }}>New here? <Link to="/register">Create an account</Link></p>
        <div className="demo">
          <span className="muted">Demo accounts:</span>
          <button type="button" className="badge" onClick={() => fill("admin@emberly.test", "Admin@123")}>Admin</button>
          <button type="button" className="badge" onClick={() => fill("instructor1@emberly.test", "Instructor@123")}>Instructor</button>
          <button type="button" className="badge" onClick={() => fill("student@emberly.test", "Student@123")}>Student</button>
        </div>
      </form>
    </div>
  );
}

