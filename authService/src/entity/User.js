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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants/constants");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
        default: constants_1.ROLES.CUSTOMER,
    },
    tenantId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tenant",
    },
}, { timestamps: true });
// hash password before saving to the database
userSchema.pre("save", function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password"))
        return next();
    const saltRounds = 5;
    // hash the password using our new salt
    bcryptjs_1.default.hash(user.password, saltRounds, function (err, hash) {
        if (err)
            return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});
//define function for password comparision
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return yield bcryptjs_1.default.compare(candidatePassword, user.password);
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
