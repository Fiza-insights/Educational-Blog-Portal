import { Link, NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  function out() {
    logout();
    setOpen(false);
    nav("/");
  }

  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav-in">
        <Link to="/" className="logo" onClick={close}>
          <span className="logomark"><GraduationCap size={20} /></span> Emberly
        </Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
        <nav className={"links" + (open ? " open" : "")}>
          <NavLink to="/courses" onClick={close}>Courses</NavLink>
          <NavLink to="/blog" onClick={close}>Blog</NavLink>
          {user && <NavLink to="/my-learning" onClick={close}>My Learning</NavLink>}
          {user && (user.role === "instructor" || user.role === "admin") && (
            <NavLink to="/instructor" onClick={close}>Teach</NavLink>
          )}
          {user && <NavLink to="/write" onClick={close}>Write</NavLink>}
          {user && user.role === "admin" && <NavLink to="/admin" onClick={close}>Admin</NavLink>}
          {user ? (
            <button className="btn ghost" onClick={out}><LogOut size={16} /> {user.name.split(" ")[0]}</button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => "btn ghost" + (isActive ? " here" : "")} onClick={close}>Log in</NavLink>
              <NavLink to="/register" className={({ isActive }) => "btn" + (isActive ? " here" : "")} onClick={close}>Join free</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}



