import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, PenLine, Trophy, UserPlus, Sparkles, GraduationCap, Clock } from "lucide-react";
import { api } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postTotal, setPostTotal] = useState(0);

  useEffect(() => {
    api("/courses").then((d) => setCourses(d.courses)).catch(() => {});
    api("/posts?limit=20").then((d) => { const seen = new Set(); const pick = []; for (const p of d.posts) { if (!seen.has(p.category_name)) { seen.add(p.category_name); pick.push(p); } if (pick.length === 3) break; } setPosts(pick); setPostTotal(d.total); }).catch(() => {});
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
            <span className="badge"><Sparkles size={13} /> Practical Courses &amp; Stories</span>
            <h1 className="hero-title"><span className="l1">Learn practical skills.</span><br /><em>Read ideas that stay.</em></h1>
            <p className="lead">Short, focused courses and thoughtful stories designed to help you grow a little every day.</p>
            <div className="row">
              <Link to="/courses" className="btn">Browse courses</Link>
              <Link to="/blog" className="btn ghost">Read the blog</Link>
            </div>
          </div>
          <div className="orb-wrap" aria-hidden="true">
            <div className="orb"><div className="orbit"><span className="o1"><BookOpen size={18} /></span><span className="o2"><Trophy size={18} /></span><span className="o3"><PenLine size={18} /></span></div><div className="orb-core"><GraduationCap size={56} /></div></div>
            <div className="chip c1">Bite-sized lessons</div>
            <div className="chip c2">Guided articles</div>
            <div className="chip c3">Interactive quizzes</div>
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
              <p className="muted small byline"><span>{p.author_name}</span><span className="rt"><Clock size={13} /> {p.reading_min} min read</span></p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}




