"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (0, express_validator_1.checkExact)((0, express_validator_1.checkSchema)({
    email: {
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Email should be a valid email address",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
    },
}));
