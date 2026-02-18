import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect(); // zamyka połączenie po wszystkich testach
});

async function getAuthToken(): Promise<string> {
  await request(app).post("/auth/register").send({ email: "test@test.com", password: "123456" });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@test.com", password: "123456" });

  return res.body.token;
}

describe("GET /tasks", () => {
  it("200: first page of 5 tasks", async () => {
    const token = await getAuthToken();
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task1" });
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task2" });

    const response = await request(app)
      .get("/tasks?page=1&limit=5&sort=title&order=asc")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.meta.limit).toBe(5);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.total).toBe(2);
    expect(response.body.meta.totalPages).toBe(1);

    expect(response.body.data[0].title).toBe("Test task1");
    expect(response.body.data[1].title).toBe("Test task2");
  });

  it("200: filter by completed", async () => {
    const token = await getAuthToken();

    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Todo task" });

    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Done task" });

    await request(app)
      .put(`/tasks/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Done task", completed: true });

    const response = await request(app)
      .get("/tasks?completed=true")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Done task");
    expect(response.body.meta.total).toBe(1);
  });
});

describe("GET /tasks/{id}", () => {
  it("200: single task", async () => {
    const token = await getAuthToken();
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task" });

    const response = await request(app)
      .get(`/tasks/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Test task");
    expect(response.body.completed).toBe(false);
  });

  it("404: not existing task", async () => {
    const token = await getAuthToken();

    const response = await request(app).get("/tasks/11").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });

  it("400: invalid id", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .get("/tasks/testId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid ID" });
  });
});

describe("POST /tasks", () => {
  it("201: create new task", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .post("/tasks")
      .send({ title: "Mój piaty task", description: "Testowy task" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.description).toBe("Testowy task");
    expect(response.body.title).toBe("Mój piaty task");
    expect(response.body.completed).toBe(false);
  });

  it("400: missing title", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .post("/tasks")
      .send({ description: "Testowy task" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid input: expected string, received undefined",
    });
  });
});

describe("DELETE /tasks/{id}", () => {
  it("204: delete existing task", async () => {
    const token = await getAuthToken();
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task" });

    const response = await request(app)
      .delete(`/tasks/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("404: delete non existing task", async () => {
    const token = await getAuthToken();

    const response = await request(app).delete("/tasks/11").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });
});

describe("PUT /tasks/{id}", () => {
  it("200: update existing task", async () => {
    const token = await getAuthToken();
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task" });

    const response = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ title: "test description", description: "test description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.description).toBe("test description");
    expect(response.body.title).toBe("test description");
    expect(response.body.completed).toBe(false);
  });

  it("404: non existing task", async () => {
    const token = await getAuthToken();
    const response = await request(app)
      .put("/tasks/11")
      .send({ title: "test description", description: "test description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });

  it("400: invalid id", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .put("/tasks/test")
      .send({ title: "test description", description: "test description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid ID" });
  });

  it("400: missing title", async () => {
    const token = await getAuthToken();

    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task" });

    const response = await request(app)
      .put(`/tasks/${created.body.id}`)
      .send({ description: "only description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("PATCH /tasks/{id}", () => {
  it("200: update title only", async () => {
    const token = await getAuthToken();
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test title", description: "test description" });

    const response = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ title: "Updated title" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.description).toBe("test description");
    expect(response.body.title).toBe("Updated title");
    expect(response.body.completed).toBe(false);
  });

  it("200: update completed only", async () => {
    const token = await getAuthToken();
    const created = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test title", description: "test description" });

    const response = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ completed: true })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.description).toBe("test description");
    expect(response.body.title).toBe("Test title");
    expect(response.body.completed).toBe(true);
  });

  it("404: non existing task", async () => {
    const token = await getAuthToken();
    const response = await request(app)
      .patch("/tasks/11")
      .send({ title: "test description", description: "test description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });

  it("400: invalid id", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .patch("/tasks/test")
      .send({ title: "test description", description: "test description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid ID" });
  });

  it("400: empty body", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .patch("/tasks/test")
      .send({})
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "At least one field must be provided" });
  });
});
