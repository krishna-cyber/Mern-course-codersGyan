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
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../utils/testUtils");
const constants_1 = require("../../src/constants/constants");
const User_1 = require("../../src/entity/User");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const mock_jwks_1 = __importDefault(require("mock-jwks"));
dotenv_1.default.config({
    path: ".env.test.local",
});
let jwks;
describe("GET /auth/self", () => {
    //get connection from the data source
    //before all test cases this function will rul
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jwks = (0, mock_jwks_1.default)("https://localhost:3001");
        yield (0, testUtils_1.connectToDatabase)();
        mongoose_1.default.modelNames().map((model) => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.models[model].deleteMany({});
        }));
        // await User.deleteMany({}); //clean up the database
        // await RefreshToken.deleteMany({}); //clean up the database
    }));
    beforeEach(() => {
        jwks.start();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        //clean up the database database truncate
        yield User_1.User.deleteMany({});
        jwks.stop(); //stop the mock server
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testUtils_1.closeDatabaseConnection)();
    }));
    describe("given all fields", () => {
        it("should return 200 status code", () => __awaiter(void 0, void 0, void 0, function* () {
            const accessToken = jwks.token({
                sub: "1",
                role: constants_1.ROLES.CUSTOMER,
            });
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        }));
        it("should return user data", () => __awaiter(void 0, void 0, void 0, function* () {
            //register a user
            const userData = {
                email: "tiwarikrishna54321@gmail.com",
                password: "password",
                firstName: "Krishna",
                lastName: "Tiware",
            };
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const accessToken = jwks.token({
                sub: String(response.body.result._id),
                role: response.body.role,
            });
            //@ts-ignore
            const userSelf = yield (0, supertest_1.default)(app_1.default)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`]);
            //assert
            expect(userSelf.body._id).toBe(response.body.result._id);
        }));
    });
});
