import { Router } from "express";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const router = Router();
const tasks: Task[] = [
  {
    id: 1,
    title: "Nauczyć się TypeScript",
    description: "Przejść tutorial TS",
    completed: false,
  },
  {
    id: 2,
    title: "Nauczyć się pisać kod",
    description: "Przejść tutorial TS",
    completed: false,
  },
];

router.get("/", (_req, res) => {
  res.json(tasks);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

router.post("/", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }

  if (tasks.find((t) => t.title === req.body.title)) {
    return res.status(400).json({ error: "Task already exists" });
  }

  const newTask: Task = {
    id: tasks.length + 1, // proste generowanie ID
    title: req.body.title,
    description: req.body.description || "",
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put("/:id", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }

  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex < 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex] = {
    id: id,
    title: req.body.title,
    description: req.body.description || "",
    completed: req.body.completed ?? false,
  };

  res.status(200).json(tasks[taskIndex]);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex < 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

export default router;
