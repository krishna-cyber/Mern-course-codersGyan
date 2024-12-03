import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import canAccess from "../middlewares/canAccess";
import { ROLES } from "../constants/constants";
import UserService from "../services/userService";
import { User } from "../entity/User";
import UserController from "../controller/userController";
const userRouter = Router();

const userService = new UserService(User);
const userController = new UserController(userService, logger);

userRouter.post(
  "/",
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    userController.createUser(req, res, next)
);

userRouter.get(
  "/",
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsers(req, res, next)
);

// userRouter
//   .route("/:id")
//   .get(
//     authenticate as RequestHandler,
//     canAccess([ROLES.ADMIN]) as RequestHandler,
//     (req: Request, res: Response, next: NextFunction) =>
//       userController.getTenantById(req, res, next)
//   )
//   .patch(
//     authenticate as RequestHandler,
//     canAccess([ROLES.ADMIN]) as RequestHandler,
//     (req: Request, res: Response, next: NextFunction) =>
//       userController.updateTenantById(req, res, next)
//   )
//   .delete(
//     authenticate as RequestHandler,
//     canAccess([ROLES.ADMIN]) as RequestHandler,
//     (req: Request, res: Response, next: NextFunction) =>
//       userController.deleteTenantById(req, res, next)
//   );

export default userRouter;
