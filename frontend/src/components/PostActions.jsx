import { useState } from "react";
import { Heart, Bookmark, Share2 } from "lucide-react";

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; }
}
function write(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {}
}

export default function PostActions({ id }) {
  const [liked, setLiked] = useState(read("emberly_likes").includes(id));
  const [saved, setSaved] = useState(read("emberly_marks").includes(id));
  const [pop, setPop] = useState("");
  const [note, setNote] = useState("");

  function burst(name) {
    setPop(name);
    setTimeout(() => setPop(""), 500);
  }

  function toggle(key, on, setOn, name) {
    const list = read(key).filter((x) => x !== id);
    if (!on) list.push(id);
    write(key, list);
    setOn(!on);
    burst(name);
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
      <button className={"act" + (liked ? " on like" : "") + (pop === "like" ? " pop" : "")} onClick={() => toggle("emberly_likes", liked, setLiked, "like")}>
        <Heart size={18} fill={liked ? "currentColor" : "none"} /> {liked ? "Liked" : "Like"}
      </button>
      <button className={"act" + (saved ? " on" : "") + (pop === "save" ? " pop" : "")} onClick={() => toggle("emberly_marks", saved, setSaved, "save")}>
        <Bookmark size={18} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
      </button>
      <button className={"act" + (pop === "share" ? " pop" : "")} onClick={share}>
        <Share2 size={18} /> Share
      </button>
      {note && <span className="success small">{note}</span>}
    </div>
  );
}
