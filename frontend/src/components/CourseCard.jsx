import { Link } from "react-router-dom";
import { BookOpen, Clock, Users } from "lucide-react";

export default function CourseCard({ c }) {
  return (
    <Link to={"/courses/" + c.id} className="card hover course-card">
      <div className="thumb"><BookOpen size={34} /></div>
      <div className="row">
        <span className="badge">{c.category_name || "General"}</span>
        <span className="badge">{c.level}</span>
      </div>
      <h3>{c.title}</h3>
      <p className="muted clamp">{c.description}</p>
      <p className="muted small">By {c.instructor_name}</p>
      <div className="meta">
        <span><BookOpen size={14} /> {c.lesson_count} lessons</span>
        <span><Clock size={14} /> {c.duration_min} min</span>
        <span><Users size={14} /> {c.student_count}</span>
      </div>
    </Link>
  );
}
