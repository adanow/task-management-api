import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  return res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
};

export const createTask = async (req: Request, res: Response) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }

  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      description: req.body.description || "",
    },
  });
  res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }
  const title = req.body.title;
  const description = req.body.description;
  const completed = req.body.completed;

  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
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
  try {
    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
};
