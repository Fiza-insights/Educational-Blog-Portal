import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Clock } from "lucide-react";
import { api } from "../api.js";
import { SkeletonGrid } from "../components/Skeleton.jsx";

export const tagName = (t) => (typeof t === "string" ? t : t.name);

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);
  const [visible, setVisible] = useState(9);

  useEffect(() => {
    api("/posts?limit=100").then((d) => setPosts(d.posts)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const cats = Array.from(new Set(posts.map((p) => p.category_name).filter(Boolean)));
  const tags = Array.from(new Set(posts.flatMap((p) => (p.tags || []).map(tagName))));
  const shown = posts.filter((p) =>
    (!q || (p.title + " " + (p.excerpt || "")).toLowerCase().includes(q.toLowerCase())) &&
    (!cat || p.category_name === cat) &&
    (!tag || (p.tags || []).map(tagName).includes(tag))
  );

  return (
    <div className="container page rise">
      <h1>Blog</h1>
      <p className="muted">Stories, tips and ideas from our community of writers.</p>
      <div className="filters two">
        <input placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="row tagrow">
        <button className={"badge tagbtn" + (!tag ? " on" : "")} onClick={() => setTag("")}>All tags</button>
        {(showAllTags ? tags : tags.slice(0, 8)).map((t) => (
          <button key={t} className={"badge tagbtn" + (tag === t ? " on" : "")} onClick={() => setTag(tag === t ? "" : t)}>#{t}</button>
        ))}
      </div>
      {tags.length > 8 && <button className="linkbtn" onClick={() => setShowAllTags(!showAllTags)}>{showAllTags ? "Show fewer tags" : "Show all " + tags.length + " tags"}</button>}{error && <p className="error">{error}</p>}
      {loading && <SkeletonGrid />}
      {!loading && !error && shown.length === 0 && <p className="muted">No articles match your search.</p>}
      <div key={q + "|" + cat + "|" + tag} className="grid" style={{ marginTop: 22 }}>
        {shown.slice(0, visible).map((p) => (
          <Link key={p.id} to={"/blog/" + p.slug} className="card hover course-card">
            <span className="badge">{p.category_name}</span>
            <h3 style={{ marginTop: 12 }}>{p.title}</h3>
            <p className="muted clamp">{p.excerpt}</p>
            <p className="muted small">By {p.author_name}</p>
            <div className="meta">
              <span><Clock size={14} /> {p.reading_min} min read</span>
              <span><MessageCircle size={14} /> {p.comment_count}</span>
            </div>
          </Link>
        ))}
      </div>{shown.length > visible && <div className="loadmore"><button className="btn ghost" onClick={() => setVisible(visible + 9)}>Load more articles</button></div>}
    </div>
  );
}



