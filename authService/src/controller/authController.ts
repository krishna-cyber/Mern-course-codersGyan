import { NextFunction, Request, Response } from "express";
import { UserData } from "../types/types";
import UserService from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";

import TokenService from "../services/tokenService";
import CredentialService from "../services/credentialService";

interface RegisterUserRequest extends Request {
  body: UserData;
}
class AuthController {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private credentialService: CredentialService,
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

      const payload = {
        sub: String(user._id),
        role: user.role,
      };

      const accessToken: string = this.tokenService.getAccessToken(payload);
      const refreshToken: string =
        await this.tokenService.getRefreshToken(payload);

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, //1 hr to expire
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 24 * 30, //1 month to expire
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

  //login controller
  // async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
  //   try {
  //     const result = validationResult(req);
  //     if (!result.isEmpty()) {
  //       return res.status(400).json({ errors: result.array() });
  //     }
  //     const { email, password } = req.body;

  //     //check for email and password matched or not
  //     const user = await this.userService.findUserByEmail(email);

  //     if (!user) {
  //       const err = createHttpError(400, "Invalid email or password");
  //       next(err);
  //       return;
  //     }

  //     const isMatched = await this.credentialService.checkForPasswordMatch(
  //       password,
  //       user.password
  //     );

  //     const payload = {
  //       sub: String(user._id),
  //       role: user.role,
  //     };

  //     const accessToken: string = this.tokenService.getAccessToken(payload);
  //     const refreshToken: string = this.tokenService.getRefreshToken(payload);

  //     res.cookie("accessToken", accessToken, {
  //       domain: "localhost",
  //       httpOnly: true,
  //       sameSite: "strict",
  //       maxAge: 1000 * 60 * 60, //1 hr to expire
  //     });

  //     res.cookie("refreshToken", refreshToken, {
  //       domain: "localhost",
  //       httpOnly: true,
  //       sameSite: "strict",
  //       maxAge: 1000 * 60 * 24 * 30, //1 month to expire
  //     });

  //     await this.tokenService.saveRefreshToken(refreshToken, user._id);

  //     res.status(201).json({
  //       result: user,
  //       message: "User registered successfully",
  //     });
  //   } catch (error) {
  //     next(error);
  //     return;
  //   }
  // }
}

export default AuthController;
