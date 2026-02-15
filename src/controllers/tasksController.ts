import { Request, Response } from "express";
import { Task, tasks, getNextId } from "../models/task";

export const getAllTasks = (req: Request, res: Response) => {
  res.json(tasks);
};

export const getTaskById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
};

export const createTask = (req: Request, res: Response) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }

  if (tasks.find((t) => t.title === req.body.title)) {
    return res.status(400).json({ error: "Task already exists" });
  }

  const newTask: Task = {
    id: getNextId(),
    title: req.body.title,
    description: req.body.description || "",
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
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
};

export const deleteTask = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex < 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
};
