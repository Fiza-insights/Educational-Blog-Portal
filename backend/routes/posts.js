const express = require("express");
const sanitizeHtml = require("sanitize-html");
const db = require("../db.js");
const { authenticate, optionalAuth, requireRole } = require("../middleware/auth.js");

const router = express.Router();

const CLEAN = {
  allowedTags: ["p", "br", "h2", "h3", "strong", "em", "u", "s", "ul", "ol", "li", "blockquote", "code", "pre", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }) },
};

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80); }
function readingMin(html) { return Math.max(1, Math.ceil(String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200)); }
function nowStr() { return new Date().toISOString().replace("T", " ").slice(0, 19); }

function uniqueSlug(title, ignoreId) {
  const base = slugify(title) || "post";
  let slug = base;
  let i = 2;
  while (true) {
    const row = db.prepare("SELECT id FROM posts WHERE slug = ?").get(slug);
    if (!row || row.id === ignoreId) return slug;
    slug = base + "-" + i++;
  }
}

function tagsOf(postId) {
  return db.prepare("SELECT t.name FROM tags t JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = ? ORDER BY t.name").all(postId).map(function (r) { return r.name; });
}

function setTags(postId, tags) {
  db.prepare("DELETE FROM post_tags WHERE post_id = ?").run(postId);
  tags.forEach(function (t) {
    db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").run(t);
    db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, (SELECT id FROM tags WHERE name = ?))").run(postId, t);
  });
}

function readPost(b) {
  const title = String(b.title || "").trim();
  const body = sanitizeHtml(String(b.body || ""), CLEAN).trim();
  const excerpt = String(b.excerpt || "").trim().slice(0, 240) || sanitizeHtml(body, { allowedTags: [] }).slice(0, 160);
  const category_id = Number(b.category_id) || null;
  const tags = (Array.isArray(b.tags) ? b.tags : String(b.tags || "").split(",")).map(function (t) { return String(t).toLowerCase().replace(/[^a-z0-9 -]/g, "").trim(); }).filter(Boolean).filter(function (t, i, a) { return a.indexOf(t) === i; }).slice(0, 5);
  if (title.length < 5) return { error: "Please enter a title (at least 5 characters)" };
  if (sanitizeHtml(body, { allowedTags: [] }).trim().length < 20) return { error: "The post body is too short" };
  if (category_id && !db.prepare("SELECT id FROM categories WHERE id = ?").get(category_id)) return { error: "Category not found" };
  return { data: { title: title, body: body, excerpt: excerpt, category_id: category_id, tags: tags } };
}

const CARD_SQL =
  "SELECT p.id, p.title, p.slug, p.excerpt, p.body, p.status, p.created_at, p.published_at, p.category_id, cat.name AS category_name, u.name AS author_name, " +
  "(SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = 'approved') AS comment_count " +
  "FROM posts p JOIN users u ON u.id = p.author_id LEFT JOIN categories cat ON cat.id = p.category_id";

function card(p) {
  const out = { ...p, tags: tagsOf(p.id), reading_min: readingMin(p.body) };
  delete out.body;
  return out;
}

router.get("/", function (req, res) {
  const where = ["p.status = 'published'"];
  const args = [];
  const q = String(req.query.search || "").trim();
  if (q) { where.push("(p.title LIKE ? OR p.excerpt LIKE ? OR p.body LIKE ?)"); args.push("%" + q + "%", "%" + q + "%", "%" + q + "%"); }
  if (req.query.category) { where.push("p.category_id = ?"); args.push(Number(req.query.category)); }
  if (req.query.tag) { where.push("p.id IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE t.name = ?)"); args.push(String(req.query.tag).toLowerCase()); }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 6));
  const w = " WHERE " + where.join(" AND ");
  const total = db.prepare("SELECT COUNT(*) AS n FROM posts p" + w).get(...args).n;
  const rows = db.prepare(CARD_SQL + w + " ORDER BY p.published_at DESC LIMIT ? OFFSET ?").all(...args, limit, (page - 1) * limit);
  res.json({ posts: rows.map(card), page: page, limit: limit, total: total, total_pages: Math.max(1, Math.ceil(total / limit)) });
});

router.get("/mine/list", authenticate, function (req, res) {
  const rows = db.prepare(CARD_SQL + " WHERE p.author_id = ? ORDER BY p.created_at DESC").all(req.user.id);
  res.json({ posts: rows.map(card) });
});

