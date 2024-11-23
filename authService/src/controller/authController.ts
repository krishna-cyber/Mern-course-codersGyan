import { NextFunction, Request, Response } from "express";
import { UserData } from "../types/types";
import UserService from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import fs from "fs";
import path from "path";
import { Config } from "../config/config";

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
      let privateK: Buffer;
      try {
        privateK = fs.readFileSync(
          path.join(__dirname, "../../certs/privateKey.pem")
        );
      } catch (error) {
        const err = createHttpError(
          500,
          "Error generating private key for JWT"
        );
        next(err);
        return;
      }
      const accessToken: string = jwt.sign(
        {
          sub: String(user._id),
          role: user.role,
        },
        privateK,
        {
          algorithm: "RS256",
          expiresIn: "1h",
          issuer: "authService",
        }
      );
      // const refreshToken: string = jwt.sign(
      //   { sub: String(user._id), role: user.role },
      //   Config.JWT_REFRESH_TOKEN_SECRET as string,
      //   {
      //     algorithm: "HS256",
      //     expiresIn: "30d",
      //   }
      // );

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, //1 hr to expire
      });

      res.cookie("refreshToken", "jsklfsdfl", {
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
}

export default AuthController;
