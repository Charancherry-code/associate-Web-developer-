const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (isLocalHost
    ? "http://localhost:4000/api"
    : "https://associate-production.up.railway.app/api");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export function getTasks() {
  return request("/tasks").then((res) => res.data);
}

export function createTask(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  }).then((res) => res.data);
}

export function updateTask(taskId, task) {
  return request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task),
  }).then((res) => res.data);
}

export function deleteTask(taskId) {
  return request(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
