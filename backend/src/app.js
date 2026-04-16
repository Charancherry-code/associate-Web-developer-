const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const commentRoutes = require("./routes/comments");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/tasks/:taskId/comments", commentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "route not found" });
});

module.exports = app;
