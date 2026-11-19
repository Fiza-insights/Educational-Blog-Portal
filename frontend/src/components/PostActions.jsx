import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, Share2 } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function PostActions({ id }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const [s, setS] = useState({ likes: 0, liked: false, saved: false });
  const [pop, setPop] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    api("/engage/posts/" + id).then(setS).catch(() => {});
  }, [id, user]);

  function burst(name) {
    setPop(name);
    setTimeout(() => setPop(""), 500);
  }

  async function toggle(kind) {
    if (!user) return nav("/login");
    try {
      const r = await api("/engage/posts/" + id + "/" + kind, { method: "POST" });
      setS(r);
      burst(kind);
    } catch (e) {
      setNote(e.message);
    }
  }

  async function share() {
    burst("share");
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: document.title, url });
      else { await navigator.clipboard.writeText(url); setNote("Link copied"); setTimeout(() => setNote(""), 2000); }
    } catch (e) {}
  }

  return (
    <div className="actions">
      <button className={"act" + (s.liked ? " on like" : "") + (pop === "like" ? " pop" : "")} onClick={() => toggle("like")}>
        <Heart size={18} fill={s.liked ? "currentColor" : "none"} /> {s.likes} {s.likes === 1 ? "Like" : "Likes"}
      </button>
      <button className={"act" + (s.saved ? " on" : "") + (pop === "save" ? " pop" : "")} onClick={() => toggle("save")}>
        <Bookmark size={18} fill={s.saved ? "currentColor" : "none"} /> {s.saved ? "Saved" : "Save"}
      </button>
      <button className={"act" + (pop === "share" ? " pop" : "")} onClick={share}>
        <Share2 size={18} /> Share
      </button>
      {note && <span className="success small">{note}</span>}
    </div>
  );
}
