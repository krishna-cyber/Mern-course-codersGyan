"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./config/logger"));
const startServer = () => {
    try {
        app_1.default.listen(config_1.Config.PORT, () => {
            logger_1.default.info(`Server is running on port ${config_1.Config.PORT}`, {
                port: config_1.Config.PORT,
            });
            logger_1.default.error(`This is an error log!`); // this log is consoled because it is an error log
            logger_1.default.debug(`Debugging is enabled!`); // this log is not consoled because we set priority level upto only info in logger transport
        });
    }
    catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger_1.default.info(`Error: ${error}`);
        process.exit(1);
    }
};
//start server function exported and server will started only if the connection to the database is successful
//check the data-source.ts file for the connection to the database
exports.default = startServer;
