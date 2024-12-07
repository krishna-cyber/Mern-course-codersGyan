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
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants/constants");
class UserService {
    constructor(User) {
        this.User = User;
    }
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ firstName, lastName, email, password, role }) {
            const user = new this.User({
                firstName,
                lastName,
                email,
                password,
                role: role || constants_1.ROLES.CUSTOMER,
            });
            //check for user already exist or not in the database
            const existingUser = yield this.User.findOne({ email });
            if (existingUser) {
                const err = (0, http_errors_1.default)(400, "User already exists with this email");
                throw err;
            }
            return yield user.save();
        });
    }
    findUserByEmail(email_1) {
        return __awaiter(this, arguments, void 0, function* (email, allFields = false) {
            return allFields
                ? yield this.User.findOne({ email }).select("+password")
                : yield this.User.findOne({ email });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.User.findById(id);
        });
    }
    getUserLists() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.User.find({});
        });
    }
    deleteUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.User.deleteOne({ _id });
        });
    }
    updateUserById(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.User.findByIdAndUpdate(_id, data, {
                new: true,
            });
        });
    }
}
exports.default = UserService;
