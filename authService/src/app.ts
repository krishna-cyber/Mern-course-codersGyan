import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";
// import "./data-source";

import "../src/data-source";

const app = express();

app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan("dev"));

// get connected with database and start the server

// router binding
app.use("/auth", authRouter);

// app.post(
//   "/auth/register",
//   (req: Request, res: Response, next: NextFunction) => {
//     const err = createHttpError(401, "You can't access this route");
//     res.status(200).json({ message: "Hello World" });
//     next(err);
//   }
// );

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err.statusCode);
  const statusCode = err.statusCode || 500;
  console.log(err.statusCode);

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
