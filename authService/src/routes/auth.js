"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controller/authController"));
const User_1 = require("../entity/User");
const userService_1 = __importDefault(require("../services/userService"));
const logger_1 = __importDefault(require("../config/logger"));
const registerValidator_1 = __importDefault(require("../validators/registerValidator"));
const tokenService_1 = __importDefault(require("../services/tokenService"));
const RefreshToken_1 = require("../entity/RefreshToken");
const loginValidator_1 = __importDefault(require("../validators/loginValidator"));
const credentialService_1 = __importDefault(require("../services/credentialService"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const validateRefreshToken_1 = __importDefault(require("../middlewares/validateRefreshToken"));
const parseRefreshToken_1 = __importDefault(require("../middlewares/parseRefreshToken"));
const authRouter = (0, express_1.Router)();
const userService = new userService_1.default(User_1.User);
const tokenService = new tokenService_1.default(RefreshToken_1.RefreshToken);
const credentialService = new credentialService_1.default(User_1.User);
const authController = new authController_1.default(tokenService, userService, credentialService, logger_1.default);
authRouter.get("/self", authenticate_1.default, (req, res, next) => {
    authController.self(req, res, next);
});
authRouter.post("/register", registerValidator_1.default, (req, res, next) => {
    authController.register(req, res, next);
});
authRouter.post("/login", loginValidator_1.default, (req, res, next) => {
    authController.login(req, res, next);
});
authRouter.post("/refresh", validateRefreshToken_1.default, (req, res, next) => {
    authController.refresh(req, res, next);
});
authRouter.post("/logout", authenticate_1.default, parseRefreshToken_1.default, (req, res, next) => {
    authController.logout(req, res, next);
});
exports.default = authRouter;
