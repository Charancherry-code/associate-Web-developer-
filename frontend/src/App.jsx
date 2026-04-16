import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api";

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const save = async () => {
    await onUpdate(task.id, { title, description });
    setIsEditing(false);
  };

  return (
    <article className="task-card">
      {isEditing ? (
        <>
          <label>
            <span>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description || "No description yet."}</p>
        </>
      )}

      <div className="task-actions">
        {isEditing ? (
          <button className="btn-secondary" onClick={save}>
            Save
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button className="btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const stats = useMemo(() => {
    const withDescriptions = tasks.filter((task) => task.description).length;
    return {
      total: tasks.length,
      withDescriptions,
    };
  }, [tasks]);

  const loadTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onCreateTask = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createTask({ title, description });
      setTitle("");
      setDescription("");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const onUpdateTask = async (taskId, payload) => {
    setError("");
    try {
      await updateTask(taskId, payload);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const onDeleteTask = async (taskId) => {
    setError("");
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="hero" role="banner">
        <nav className="top-nav" aria-label="Primary">
          <p className="logo">PulseBoard</p>
          <a href="#tasks" className="nav-link">
            Jump to Tasks
          </a>
        </nav>
        <div className="hero-content">
          <div>
            <h1>Plan faster. Review smarter. Launch with confidence.</h1>
            <p>
              A fictional campaign workflow platform used for this assessment,
              built to demonstrate responsive layout, semantic structure, and
              clear CRUD interactions.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80"
            alt="Team collaborating around a planning board"
          />
        </div>
      </header>

      <main>
        <section className="metrics" aria-label="Task metrics">
          <article>
            <h2>{stats.total}</h2>
            <p>Total Tasks</p>
          </article>
          <article>
            <h2>{stats.withDescriptions}</h2>
            <p>Detailed Tasks</p>
          </article>
        </section>

        <section
          id="tasks"
          className="task-section"
          aria-labelledby="task-section-heading"
        >
          <div className="section-head">
            <h2 id="task-section-heading">Task Manager (Bonus)</h2>
            <p>
              Add, edit, and delete tasks through the Node/Express CRUD API.
            </p>
          </div>

          <form onSubmit={onCreateTask} className="task-form">
            <label>
              <span>Task title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: Build tablet breakpoint"
                required
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional notes"
              />
            </label>
            <button type="submit" className="btn-primary">
              Add Task
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          {isLoading ? (
            <p className="status">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="status">No tasks yet. Create your first one.</p>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
