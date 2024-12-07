"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenantController_1 = __importDefault(require("../controller/tenantController"));
const tenantService_1 = __importDefault(require("../services/tenantService"));
const Tenants_1 = require("../entity/Tenants");
const logger_1 = __importDefault(require("../config/logger"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const canAccess_1 = __importDefault(require("../middlewares/canAccess"));
const constants_1 = require("../constants/constants");
const tenantRouter = (0, express_1.Router)();
const tenantservice = new tenantService_1.default(Tenants_1.Tenants);
const tenantController = new tenantController_1.default(tenantservice, logger_1.default);
tenantRouter.post("/", authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => tenantController.createTenant(req, res, next));
tenantRouter.get("/", authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => tenantController.getTenants(req, res, next));
tenantRouter
    .route("/:id")
    .get(authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => tenantController.getTenantById(req, res, next))
    .patch(authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => tenantController.updateTenantById(req, res, next))
    .delete(authenticate_1.default, (0, canAccess_1.default)([constants_1.ROLES.ADMIN]), (req, res, next) => tenantController.deleteTenantById(req, res, next));
exports.default = tenantRouter;
