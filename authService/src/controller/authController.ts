import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserData } from "../types/types";
import UserService from "../services/userService";
import { Logger } from "winston";
interface RegisterUserRequest extends Request {
  body: UserData;
}
class AuthController {
  userRepository = AppDataSource.getRepository(User);
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
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
