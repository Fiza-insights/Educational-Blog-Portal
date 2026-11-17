import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, PenLine, Trophy, UserPlus, Sparkles } from "lucide-react";
import { api } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postTotal, setPostTotal] = useState(0);

  useEffect(() => {
    api("/courses").then((d) => setCourses(d.courses)).catch(() => {});
    api("/posts?limit=3").then((d) => { setPosts(d.posts); setPostTotal(d.total); }).catch(() => {});
  }, []);

  const lessons = courses.reduce((n, c) => n + (c.lesson_count || 0), 0);
  const learners = courses.reduce((n, c) => n + (c.student_count || 0), 0);

  const steps = [
    { icon: <UserPlus size={22} />, t: "Join", d: "Create a free account as a student or an instructor." },
    { icon: <BookOpen size={22} />, t: "Learn", d: "Follow short lessons and watch your progress bar grow." },
    { icon: <Trophy size={22} />, t: "Test", d: "Take a quiz at the end and see where you stand." },
    { icon: <PenLine size={22} />, t: "Share", d: "Write articles with the rich editor and inspire others." },
  ];

  return (
    <div>
      <section className="hero">
        <div className="container hero-grid rise">
          <div>
            <span className="badge"><Sparkles size={13} /> Learn. Read. Grow.</span>
            <h1 className="hero-title">Learn a skill.<br />Read a story.<br /><em>Grow every day.</em></h1>
            <p className="lead">Emberly brings practical courses and thoughtful articles together in one warm, simple place.</p>
            <div className="row">
              <Link to="/courses" className="btn">Browse courses</Link>
              <Link to="/blog" className="btn ghost">Read the blog</Link>
            </div>
          </div>
          <div className="orb-wrap" aria-hidden="true">
            <div className="orb"><div className="orb-core" /></div>
            <div className="chip c1">{courses.length} courses</div>
            <div className="chip c2">{lessons} lessons</div>
            <div className="chip c3">Quizzes</div>
          </div>
        </div>
      </section>

      <section className="container stats">
        <div className="card stat"><strong>{courses.length}</strong><span>Courses</span></div>
        <div className="card stat"><strong>{lessons}</strong><span>Lessons</span></div>
        <div className="card stat"><strong>{learners}</strong><span>Enrolments</span></div>
        <div className="card stat"><strong>{postTotal}</strong><span>Articles</span></div>
      </section>

      <section className="container section">
        <div className="head"><h2>Popular courses</h2><Link to="/courses">See all</Link></div>
        <div className="grid">{courses.slice(0, 3).map((c) => <CourseCard key={c.id} c={c} />)}</div>
      </section>

      <section className="container section">
        <div className="head"><h2>How Emberly works</h2></div>
        <div className="steps">
          {steps.map((s, i) => (
            <div key={s.t} className="card step">
              <span className="num">0{i + 1}</span>
              <div className="ic">{s.icon}</div>
              <h3>{s.t}</h3>
              <p className="muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="head"><h2>Fresh from the blog</h2><Link to="/blog">See all</Link></div>
        <div className="grid">
          {posts.map((p) => (
            <Link key={p.id} to={"/blog/" + p.slug} className="card hover">
              <span className="badge">{p.category_name}</span>
              <h3 style={{ marginTop: 12 }}>{p.title}</h3>
              <p className="muted clamp">{p.excerpt}</p>
              <p className="muted small">{p.author_name} | {p.reading_min} min read</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
