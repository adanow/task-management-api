import rateLimit from "express-rate-limit";

const skipRateLimit = process.env.RATE_LIMIT_SKIP === "true";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  message: { error: "Too many requests, please try again later" },
  skip: () => skipRateLimit,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later" },
  skip: () => skipRateLimit,
});
