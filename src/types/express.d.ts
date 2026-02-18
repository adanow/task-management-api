import "express";

declare module "express" {
  interface Request {
    resourceId?: number;
    userId?: number;
  }
}
