import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check route
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
  });

  // API routes
  app.use("/api/v1", router);

  // Error handler
  // app.use(errorHandler);
  app.use(
    errorHandler as (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => void
  );

  return app;
};
