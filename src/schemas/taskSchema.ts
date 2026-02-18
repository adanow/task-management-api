import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const patchTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const taskQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  completed: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["title", "createdAt"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});
