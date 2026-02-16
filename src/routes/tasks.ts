import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/tasksController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, getAllTasks);

router.get("/:id", auth, getTaskById);

router.post("/", auth, createTask);

router.put("/:id", auth, updateTask);

router.delete("/:id", auth, deleteTask);

export default router;
