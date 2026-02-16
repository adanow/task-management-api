import express from "express";
import tasksRouter from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use("/tasks", tasksRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
