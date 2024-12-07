"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantSchema = exports.Tenants = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tenantSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
    },
    address: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.tenantSchema = tenantSchema;
const Tenants = mongoose_1.default.model("Tenant", tenantSchema);
exports.Tenants = Tenants;
