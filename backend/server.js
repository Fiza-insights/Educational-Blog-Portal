process.loadEnvFile();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", function (req, res) {
  res.json({ ok: true, app: "Emberly" });
});

app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/courses", require("./routes/courses.js"));
app.use("/api/quizzes", require("./routes/quizzes.js"));
app.use("/api", require("./routes/meta.js"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, function (err) {
  if (err) { console.error("Cannot start server:", err.message); return; }
  console.log("Emberly API running on http://localhost:" + PORT);
});
