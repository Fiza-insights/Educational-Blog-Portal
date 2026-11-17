import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function MyLearning() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) api("/courses/mine/enrolled").then((d) => setCourses(d.courses)).catch((e) => setError(e.message));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container page rise">
      <h1>My Learning</h1>
      <p className="muted">Pick up where you left off.</p>
      {error && <p className="error">{error}</p>}
      {courses && courses.length === 0 && (
        <p className="muted">You have not enrolled in any course yet. <Link to="/courses">Browse courses</Link></p>
      )}
      <div className="grid" style={{ marginTop: 24 }}>
        {(courses || []).map((c) => (
          <Link key={c.id} to={"/courses/" + c.id} className="card hover course-card">
            <h3>{c.title}</h3>
            <p className="muted small">By {c.instructor_name}</p>
            <div className="progress"><span style={{ width: c.progress.percent + "%" }} /></div>
            <p className="muted small" style={{ marginTop: 8 }}>{c.progress.completed} of {c.progress.total} lessons ({c.progress.percent}%)</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
