import express from "express";
import tasksRouter from "./routes/tasks";
import authRouter from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter";

const app = express();

app.use(express.json());
app.use(globalLimiter);
app.use("/tasks", tasksRouter);
app.use("/auth", authLimiter, authRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
