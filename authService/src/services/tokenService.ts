import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Config } from "../config/config";
import createHttpError from "http-errors";

class TokenService {
  constructor() {}

  //get private key for JWT
  getAccessTokenPrivateKey(): Buffer {
    let privateK: Buffer;
    try {
      privateK = fs.readFileSync(
        path.join(__dirname, "../../certs/privateKey.pem")
      );
      return privateK;
    } catch (error) {
      const err = createHttpError(500, "Error generating private key for JWT");
      throw err;
    }
  }

  //return accessToken
  getAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, this.getAccessTokenPrivateKey(), {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "authService",
    });
  }

  //return refreshtoken
  getRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, String(Config.JWT_REFRESH_TOKEN_SECRET), {
      jwtid: String(payload._id),
      algorithm: "HS256",
      expiresIn: "30d",
      issuer: "authService",
    });
  }
}

export default TokenService;
