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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants/constants");
class AuthController {
    constructor(tokenService, userService, credentialService, logger) {
        this.tokenService = tokenService;
        this.userService = userService;
        this.credentialService = credentialService;
        this.logger = logger;
    }
    resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (0, express_validator_1.validationResult)(req);
                if (!result.isEmpty()) {
                    return res.status(400).json({ errors: result.array() });
                }
                const { firstName, lastName, email, password } = req.body;
                this.logger.debug(`User registration request`, {
                    firstName,
                    lastName,
                    email,
                });
                const user = yield this.userService.create({
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
                const accessToken = this.tokenService.getAccessToken(payload);
                const refreshToken = yield this.tokenService.getRefreshToken(payload);
                this.resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken);
                // @ts-ignore
                const _a = user._doc, { password: pw } = _a, userData = __rest(_a, ["password"]);
                res.status(201).json({
                    result: userData,
                    message: "User registered successfully",
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    //login controller
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (0, express_validator_1.validationResult)(req);
                if (!result.isEmpty()) {
                    return res.status(400).json({ errors: result.array() });
                }
                const { email, password } = req.body;
                //check for email and password matched or not
                const user = yield this.userService.findUserByEmail(email, true);
                if (!user) {
                    const err = (0, http_errors_1.default)(400, constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
                    next(err);
                    return;
                }
                const isMatched = yield this.credentialService.checkForPasswordMatch(password, user.password);
                if (!isMatched) {
                    const err = (0, http_errors_1.default)(400, constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
                    next(err);
                    return;
                }
                const payload = {
                    sub: String(user._id),
                    role: user.role,
                };
                const accessToken = this.tokenService.getAccessToken(payload);
                const refreshToken = yield this.tokenService.getRefreshToken(payload);
                this.resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken);
                //@ts-ignore
                const _a = user._doc, { password: pw } = _a, userData = __rest(_a, ["password"]);
                res.status(200).json({
                    result: userData,
                    message: "User login successfully",
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    self(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.findUserById(req.auth.sub);
                res.status(200).json({
                    result: user,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.findUserById(req.auth.sub);
                if (!user) {
                    const err = (0, http_errors_1.default)(410, constants_1.ERROR_MESSAGES.USER_DELETED);
                    next(err);
                    return;
                }
                const payload = {
                    sub: String(user._id),
                    role: user.role,
                };
                const accessToken = this.tokenService.getAccessToken(payload);
                const refreshToken = yield this.tokenService.getRefreshToken(payload);
                this.tokenService.removeRefreshToken(req.auth.jti);
                this.resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken);
                res.status(200).json({});
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.tokenService.removeRefreshToken(req.auth.jti);
                this.logger.info(`User logged out successfully`, req.auth.sub);
                this.logger.info(`Refresh token removed successfully`, req.auth.jti);
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                res.status(200).json({});
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
