import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controller/authController";
import { User } from "../entity/User";
import UserService from "../services/userService";
import logger from "../config/logger";
import registerValidator from "../validators/registerValidator";
import TokenService from "../services/tokenService";

const authRouter = Router();

const userService = new UserService(User);
const tokenService = new TokenService();

const authController = new AuthController(tokenService, userService, logger);

authRouter.post(
  "/register",
  registerValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.register(req, res, next);
  }
);

export default authRouter;
