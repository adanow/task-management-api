import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function createUser(): Promise<void> {
  await request(app).post("/auth/register").send({ email: "test@test.com", password: "123456" });
}

describe("POST /auth/login", () => {
  it("200: login with existing user", async () => {
    await createUser();

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("401: login with non-existing user", async () => {
    await createUser();

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test1@test.com", password: "123456" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });

  it("401: login with invalid password", async () => {
    await createUser();

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });
});

describe("POST /auth/register", () => {
  it("200: register new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com", password: "123456" });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("test@test.com");
    expect(response.body.id).toBeDefined();
    expect(response.body.password).toBeUndefined();
  });

  it("409: register with existing email", async () => {
    await createUser();
    const response = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com", password: "123456" });

    expect(response.status).toBe(409);
  });

  it("401: register without email", async () => {
    const response = await request(app).post("/auth/register").send({ password: "123456" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid input: expected string, received undefined");
  });

  it("401: register without password", async () => {
    const response = await request(app).post("/auth/register").send({ email: "test@test.com" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid input: expected string, received undefined");
  });
});
