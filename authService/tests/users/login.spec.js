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
const User_1 = require("../../src/entity/User");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const RefreshToken_1 = require("../../src/entity/RefreshToken");
dotenv_1.default.config({
    path: ".env.test.local",
});
describe("POST /auth/login", () => {
    //get connection from the data source
    //before all test cases this function will rul
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testUtils_1.connectToDatabase)();
        mongoose_1.default.modelNames().map((model) => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.models[model].deleteMany({});
        }));
        // await User.deleteMany({}); //clean up the database
        // await RefreshToken.deleteMany({}); //clean up the database
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        //clean up the database database truncate
        yield User_1.User.deleteMany({});
        yield RefreshToken_1.RefreshToken.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testUtils_1.closeDatabaseConnection)();
    }));
    describe("given all fields", () => {
        it("should return 200 statusCode correct email,password Given ", () => __awaiter(void 0, void 0, void 0, function* () {
            //AAA Pattern (Arrange, Act, Assert)
            //register user
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "123456",
            };
            //@ts-ignore
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/auth/login")
                .send({ email: userData.email, password: userData.password });
            // Assert
            expect(response.statusCode).toBe(200);
        }));
        it("should return 400 statusCode for incorrect  email or password Given and message INVALID EMAIL OR PASSWORD ", () => __awaiter(void 0, void 0, void 0, function* () {
            //AAA Pattern (Arrange, Act, Assert)
            //register user
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "123456",
            };
            //@ts-ignore
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/auth/login")
                .send({ email: "wrongemail@gmail.com", password: userData.password });
            // Assert
            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid email or password");
        }));
        it.todo("should return error if extra field except email or password is given");
        it.todo("should return accessToken and refreshToken after login with valid email and password");
        describe("if fields are not properly formatted", () => { });
    });
    describe("missing fields", () => { });
});
