import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
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

export default function Quiz() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    setResult(null);
    setAnswers({});
    api("/quizzes/" + id).then(setData).catch((e) => setError(e.message));
  }
  useEffect(load, [id]);

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const r = await tryPaths(
        ["/quizzes/" + id + "/submit", "/quizzes/" + id + "/attempt", "/quizzes/" + id + "/attempts"],
        { method: "POST", body: { answers } }
      );
      setResult(r);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  if (!data) return <div className="container page">{error ? <p className="error">{error}</p> : <p className="muted">Loading...</p>}</div>;

  const { quiz, course, questions } = data;
  const answered = Object.keys(answers).length;
  const byId = {};
  if (result) result.results.forEach((r) => { byId[r.question_id] = r; });

  return (
    <div className="container page rise">
      {course && <Link to={"/courses/" + course.id} className="back">Back to {course.title}</Link>}
      <h1 style={{ marginTop: 14 }}>{quiz.title}</h1>
      <p className="muted">{questions.length} questions. You need {quiz.pass_percent}% to pass.</p>

      {result && (
        <div className={"card scorebox " + (result.passed ? "pass" : "fail")}>
          <h2>{result.percent}%</h2>
          <p>{result.score} of {result.total} correct. {result.passed ? "You passed. Well done!" : "Not quite there yet. Review and try again."}</p>
          <button className="btn" onClick={load}><RotateCcw size={16} /> Try again</button>
        </div>
      )}

      <div className="questions">
        {questions.map((q, i) => {
          const r = byId[q.id];
          return (
            <div key={q.id} className="card q">
              <h3>{i + 1}. {q.text}</h3>
              {["a", "b", "c", "d"].map((k) => {
                const label = q["option_" + k];
                if (!label) return null;
                let cls = "opt";
                if (answers[q.id] === k) cls += " picked";
                if (r && r.correct_answer === k) cls += " right";
                if (r && r.your_answer === k && !r.is_correct) cls += " wrong";
                return (
                  <label key={k} className={cls}>
                    <input type="radio" name={"q" + q.id} disabled={!!result} checked={answers[q.id] === k} onChange={() => setAnswers({ ...answers, [q.id]: k })} />
                    <span>{label}</span>
                  </label>
                );
              })}
              {r && (
                <p className="explain">
                  {r.is_correct ? <CheckCircle2 size={16} className="ok-icon" /> : <XCircle size={16} className="bad-icon" />}
                  {" "}{r.explanation || (r.is_correct ? "Correct." : "Correct answer: " + r.correct_answer.toUpperCase())}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="error">{error}</p>}
      {!result && (
        <button className="btn" onClick={submit} disabled={busy || answered < questions.length}>
          {busy ? "Checking..." : "Submit answers (" + answered + "/" + questions.length + ")"}
        </button>
      )}
    </div>
  );
}
