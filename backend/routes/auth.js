const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

function makeToken(u) {
  return jwt.sign({ id: u.id, name: u.name, role: u.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

router.post("/register", function (req, res) {
  const name = String((req.body || {}).name || "").trim();
  const email = String((req.body || {}).email || "").trim().toLowerCase();
  const password = String((req.body || {}).password || "");
  const role = (req.body || {}).role === "instructor" ? "instructor" : "student";
  if (name.length < 2) return res.status(400).json({ error: "Please enter your name" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return res.status(409).json({ error: "This email is already registered" });
  const info = db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(name, email, bcrypt.hashSync(password, 10), role);
  const user = { id: info.lastInsertRowid, name: name, email: email, role: role };
  res.status(201).json({ token: makeToken(user), user: user });
});

router.post("/login", function (req, res) {
  const email = String((req.body || {}).email || "").trim().toLowerCase();
  const password = String((req.body || {}).password || "");
  const u = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!u || !bcrypt.compareSync(password, u.password_hash)) return res.status(401).json({ error: "Wrong email or password" });
  res.json({ token: makeToken(u), user: { id: u.id, name: u.name, email: u.email, role: u.role } });
});

router.get("/me", authenticate, function (req, res) {
  const u = db.prepare("SELECT id, name, email, role, bio FROM users WHERE id = ?").get(req.user.id);
  if (!u) return res.status(401).json({ error: "Account not found" });
  res.json({ user: u });
});

module.exports = router;
