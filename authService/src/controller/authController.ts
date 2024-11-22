import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { UserData } from "../types/types";
import UserService from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
interface RegisterUserRequest extends Request {
  body: UserData;
}
class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const { firstName, lastName, email, password } = req.body;
      this.logger.debug(`User registration request`, {
        firstName,
        lastName,
        email,
      });
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info(`User registered successfully`, {
        firstName,
        lastName,
        email,
      });
      res.status(201).json({
        result: user,
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default AuthController;
