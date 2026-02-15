import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.task.deleteMany(); // czyści tabelę przed każdym testem
});

afterAll(async () => {
  await prisma.$disconnect(); // zamyka połączenie po wszystkich testach
});

describe("GET /health", () => {
  it("should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
