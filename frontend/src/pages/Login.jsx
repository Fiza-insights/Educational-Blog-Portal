import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

const DEMOS = [
  { role: "Admin", email: "admin@emberly.test", password: "Admin@123" },
  { role: "Instructor", email: "instructor1@emberly.test", password: "Instructor@123" },
  { role: "Student", email: "student@emberly.test", password: "Student@123" },
];

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [picked, setPicked] = useState("");
  const [forgot, setForgot] = useState(false);
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

  function fill(d) {
    setEmail(d.email);
    setPassword(d.password);
    setPicked(d.role);
    setError("");
  }

  return (
    <div className="container auth rise">
      <form className="card" onSubmit={submit}>
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue learning and writing.</p>
        <label>Email</label>
        <input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <div className="pw">
          <input type={show ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="forgotrow">
          <button type="button" className="linkbtn" onClick={() => setForgot(!forgot)}>Forgot password?</button>
        </div>
        {forgot && <p className="note">Password reset is not part of this demo. Please use one of the demo accounts below.</p>}
        {error && <p className="error shake" style={{ marginTop: 12 }}>{error}</p>}
        <button className="btn wide" disabled={busy}><LogIn size={16} /> {busy ? "Logging in..." : "Log in"}</button>
        <p className="muted" style={{ marginTop: 16 }}>New here? <Link to="/register">Create an account</Link></p>
        <div className="demo">
          <span className="muted">Click a role to fill demo login:</span>
          {DEMOS.map((d) => (
            <button key={d.role} type="button" className={"badge" + (picked === d.role ? " on" : "")} onClick={() => fill(d)}>{d.role}</button>
          ))}
        </div>
      </form>
    </div>
  );
}


