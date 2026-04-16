const express = require("express");
const { getStore } = require("../data/store");

const router = express.Router({ mergeParams: true });

function mapComment(comment) {
  return {
    id: comment.id,
    taskId: comment.taskId,
    author: comment.author,
    text: comment.text,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

function findTask(taskId) {
  const store = getStore();
  return store.tasks.find((task) => task.id === taskId);
}

router.get("/", (req, res) => {
  const taskId = Number(req.params.taskId);

  if (!findTask(taskId)) {
    return res.status(404).json({ message: "task not found" });
  }

  const store = getStore();
  const comments = store.comments
    .filter((comment) => comment.taskId === taskId)
    .map(mapComment);

  return res.json({ data: comments });
});

router.post("/", (req, res) => {
  const taskId = Number(req.params.taskId);

  if (!findTask(taskId)) {
    return res.status(404).json({ message: "task not found" });
  }

  const { author = "Anonymous", text } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  const store = getStore();
  const now = new Date().toISOString();

  const comment = {
    id: store.nextCommentId++,
    taskId,
    author: String(author).trim() || "Anonymous",
    text: text.trim(),
    createdAt: now,
    updatedAt: now,
  };

  store.comments.push(comment);
  return res.status(201).json({ data: mapComment(comment) });
});

router.put("/:commentId", (req, res) => {
  const taskId = Number(req.params.taskId);

  if (!findTask(taskId)) {
    return res.status(404).json({ message: "task not found" });
  }

  const store = getStore();
  const commentId = Number(req.params.commentId);
  const comment = store.comments.find(
    (item) => item.id === commentId && item.taskId === taskId,
  );

  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }

  const { author, text } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  comment.author = String(author || comment.author).trim() || "Anonymous";
  comment.text = text.trim();
  comment.updatedAt = new Date().toISOString();

  return res.json({ data: mapComment(comment) });
});

router.delete("/:commentId", (req, res) => {
  const taskId = Number(req.params.taskId);

  if (!findTask(taskId)) {
    return res.status(404).json({ message: "task not found" });
  }

  const store = getStore();
  const commentId = Number(req.params.commentId);
  const commentIndex = store.comments.findIndex(
    (item) => item.id === commentId && item.taskId === taskId,
  );

  if (commentIndex < 0) {
    return res.status(404).json({ message: "comment not found" });
  }

  store.comments.splice(commentIndex, 1);
  return res.status(204).send();
});

module.exports = router;
