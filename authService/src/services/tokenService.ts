import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Config } from "../config/config";
import createHttpError from "http-errors";
import { Model, ObjectId } from "mongoose";
import { RefreshTokenDocument } from "../entity/RefreshToken";

class TokenService {
  constructor(private RefreshToken: Model<RefreshTokenDocument>) {}

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

  //persist refreshToken in DB
  async saveRefreshToken(token: string, userId: unknown) {
    try {
      const refreshToken = new this.RefreshToken({
        refreshToken: token,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
      });
      await refreshToken.save();
    } catch (error) {
      console.log(error);
      const err = createHttpError(500, "Error saving refresh token");
      throw err;
    }
  }
}

export default TokenService;