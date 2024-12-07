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
const constants_1 = require("../constants/constants");
const http_errors_1 = __importDefault(require("http-errors"));
const express_validator_1 = require("express-validator");
class UserController {
    constructor(userService, logger) {
        this.userService = userService;
        this.logger = logger;
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, role } = req.body;
            try {
                const user = yield this.userService.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                });
                this.logger.info(`User created successfully`, user._id);
                // @ts-ignore
                const _a = user._doc, { password: pw } = _a, userDocument = __rest(_a, ["password"]);
                res.status(201).json({
                    result: userDocument,
                    message: "User created successfully",
                    meta: null,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getUserLists();
                res.status(200).json({
                    result: users,
                    message: "User list fetched successfully",
                    meta: null,
                });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while fetching user list");
                next(err);
                return;
            }
        });
    }
    getUserDetailsById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield this.userService.findUserById(id);
                if (!user) {
                    res.status(404).json({
                        result: null,
                        message: constants_1.ERROR_MESSAGES.RESOURCES_NOT_FOUND,
                        meta: null,
                    });
                    return;
                }
                res.status(200).json({
                    result: user,
                    message: "User fetched successfully",
                    meta: null,
                });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while fetching user details");
                next(err);
                return;
            }
        });
    }
    deleteUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield this.userService.deleteUserById(id);
                res.json({
                    result: null,
                    message: "User deleted successfully",
                    meta: null,
                });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while deleting user");
                next(err);
                return;
            }
        });
    }
    updateUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const { id } = req.params;
            try {
                const result = (0, express_validator_1.validationResult)(req);
                if (!result.isEmpty()) {
                    res.status(400).json({ errors: result.array() });
                    return;
                }
                const updatedUser = yield this.userService.updateUserById(id, data);
                res.json({
                    result: updatedUser,
                    message: "User updated successfully",
                    meta: null,
                });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while updating user");
                next(err);
                return;
            }
        });
    }
}
exports.default = UserController;
