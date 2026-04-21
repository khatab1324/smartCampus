import type { Request, Response } from "express";
import { getHealth } from "../use-cases/get-health.use-case.js";

export function getHealthController(_req: Request, res: Response) {
  res.status(200).json(getHealth());
}
