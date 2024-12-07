"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = canAccess;
const http_errors_1 = __importDefault(require("http-errors"));
function canAccess(roles) {
    return (req, res, next) => {
        try {
            const { role } = req.auth;
            if (!roles.includes(role)) {
                const err = (0, http_errors_1.default)(403, "You do not have permission to access this resource");
                next(err);
            }
            next();
        }
        catch (error) {
            next(error);
            return;
        }
    };
}
