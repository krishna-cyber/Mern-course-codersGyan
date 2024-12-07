"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./config/logger"));
const auth_1 = __importDefault(require("./routes/auth"));
// import "./data-source";
require("../src/data-source");
const tenant_1 = __importDefault(require("./routes/tenant"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use((0, morgan_1.default)("dev"));
// get connected with database and start the server
// router binding
app.use("/auth", auth_1.default);
app.use("/tenants", tenant_1.default);
app.use("/users", user_1.default);
// app.post(
//   "/auth/register",
//   (req: Request, res: Response, next: NextFunction) => {
//     const err = createHttpError(401, "You can't access this route");
//     res.status(200).json({ message: "Hello World" });
//     next(err);
//   }
// );
app.use((err, req, res, next) => {
    logger_1.default.error(err.message, err.statusCode);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                value: err.value || "",
                msg: err.message,
                path: err.path || "",
                location: err.location || "",
            },
        ],
    });
});
exports.default = app;
