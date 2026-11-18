import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "../api.js";

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

function embed(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? "https://www.youtube.com/embed/" + m[1] : url;
}

export default function Lesson() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setData(null);
    setError("");
    tryPaths(["/courses/lessons/" + id, "/lessons/" + id, "/courses/lesson/" + id]).then(setData).catch((e) => setError(e.message));
    window.scrollTo(0, 0);
  }, [id]);

  async function complete() {
    setBusy(true);
    try {
      await tryPaths(
        ["/courses/lessons/" + id + "/complete", "/lessons/" + id + "/complete", "/courses/lesson/" + id + "/complete"],
        { method: "POST" }
      );
      if (data.next_id) nav("/lesson/" + data.next_id);
      else setData({ ...data, completed: true });
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  if (error) return <div className="container page"><p className="error">{error}</p></div>;
  if (!data) return <div className="container page"><p className="muted">Loading...</p></div>;

  const l = data.lesson;
  const text = l.content || l.body || l.text || "";
  const video = l.video_url || l.video;

  return (
    <div className="container page rise">
      {l.course_id && <Link to={"/courses/" + l.course_id} className="back"><ArrowLeft size={16} /> Back to course</Link>}
      <h1 style={{ marginTop: 14 }}>{l.title}</h1>
      {video && (
        <div className="video"><iframe src={embed(video)} title={l.title} allowFullScreen /></div>
      )}
      <article className="card reader">
        {String(text).split(/\n+/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
      </article>
      <div className="lesson-nav">
        {data.prev_id ? <Link className="btn ghost" to={"/lesson/" + data.prev_id}><ArrowLeft size={16} /> Previous</Link> : <span />}
        {data.completed ? (
          <span className="badge ok"><CheckCircle2 size={14} /> Completed</span>
        ) : (
          <button className="btn" onClick={complete} disabled={busy}>{busy ? "Saving..." : "Mark complete"}</button>
        )}
        {data.next_id ? <Link className="btn ghost" to={"/lesson/" + data.next_id}>Next <ArrowRight size={16} /></Link> : <span />}
      </div>
    </div>
  );
}
