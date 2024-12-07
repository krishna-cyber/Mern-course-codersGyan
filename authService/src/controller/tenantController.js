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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
class TenantController {
    constructor(tenantService, logger) {
        this.tenantService = tenantService;
        this.logger = logger;
    }
    createTenant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, address } = req.body;
            try {
                const tenant = yield this.tenantService.createTenant(name, address);
                this.logger.info(`Tenant created successfully`, tenant._id);
                res.status(201).json({
                    result: tenant,
                    message: "Tenant created successfully",
                    meta: null,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    getTenants(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenants = yield this.tenantService.getTenants();
                res.status(200).json({
                    result: tenants,
                    message: "Tenants fetched successfully",
                    meta: null,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    getTenantById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const tenant = yield this.tenantService.getTenantById(id);
                if (!tenant) {
                    res.status(404).json({
                        result: null,
                        message: constants_1.ERROR_MESSAGES.RESOURCES_NOT_FOUND,
                        meta: null,
                    });
                    return;
                }
                res.status(200).json({
                    result: tenant,
                    message: "Tenants fetched successfully",
                    meta: null,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    deleteTenantById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield this.tenantService.deleteTenantById(id);
                res.json({
                    result: null,
                    message: "Tenant deleted successfully",
                    meta: null,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    updateTenantById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = req.body;
            try {
                const updatedTenant = yield this.tenantService.updateTenantById(id, data);
                res.json({
                    result: updatedTenant,
                    message: "Tenant updated successfully",
                    meta: null,
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
}
exports.default = TenantController;
