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
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../utils/testUtils");
const constants_1 = require("../../src/constants/constants");
const User_1 = require("../../src/entity/User");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const RefreshToken_1 = require("../../src/entity/RefreshToken");
const app_1 = __importDefault(require("../../src/app"));
dotenv_1.default.config({
    path: ".env.test.local",
});
describe("POST /auth/register", () => {
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
        mongoose_1.default.modelNames().map((model) => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.models[model].deleteMany({});
        }));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.User.deleteMany({});
        yield (0, testUtils_1.closeDatabaseConnection)();
    }));
    describe("given all fields", () => {
        it("should return 201 statusCode ", () => __awaiter(void 0, void 0, void 0, function* () {
            //AAA Pattern (Arrange, Act, Assert)
            // Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "password",
            };
            // Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Assert
            expect(response.statusCode).toBe(201);
        }));
        it("should return valid JSON response", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "123456",
            };
            // Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Assert
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        }));
        it("should persist user in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "123456",
            };
            //@ts-ignore
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            //Assert
            const user = yield User_1.User.find();
            expect(user).toHaveLength(1);
        }));
        it("should return id of the user", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //Act and Assert
            //@ts-ignore
            const user = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Assert  // user must have id
            expect(user.body).toHaveProperty("result._id");
        }));
        it("should assign a customer role to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //@ts-ignore
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = yield User_1.User.find();
            expect(user[0].role).toBe(constants_1.ROLES.CUSTOMER);
        }));
        it("should return hashed password ", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = response;
            expect(user.body.result.password).not.toBe(userData.password);
        }));
        it("should return 400 status code if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //@ts-ignore
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            //Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = yield User_1.User.find({ email: userData.email });
            //Assert
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(1); //confirmation only one user exist in the database
        }));
        it("should return access token and refresh token inside a cookie", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            let accessToken = null;
            let refreshToken = null;
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            //Act
            const cookies = response.headers["set-cookie"] || [];
            cookies.forEach((cookie) => {
                //get access token send by server as cookie
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                //get refresh Token sent by server as cookie
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
            //  check for the jwt token
            expect((0, testUtils_1.isJWT)(accessToken)).toBeTruthy(); // check if the token is a valid jwt token
            expect((0, testUtils_1.isJWT)(refreshToken)).toBeTruthy(); // check if the token is a valid jwt token
        }));
        it("should persist refresh token in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            //Act
            const refreshToken = yield RefreshToken_1.RefreshToken.find({});
            //Assert
            expect(refreshToken).toHaveLength(1);
        }));
        it("should refresh token persist in the database with the correct userId", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            //Act
            const refreshToken = yield RefreshToken_1.RefreshToken.find({});
            //Assert
            expect(String(refreshToken[0].userId)).toBe(response.body.result._id);
        }));
    });
    describe("missing fields", () => {
        it("should return 400 status code if email field is missing , user should not be registered", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                password: "13456",
            };
            //Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = yield User_1.User.find({}); //Assert
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
        }));
        it("should return 400 status code if firstName field is missing , user should not be registered", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = yield User_1.User.find({}); //Assert
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
        }));
        it("should return 400 status code if lastName field is missing , user should not be registered", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                email: "tiwarikrishna54321@gmail.com",
                password: "13456",
            };
            //Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = yield User_1.User.find({}); //Assert
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
        }));
        it("should return 400 status code if password field is missing , user should not be registered", () => __awaiter(void 0, void 0, void 0, function* () {
            //Arrange
            const userData = {
                firstName: "Krishna",
                lastName: "Tiwari",
                email: "tiwarikrishna54321@gmail.com",
            };
            //Act
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const user = yield User_1.User.find({}); //Assert
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
        }));
    });
    describe("if fields are not properly formatted", () => { });
});
