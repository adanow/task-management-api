import { Request, Response, NextFunction } from "express";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  req.resourceId = id;
  next();
};
