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
const Tenants_1 = require("../../src/entity/Tenants");
const supertest_1 = __importDefault(require("supertest"));
const testUtils_1 = require("../utils/testUtils");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: ".env.test.local",
});
describe("POST /tenants", () => {
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
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Tenants_1.Tenants.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        Tenants_1.Tenants.deleteMany({});
        yield (0, testUtils_1.closeDatabaseConnection)();
    }));
    describe("given all fields", () => {
        it("it should return 201 status code", () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantData = {
                name: "tenant1",
                address: "address1",
            };
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/tenants").send(tenantData);
            expect(response.statusCode).toBe(201);
        }));
        it("it should persist tenant information in the database and return the tenant information", () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantData = {
                name: "tenant1",
                address: "address1",
            };
            //@ts-ignore
            const response = yield (0, supertest_1.default)(app_1.default).post("/tenants").send(tenantData);
            expect(response.body).toHaveProperty("result.name", tenantData.name);
            expect(response.body).toHaveProperty("result.address", tenantData.address);
        }));
        it.todo("it should return 400 status code if the tenant name is already exist in the database");
    });
});
