import express from "express";
import tasksRouter from "./routes/tasks";

const app = express();

app.use(express.json());
app.use("/tasks", tasksRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// TODO: tutaj będziemy dodawać routes

export default app;
