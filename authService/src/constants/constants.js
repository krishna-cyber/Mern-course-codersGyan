"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.ROLES = void 0;
const ROLES = {
    CUSTOMER: "customer",
    ADMIN: "admin",
    MANAGER: "manager",
};
exports.ROLES = ROLES;
const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    EMAIL_NOT_FOUND: "Email not found",
    INVALID_TOKEN: "Invalid token",
    UNAUTHORIZED: "Unauthorized",
    INVALID_REFRESH: "Invalid refresh token",
    USER_NOT_FOUND: "User not found",
    USER_DELETED: "User deleted",
    RESOURCES_NOT_FOUND: "Resources not found",
};
exports.ERROR_MESSAGES = ERROR_MESSAGES;
