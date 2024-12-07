"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config/config");
const http_errors_1 = __importDefault(require("http-errors"));
class TokenService {
    constructor(RefreshToken) {
        this.RefreshToken = RefreshToken;
    }
    //get private key for JWT
    getAccessTokenPrivateKey() {
        let privateK;
        try {
            privateK = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../certs/privateKey.pem"));
            return privateK;
        }
        catch (error) {
            const err = (0, http_errors_1.default)(500, "Error generating private key for JWT");
            throw err;
        }
        return privateK;
    }
    //return accessToken
    getAccessToken(payload) {
        const accessTokenPrivateKey = this.getAccessTokenPrivateKey();
        return jsonwebtoken_1.default.sign(payload, accessTokenPrivateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "authService",
        });
    }
    //return refreshtoken
    getRefreshToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = yield this.saveRefreshToken(payload.sub);
            return jsonwebtoken_1.default.sign(payload, String(config_1.Config.JWT_REFRESH_TOKEN_SECRET), {
                jwtid: String(_id),
                algorithm: "HS256",
                expiresIn: "30d",
                issuer: "authService",
            });
        });
    }
    //persist refreshToken in DB
    saveRefreshToken(userId) {
        try {
            const refreshToken = new this.RefreshToken({
                userId,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
            });
            return refreshToken.save();
        }
        catch (error) {
            console.log(error);
            const err = (0, http_errors_1.default)(500, "Error saving refresh token");
            throw err;
        }
    }
    //remove refreshToken from DB
    removeRefreshToken(jti) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.RefreshToken.findByIdAndDelete(jti);
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error removing refresh token");
                throw err;
            }
        });
    }
}
exports.default = TokenService;