router.get("/:slug", optionalAuth, function (req, res) {
  const post = db.prepare(CARD_SQL + " WHERE p.slug = ?").get(req.params.slug);
  const mine = post && req.user && (req.user.role === "admin" || req.user.id === db.prepare("SELECT author_id FROM posts WHERE id = ?").get(post.id).author_id);
  if (!post || (post.status !== "published" && !mine)) return res.status(404).json({ error: "Post not found" });
  const comments = db.prepare("SELECT c.id, c.body, c.created_at, c.user_id, u.name AS user_name FROM comments c JOIN users u ON u.id = c.user_id WHERE c.post_id = ? AND c.status = 'approved' ORDER BY c.created_at").all(post.id);
  const related = db.prepare(CARD_SQL + " WHERE p.status = 'published' AND p.category_id = ? AND p.id != ? ORDER BY p.published_at DESC LIMIT 3").all(post.category_id, post.id).map(card);
  res.json({ post: { ...post, tags: tagsOf(post.id), reading_min: readingMin(post.body) }, comments: comments, related: related, can_edit: !!mine });
});

router.post("/", authenticate, requireRole("instructor", "admin"), function (req, res) {
  const r = readPost(req.body || {});
  if (r.error) return res.status(400).json({ error: r.error });
  const d = r.data;
  const asDraft = (req.body || {}).draft === true;
  const status = asDraft ? "draft" : req.user.role === "admin" ? "published" : "pending";
  const save = db.transaction(function () {
    const id = db.prepare("INSERT INTO posts (title, slug, excerpt, body, author_id, category_id, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(d.title, uniqueSlug(d.title), d.excerpt, d.body, req.user.id, d.category_id, status, status === "published" ? nowStr() : null).lastInsertRowid;
    setTags(id, d.tags);
    return id;
  });
  const id = save();
  res.status(201).json({ post: db.prepare("SELECT id, slug, status FROM posts WHERE id = ?").get(id) });
});

router.put("/:id", authenticate, function (req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (req.user.role !== "admin" && post.author_id !== req.user.id) return res.status(403).json({ error: "This is not your post" });
  const r = readPost(req.body || {});
  if (r.error) return res.status(400).json({ error: r.error });
  const d = r.data;
  let status = post.status;
  if ((req.body || {}).draft === true) status = "draft";
  else if (req.user.role !== "admin" && (post.status === "published" || post.status === "draft" || post.status === "rejected")) status = "pending";
  else if (req.user.role === "admin" && post.status === "draft") status = "published";
  const save = db.transaction(function () {
    db.prepare("UPDATE posts SET title = ?, slug = ?, excerpt = ?, body = ?, category_id = ?, status = ?, published_at = ? WHERE id = ?")
      .run(d.title, uniqueSlug(d.title, post.id), d.excerpt, d.body, d.category_id, status, status === "published" ? (post.published_at || nowStr()) : post.published_at, post.id);
    setTags(post.id, d.tags);
  });
  save();
  res.json({ post: db.prepare("SELECT id, slug, status FROM posts WHERE id = ?").get(post.id) });
});

router.delete("/comments/:commentId", authenticate, function (req, res) {
  const c = db.prepare("SELECT * FROM comments WHERE id = ?").get(req.params.commentId);
  if (!c) return res.status(404).json({ error: "Comment not found" });
  if (req.user.role !== "admin" && c.user_id !== req.user.id) return res.status(403).json({ error: "You can only delete your own comments" });
  db.prepare("DELETE FROM comments WHERE id = ?").run(c.id);
  res.json({ deleted: true });
});

router.delete("/:id", authenticate, function (req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (req.user.role !== "admin" && post.author_id !== req.user.id) return res.status(403).json({ error: "This is not your post" });
  db.prepare("DELETE FROM posts WHERE id = ?").run(post.id);
  res.json({ deleted: true });
});

router.post("/:id/comments", authenticate, function (req, res) {
  const post = db.prepare("SELECT id FROM posts WHERE id = ? AND status = 'published'").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  const body = sanitizeHtml(String((req.body || {}).body || ""), { allowedTags: [] }).trim();
  if (body.length < 2) return res.status(400).json({ error: "Please write a comment" });
  if (body.length > 1000) return res.status(400).json({ error: "Comment is too long (max 1000 characters)" });
  const id = db.prepare("INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)").run(post.id, req.user.id, body).lastInsertRowid;
  res.status(201).json({ comment: db.prepare("SELECT c.id, c.body, c.created_at, c.user_id, u.name AS user_name FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?").get(id) });
});

module.exports = router;
