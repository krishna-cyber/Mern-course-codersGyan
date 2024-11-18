import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controller/authController";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import UserService from "../services/userService";

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const authController = new AuthController(userService);

authRouter.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);

export default authRouter;
