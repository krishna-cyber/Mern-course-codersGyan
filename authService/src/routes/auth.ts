import { NextFunction, Request, Response, Router } from "express";
import AuthController from "../controller/authController";
import { User } from "../entity/User";
import UserService from "../services/userService";
import logger from "../config/logger";
import registerValidator from "../validators/registerValidator";
import TokenService from "../services/tokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/loginValidator";
import CredentialService from "../services/credentialService";

const authRouter = Router();

const userService = new UserService(User);
const tokenService = new TokenService(RefreshToken);
const credentialService = new CredentialService();

const authController = new AuthController(
  tokenService,
  userService,
  credentialService,
  logger
);

authRouter.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
  }
);

// authRouter.post(
//   "/login",
//   loginValidator,
//   (req: Request, res: Response, next: NextFunction) => {
//     authController.login(req, res, next);
//   }
// );

export default authRouter;
