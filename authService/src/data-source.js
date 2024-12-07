"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_1 = require("./config/config");
const logger_1 = __importDefault(require("./config/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./server"));
mongoose_1.default
    .connect(config_1.Config.MONGO_URI_ATLAS, {
    autoCreate: true,
})
    .then(() => {
    logger_1.default.info("MongoDB connection established successfully");
    (0, server_1.default)();
})
    .catch((error) => {
    logger_1.default.error("MongoDB connection failed", error);
});
