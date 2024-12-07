"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../config/logger"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const canAccess_1 = __importDefault(require("../middlewares/canAccess"));
const constants_1 = require("../constants/constants");
const userService_1 = __importDefault(require("../services/userService"));
const User_1 = require("../entity/User");
const userController_1 = __importDefault(require("../controller/userController"));
const validateUserUpdataData_1 = __importDefault(require("../validators/validateUserUpdataData"));
const userRouter = (0, express_1.Router)();
const userService = new userService_1.default(User_1.User);
const userController = new userController_1.default(userService, logger_1.default);
userRouter.post("/", authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => userController.createUser(req, res, next));
userRouter.get("/", authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => userController.getUsers(req, res, next));
userRouter
    .route("/:id")
    .get(authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => userController.getUserDetailsById(req, res, next))
    .patch(authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), validateUserUpdataData_1.default, (req, res, next) => userController.updateUserById(req, res, next))
    .delete(authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => userController.deleteUserById(req, res, next));
exports.default = userRouter;
