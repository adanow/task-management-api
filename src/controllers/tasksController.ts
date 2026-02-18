import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  updateTaskSchema,
  createTaskSchema,
  taskQuerySchema,
  patchTaskSchema,
} from "../schemas/taskSchema";

export const getAllTasks = async (req: Request, res: Response) => {
  const result = taskQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }
  const { page, limit, completed, search, sort, order, priority } = result.data;
  const where: any = { userId: req.userId };

  if (completed !== undefined) {
    where.completed = completed === "true";
  }
  if (priority !== undefined) {
    where.priority = priority;
  }
  if (search) {
    where.title = { contains: search };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort]: order },
    }),
    prisma.task.count({ where }),
  ]);

  return res.json({
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
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

  try {
    const task = await prisma.task.create({
      data: {
        title: result.data.title,
        description: result.data.description || "",
        userId: req.userId!,
      },
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: "Failed to create task" });
  }
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

export const patchTask = async (req: Request, res: Response) => {
  const result = patchTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id },
    data: result.data,
  });

  res.status(200).json(task);
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
