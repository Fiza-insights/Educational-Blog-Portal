import { useEffect, useState } from "react";
import { api } from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const [cat, setCat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/courses").then((d) => setCourses(d.courses)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const cats = Array.from(new Set(courses.map((c) => c.category_name).filter(Boolean)));
  const shown = courses.filter((c) =>
    (!q || (c.title + " " + c.description).toLowerCase().includes(q.toLowerCase())) &&
    (!level || c.level === level) &&
    (!cat || c.category_name === cat)
  );

  return (
    <div className="container page rise">
      <h1>Courses</h1>
      <p className="muted">Pick a course, learn lesson by lesson, and test yourself with a quiz.</p>
      <div className="filters">
        <input placeholder="Search courses..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && !error && shown.length === 0 && <p className="muted">No courses match your search.</p>}
      <div className="grid">{shown.map((c) => <CourseCard key={c.id} c={c} />)}</div>
    </div>
  );
}
