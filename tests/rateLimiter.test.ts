import express from "express";
import request from "supertest";
import rateLimit from "express-rate-limit";

const testLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Too many requests, please try again later" },
});
const app = express();

app.use(testLimiter);
app.get("/test", (_req, res) => {
  res.status(200).json({ message: "all good" });
});

describe("Rate Limiter", () => {
  it("429: block requests after exceeding limit", async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get("/test");
      expect(res.status).toBe(200);
    }

    const response = await request(app).get("/test");
    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: "Too many requests, please try again later" });
  });
});
