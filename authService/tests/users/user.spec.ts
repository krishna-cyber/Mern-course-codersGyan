import app from "../../src/app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { ROLES } from "../../src/constants/constants";
import { User } from "../../src/entity/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
import createJWKSMock from "mock-jwks";

dotenv.config({
  path: ".env.test.local",
});

let jwks: ReturnType<typeof createJWKSMock>;

describe("GET /auth/self", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    jwks = createJWKSMock("https://localhost:3001");

    await connectToDatabase();
    mongoose.modelNames().map(async (model) => {
      await mongoose.models[model].deleteMany({});
    });
    // await User.deleteMany({}); //clean up the database
    // await RefreshToken.deleteMany({}); //clean up the database
  });

  beforeEach(() => {
    jwks.start();
  });

  afterEach(async () => {
    //clean up the database database truncate
    await User.deleteMany({});
    jwks.stop(); //stop the mock server
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("should return 200 status code", async () => {
      const accessToken = jwks.token({
        sub: "1",
        role: ROLES.CUSTOMER,
      });

      //@ts-ignore
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it("should return user data", async () => {
      //register a user
      const userData = {
        email: "tiwarikrishna54321@gmail.com",
        password: "password",
        firstName: "Krishna",
        lastName: "Tiware",
      };
      //@ts-ignore
      const response = await request(app).post("/auth/register").send(userData);

      const accessToken = jwks.token({
        sub: String(response.body.result._id),
        role: response.body.role,
      });

      //@ts-ignore
      const userSelf = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`]);

      //assert
      expect(userSelf.body._id).toBe(response.body.result._id);
    });
  });
});
