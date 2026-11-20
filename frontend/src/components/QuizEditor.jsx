import { useEffect, useState } from "react";
import { Plus, Trash2, Trophy } from "lucide-react";
import { api } from "../api.js";

const blankQ = () => ({ text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a", explanation: "" });

export default function QuizEditor({ courseId, initial, onSaved }) {
  const [title, setTitle] = useState("Final quiz");
  const [pass, setPass] = useState(60);
  const [qs, setQs] = useState([blankQ()]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "Final quiz");
      setPass(initial.pass_percent || 60);
      if (initial.questions && initial.questions.length) setQs(initial.questions.map((q) => { const o = q.options || []; return { ...blankQ(), ...q, option_a: o[0] || q.option_a || "", option_b: o[1] || q.option_b || "", option_c: o[2] || q.option_c || "", option_d: o[3] || q.option_d || "", correct_answer: q.correct || q.correct_answer || "a" }; }));
    }
  }, [initial]);

  const upd = (i, k, v) => setQs(qs.map((q, j) => (j === i ? { ...q, [k]: v } : q)));

  async function save(e) {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      await api("/instructor/courses/" + courseId + "/quiz", {
        method: "PUT",
        body: { title, pass_percent: Number(pass), questions: qs.map((q) => ({ text: q.text, options: [q.option_a, q.option_b, q.option_c, q.option_d], correct: q.correct_answer, explanation: q.explanation })) },
      });
      setMsg("Quiz saved.");
      if (onSaved) onSaved();
    } catch (err) { setError(err.message); }
  }

  return (
    <form onSubmit={save} className="quizedit">
      <h2><Trophy size={22} style={{ verticalAlign: -3 }} /> Course quiz</h2>
      <div className="card">
        <div className="two">
          <div><label>Quiz title</label><input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div><label>Pass mark (%)</label><input type="number" min="1" max="100" value={pass} onChange={(e) => setPass(e.target.value)} /></div>
        </div>
      </div>
      {qs.map((q, i) => (
        <div key={i} className="card qedit">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3>Question {i + 1}</h3>
            {qs.length > 1 && <button type="button" className="iconbtn" onClick={() => setQs(qs.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={16} /></button>}
          </div>
          <input placeholder="Question text" value={q.text} onChange={(e) => upd(i, "text", e.target.value)} required />
          {["a", "b", "c", "d"].map((k) => (
            <label key={k} className="optrow">
              <input type="radio" name={"c" + i} checked={q.correct_answer === k} onChange={() => upd(i, "correct_answer", k)} />
              <input placeholder={"Option " + k.toUpperCase()} value={q["option_" + k]} onChange={(e) => upd(i, "option_" + k, e.target.value)} required />
            </label>
          ))}
          <p className="muted small">Select the circle next to the correct answer.</p>
          <input placeholder="Explanation (shown after the quiz)" value={q.explanation} onChange={(e) => upd(i, "explanation", e.target.value)} />
        </div>
      ))}
      <div className="row" style={{ marginTop: 14 }}>
        <button type="button" className="btn ghost" onClick={() => setQs([...qs, blankQ()])}><Plus size={16} /> Add question</button>
        <button className="btn">Save quiz</button>
      </div>
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}


