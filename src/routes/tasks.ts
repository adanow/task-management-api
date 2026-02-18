import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  patchTask,
  updateTask,
} from "../controllers/tasksController";
import { auth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";

const router = Router();

router.get("/", auth, getAllTasks);

router.get("/:id", auth, validateId, getTaskById);

router.post("/", auth, createTask);

router.put("/:id", auth, validateId, updateTask);

router.patch("/:id", auth, validateId, patchTask);

router.delete("/:id", auth, validateId, deleteTask);

export default router;
