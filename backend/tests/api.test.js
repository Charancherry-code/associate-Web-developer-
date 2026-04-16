const request = require("supertest");
const app = require("../src/app");
const { resetStore } = require("../src/data/store");

describe("Task and Comment CRUD API", () => {
  beforeEach(() => {
    resetStore();
  });

  test("creates, reads, updates, and deletes tasks", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Build hero section", description: "Landing page fold" })
      .expect(201);

    expect(created.body.data.title).toBe("Build hero section");

    const taskId = created.body.data.id;

    const list = await request(app).get("/api/tasks").expect(200);
    expect(list.body.data).toHaveLength(1);

    const updated = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: "Build full landing page",
        description: "Responsive all breakpoints",
      })
      .expect(200);

    expect(updated.body.data.title).toBe("Build full landing page");

    await request(app).delete(`/api/tasks/${taskId}`).expect(204);

    const listAfterDelete = await request(app).get("/api/tasks").expect(200);
    expect(listAfterDelete.body.data).toHaveLength(0);
  });

  test("creates, lists, updates, and deletes comments for a task", async () => {
    const task = await request(app)
      .post("/api/tasks")
      .send({ title: "API task" })
      .expect(201);

    const taskId = task.body.data.id;

    const createdComment = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .send({ author: "Charan", text: "Initial draft complete" })
      .expect(201);

    const commentId = createdComment.body.data.id;

    const listComments = await request(app)
      .get(`/api/tasks/${taskId}/comments`)
      .expect(200);

    expect(listComments.body.data).toHaveLength(1);
    expect(listComments.body.data[0].text).toBe("Initial draft complete");

    const updatedComment = await request(app)
      .put(`/api/tasks/${taskId}/comments/${commentId}`)
      .send({ author: "Charan", text: "Updated after QA review" })
      .expect(200);

    expect(updatedComment.body.data.text).toBe("Updated after QA review");

    await request(app)
      .delete(`/api/tasks/${taskId}/comments/${commentId}`)
      .expect(204);

    const finalComments = await request(app)
      .get(`/api/tasks/${taskId}/comments`)
      .expect(200);

    expect(finalComments.body.data).toHaveLength(0);
  });

  test("returns 404 when creating comments for unknown task", async () => {
    const response = await request(app)
      .post("/api/tasks/999/comments")
      .send({ text: "hello" })
      .expect(404);

    expect(response.body.message).toMatch(/task not found/i);
  });
});
