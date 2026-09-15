import type { NextFunction, Request, Response } from "express";

/**
 * Minimal shared-secret gate for the admin API. Swap for real auth
 * (session + role check against the `users` table) before shipping.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
