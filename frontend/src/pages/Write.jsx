import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Undo2, Redo2 } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

function Toolbar({ editor }) {
  if (!editor) return null;
  const Btn = ({ on, active, label, children }) => (
    <button type="button" className={"tb" + (active ? " on" : "")} onClick={on} aria-label={label}>{children}</button>
  );
  return (
    <div className="toolbar">
      <Btn label="Bold" active={editor.isActive("bold")} on={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Btn>
      <Btn label="Italic" active={editor.isActive("italic")} on={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Btn>
      <Btn label="Heading 2" active={editor.isActive("heading", { level: 2 })} on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
      <Btn label="Heading 3" active={editor.isActive("heading", { level: 3 })} on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
      <Btn label="Bullet list" active={editor.isActive("bulletList")} on={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
      <Btn label="Numbered list" active={editor.isActive("orderedList")} on={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
      <Btn label="Quote" active={editor.isActive("blockquote")} on={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Btn>
      <Btn label="Undo" on={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></Btn>
      <Btn label="Redo" on={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></Btn>
    </div>
  );
}

export default function Write() {
  const { user } = useAuth();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ title: "", excerpt: "", category_id: "", tags: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [words, setWords] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => setWords(editor.getText().trim().split(/\s+/).filter(Boolean).length),
  });

  useEffect(() => {
    api("/categories").then((d) => {
      const list = d.categories || [];
      setCats(list);
      if (list[0]) setForm((f) => ({ ...f, category_id: list[0].id }));
    }).catch(() => {});
  }, []);

  if (!user) return <Navigate to="/login" />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api("/posts", {
        method: "POST",
        body: {
          title: form.title,
          excerpt: form.excerpt,
          body: editor.getHTML(),
          category_id: Number(form.category_id),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        },
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="container page rise" style={{ maxWidth: 640 }}>
        <div className="card" style={{ textAlign: "center", padding: 34 }}>
          <h2>Thank you!</h2>
          <p className="muted">Your article was sent to the admin for approval. It will appear on the blog once approved.</p>
          <button className="btn" onClick={() => { setDone(false); setWords(0); setForm({ ...form, title: "", excerpt: "", tags: "" }); }}>Write another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page rise">
      <h1>Write an article</h1>
      <p className="muted sub">Share what you know. An admin reviews every article before it is published.</p>
      <form className="writeform" onSubmit={submit}>
        <label>Title</label>
        <input placeholder="Give your article a clear title" value={form.title} onChange={set("title")} required />
        <label>Short summary</label>
        <input placeholder="A short summary for readers (1 or 2 sentences)" value={form.excerpt} onChange={set("excerpt")} required />
        <div className="two">
          <div>
            <label>Category</label>
            <select value={form.category_id} onChange={set("category_id")}>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label>Tags (comma separated)</label>
            <input value={form.tags} onChange={set("tags")} placeholder="react, beginners, tips" />
          </div>
        </div>
        <label>Article</label>
        <div className="editor">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
          <div className="wc">{words} {words === 1 ? "word" : "words"}</div>
        </div>
        {error && <p className="error shake" style={{ marginTop: 12 }}>{error}</p>}
        <button className="btn" style={{ marginTop: 18 }} disabled={busy}>{busy ? "Sending..." : "Send for approval"}</button>
        <p className="muted small" style={{ marginTop: 12 }}>After you send it, an admin reviews your article. It appears on the blog once it is approved.</p>
      </form>
    </div>
  );
}
