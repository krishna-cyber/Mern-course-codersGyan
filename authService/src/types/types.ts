import { Request } from "express";
import * as jwt from "jsonwebtoken";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
  };
}

interface AuthCookie {
  accessToken: string;
  refreshToken: string;
}

export { UserData, AuthRequest, AuthCookie };
