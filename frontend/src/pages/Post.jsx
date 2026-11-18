import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { tagName } from "./Blog.jsx";
import PostActions from "../components/PostActions.jsx";

async function tryPaths(paths, options) {
  let best = null;
  for (const p of paths) {
    try {
      return await api(p, options);
    } catch (e) {
      if (!best || (best.message === "Request failed" && e.message !== "Request failed")) best = e;
    }
  }
  throw best;
}

export default function Post() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    tryPaths(["/posts/" + slug, "/posts/slug/" + slug]).then(setData).catch((e) => setError(e.message));
  }
  useEffect(() => { setData(null); load(); window.scrollTo(0, 0); }, [slug]);

  async function send(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      await tryPaths(["/posts/" + data.post.id + "/comments", "/posts/" + data.post.id + "/comment"], { method: "POST", body: { body: text } });
      setText("");
      setMsg("Comment sent.");
      load();
    } catch (err) {
      setMsg(err.message);
    }
    setBusy(false);
  }

  if (error) return <div className="container page"><p className="error">{error}</p></div>;
  if (!data) return <div className="container page"><p className="muted">Loading...</p></div>;

  const { post, comments, related } = data;

  return (
    <div className="container page rise">
      <div className="postwrap">
        <Link to="/blog" className="back">Back to blog</Link>
        <div className="row" style={{ marginTop: 14 }}>
          <span className="badge">{post.category_name}</span>
          {(post.tags || []).map((t) => <span key={tagName(t)} className="badge">#{tagName(t)}</span>)}
        </div>
        <h1 style={{ marginTop: 14 }}>{post.title}</h1>
        <p className="muted">
          By <strong>{post.author_name}</strong> | {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""} | <Clock size={14} style={{ verticalAlign: -2 }} /> {post.reading_min} min read
        </p>
        <PostActions id={post.id} />
        <article className="card prose" dangerouslySetInnerHTML={{ __html: post.body }} />

        <h2 style={{ marginTop: 40 }}>Comments ({comments.length})</h2>
        {user ? (
          <form onSubmit={send} className="card">
            <textarea rows="3" placeholder="Share your thoughts..." value={text} onChange={(e) => setText(e.target.value)} required />
            <button className="btn" style={{ marginTop: 12 }} disabled={busy}>{busy ? "Sending..." : "Post comment"}</button>
            {msg && <p className={msg === "Comment sent." ? "success" : "error"} style={{ marginTop: 10 }}>{msg}</p>}
          </form>
        ) : (
          <p className="muted"><Link to="/login">Log in</Link> to join the conversation.</p>
        )}
        <div className="comments">
          {comments.map((c) => (
            <div key={c.id} className="card comment">
              <strong>{c.user_name}</strong> <span className="muted small">{new Date(c.created_at).toLocaleDateString()}</span>
              <p style={{ margin: "6px 0 0" }}>{c.body}</p>
            </div>
          ))}
        </div>

        {related && related.length > 0 && (
          <>
            <h2 style={{ marginTop: 40 }}>Keep reading</h2>
            <div className="grid">
              {related.map((r) => (
                <Link key={r.id} to={"/blog/" + r.slug} className="card hover">
                  <h3>{r.title}</h3>
                  <p className="muted small">{r.author_name}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

