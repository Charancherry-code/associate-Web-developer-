const express = require("express");
const { getStore } = require("../data/store");

const router = express.Router();

function mapTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

router.get("/", (req, res) => {
  const store = getStore();
  res.json({ data: store.tasks.map(mapTask) });
});

router.post("/", (req, res) => {
  const { title, description = "" } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "title is required" });
  }

  const store = getStore();
  const now = new Date().toISOString();

  const task = {
    id: store.nextTaskId++,
    title: title.trim(),
    description: String(description).trim(),
    createdAt: now,
    updatedAt: now,
  };

  store.tasks.push(task);
  return res.status(201).json({ data: mapTask(task) });
});

router.get("/:taskId", (req, res) => {
  const store = getStore();
  const taskId = Number(req.params.taskId);
  const task = store.tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "task not found" });
  }

  return res.json({ data: mapTask(task) });
});

router.put("/:taskId", (req, res) => {
  const store = getStore();
  const taskId = Number(req.params.taskId);
  const task = store.tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "task not found" });
  }

  const { title, description } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "title is required" });
  }

  task.title = title.trim();
  task.description = String(description || "").trim();
  task.updatedAt = new Date().toISOString();

  return res.json({ data: mapTask(task) });
});

router.delete("/:taskId", (req, res) => {
  const store = getStore();
  const taskId = Number(req.params.taskId);
  const taskIndex = store.tasks.findIndex((item) => item.id === taskId);

  if (taskIndex < 0) {
    return res.status(404).json({ message: "task not found" });
  }

  store.tasks.splice(taskIndex, 1);
  store.comments = store.comments.filter(
    (comment) => comment.taskId !== taskId,
  );

  return res.status(204).send();
});

module.exports = router;
