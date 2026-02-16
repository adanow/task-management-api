import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.task.deleteMany(); // czyści tabelę przed każdym testem
});

afterAll(async () => {
  await prisma.$disconnect(); // zamyka połączenie po wszystkich testach
});

describe("GET /tasks", () => {
  it("200: array of tasks", async () => {
    await request(app).post("/tasks").send({ title: "Test task" });

    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Test task");
    expect(response.body[0].completed).toBe(false);
  });
});

describe("GET /tasks/{id}", () => {
  it("200: single task", async () => {
    const created = await request(app).post("/tasks").send({ title: "Test task" });

    const response = await request(app).get(`/tasks/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Test task");
    expect(response.body.completed).toBe(false);
  });

  it("404: not existing task", async () => {
    const response = await request(app).get("/tasks/11");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });

  it("400: invalid id", async () => {
    const response = await request(app).get("/tasks/testId");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid ID" });
  });
});

describe("POST /tasks", () => {
  it("201: create new task", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Mój piaty task", description: "Testowy task" });

    expect(response.status).toBe(201);
    expect(response.body.description).toBe("Testowy task");
    expect(response.body.title).toBe("Mój piaty task");
    expect(response.body.completed).toBe(false);
  });

  it("400: missing title", async () => {
    const response = await request(app).post("/tasks").send({ description: "Testowy task" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid input: expected string, received undefined",
    });
  });
});

describe("DELETE /tasks/{id}", () => {
  it("204: delete existing task", async () => {
    const created = await request(app).post("/tasks").send({ title: "Test task" });

    const response = await request(app).delete(`/tasks/${created.body.id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("404: delete non existing task", async () => {
    const response = await request(app).delete("/tasks/11");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });
});

describe("PUT /tasks/{id}", () => {
  it("200: update existing task", async () => {
    const created = await request(app).post("/tasks").send({ title: "Test task" });

    const response = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ title: "test description", description: "test description" });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.description).toBe("test description");
    expect(response.body.title).toBe("test description");
    expect(response.body.completed).toBe(false);
  });

  it("404: non existing task", async () => {
    const response = await request(app)
      .put("/tasks/11")
      .send({ title: "test description", description: "test description" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });

  it("400: invalid id", async () => {
    const response = await request(app)
      .put("/tasks/test")
      .send({ title: "test description", description: "test description" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid ID" });
  });

  it("400: missing title", async () => {
    const created = await request(app).post("/tasks").send({ title: "Test" });

    const response = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ description: "only description" });

    expect(response.status).toBe(400);
  });
});
