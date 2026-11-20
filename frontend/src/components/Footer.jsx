import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footgrid">
        <div>
          <div className="logo" style={{ marginBottom: 10 }}>
            <span className="logomark"><GraduationCap size={20} /></span> Emberly
          </div>
          <p className="muted">Practical courses and thoughtful stories for everyday growth. A Codneura internship project by Fiza Saleem.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/courses">Courses</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/write">Write an article</Link>
          <Link to="/register">Join free</Link>
        </div>
        <div>
          <h4>Topics</h4>
          <Link to="/blog">Web Development</Link>
          <Link to="/blog">Design</Link>
          <Link to="/blog">Career Skills</Link>
          <Link to="/blog">Data and Python</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Log in</Link>
          <Link to="/my-learning">My learning</Link>
          <Link to="/instructor">Teach</Link>
        </div>
      </div>
      <p className="muted small copy">&copy; 2026 Emberly. Built with React, Node.js and SQLite. Icons by Lucide. All content is demo data.</p>
    </footer>
  );
}
