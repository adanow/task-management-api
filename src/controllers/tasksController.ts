import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { updateTaskSchema, createTaskSchema } from "../schemas/taskSchema";

export const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
  });
  return res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const task = await prisma.task.findUnique({
    where: { id },
  });
  if (!task || task.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
};

export const createTask = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const task = await prisma.task.create({
    data: {
      title: result.data.title,
      description: result.data.description || "",
      userId: req.userId,
    },
  });
  res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const result = updateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { title, description, completed } = result.data;

  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { title, description, completed },
    });

    res.status(200).json(task);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
};
