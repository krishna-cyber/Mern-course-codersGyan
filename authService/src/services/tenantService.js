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
class TenantService {
    constructor(Tenant) {
        this.Tenant = Tenant;
    }
    createTenant(name, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenant = new this.Tenant({
                    name,
                    address,
                });
                return yield tenant.save();
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while creating tenant");
                throw err;
            }
        });
    }
    getTenants() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Tenant.find({});
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while fetching tenants");
                throw err;
            }
        });
    }
    getTenantById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Tenant.findById(id);
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while fetching tenant");
                throw err;
            }
        });
    }
    deleteTenantById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Tenant.deleteOne({ _id });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while deleting tenant");
                throw err;
            }
        });
    }
    updateTenantById(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Tenant.findOneAndUpdate({ _id }, data, {
                    returnOriginal: false,
                });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Error while deleting tenant");
                throw err;
            }
        });
    }
}
exports.default = TenantService;
