import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";

const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  const err = createHttpError(401, "You can't access this route");
  res.status(200).json({ message: "Hello World" });
  next(err);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err.statusCode);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
