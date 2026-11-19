const express = require("express");
const db = require("../db");
const { authenticate, optionalAuth } = require("../middleware/auth");

const router = express.Router();

function postExists(id) {
  return db.prepare("SELECT id FROM posts WHERE id = ?").get(id);
}

function state(postId, userId) {
  const likes = db.prepare("SELECT COUNT(*) AS n FROM post_likes WHERE post_id = ?").get(postId).n;
  const liked = userId ? !!db.prepare("SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?").get(postId, userId) : false;
  const saved = userId ? !!db.prepare("SELECT 1 FROM post_bookmarks WHERE post_id = ? AND user_id = ?").get(postId, userId) : false;
  return { likes: likes, liked: liked, saved: saved };
}

router.get("/posts/:id", optionalAuth, function (req, res) {
  const id = Number(req.params.id);
  if (!postExists(id)) return res.status(404).json({ error: "Post not found" });
  res.json(state(id, req.user ? req.user.id : null));
});

function toggle(table) {
  return function (req, res) {
    const id = Number(req.params.id);
    if (!postExists(id)) return res.status(404).json({ error: "Post not found" });
    const row = db.prepare("SELECT 1 FROM " + table + " WHERE post_id = ? AND user_id = ?").get(id, req.user.id);
    if (row) db.prepare("DELETE FROM " + table + " WHERE post_id = ? AND user_id = ?").run(id, req.user.id);
    else db.prepare("INSERT INTO " + table + " (user_id, post_id) VALUES (?, ?)").run(req.user.id, id);
    res.json(state(id, req.user.id));
  };
}

router.post("/posts/:id/like", authenticate, toggle("post_likes"));
router.post("/posts/:id/save", authenticate, toggle("post_bookmarks"));

router.get("/saved", authenticate, function (req, res) {
  const ids = db.prepare("SELECT post_id FROM post_bookmarks WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id).map(function (r) { return r.post_id; });
  res.json({ ids: ids });
});

module.exports = router;
